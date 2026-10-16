#!/usr/bin/env python3
"""Apply plan.json to the Zotero library through the Web API.

Needs ZOTERO_API_KEY (read/write) and ZOTERO_USER_ID in the environment. Idempotent:
collections that exist are reused, tags already present are kept, pinned keys are not
rewritten, linked attachments are added once. Items listed under "trash" are only
trashed with --trash; collections under "delete_collections" are deleted only when empty.

Usage: organize.py [--dry-run] [--trash]
"""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

API = "https://api.zotero.org"
PLAN = Path(__file__).with_name("plan.json")


class Zotero:
    def __init__(self, user: str, key: str, dry: bool):
        self.base = f"{API}/users/{user}"
        self.key, self.dry = key, dry
        self.version = 0

    def call(self, method: str, path: str, body=None, headers=None) -> tuple[int, object, dict]:
        req = urllib.request.Request(self.base + path, method=method,
                                     data=json.dumps(body).encode() if body is not None else None)
        req.add_header("Zotero-API-Key", self.key)
        req.add_header("Zotero-API-Version", "3")
        if body is not None:
            req.add_header("Content-Type", "application/json")
        for k, v in (headers or {}).items():
            req.add_header(k, v)
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                raw = r.read()
                hdrs = dict(r.headers)
                return r.status, (json.loads(raw) if raw else None), hdrs
        except urllib.error.HTTPError as e:
            raw = e.read().decode(errors="replace")
            sys.exit(f"{method} {path}: HTTP {e.code} {raw[:300]}")

    def get_all(self, path: str) -> list:
        out, start = [], 0
        while True:
            status, data, hdrs = self.call("GET", f"{path}{'&' if '?' in path else '?'}limit=100&start={start}")
            self.version = int(hdrs.get("Last-Modified-Version", self.version))
            out.extend(data)
            if len(data) < 100:
                return out
            start += 100

    def write(self, method: str, path: str, body, version: int | None = None):
        if self.dry:
            print(f"  dry-run {method} {path} {json.dumps(body)[:160]}")
            return None
        headers = {"If-Unmodified-Since-Version": str(version if version is not None else self.version)}
        status, data, hdrs = self.call(method, path, body, headers)
        self.version = int(hdrs.get("Last-Modified-Version", self.version))
        time.sleep(0.3)
        return data


def main() -> int:
    dry = "--dry-run" in sys.argv
    do_trash = "--trash" in sys.argv
    key, user = os.environ.get("ZOTERO_API_KEY"), os.environ.get("ZOTERO_USER_ID")
    if not key or not user:
        sys.exit("set ZOTERO_API_KEY and ZOTERO_USER_ID")
    plan = json.loads(PLAN.read_text())
    z = Zotero(user, key, dry)

    # --- collections: path -> key, creating or renaming as needed
    existing = {c["key"]: c["data"] for c in z.get_all("/collections")}
    by_key_path: dict[str, str] = {}

    def path_of(k: str) -> str:
        d = existing[k]
        parent = d.get("parentCollection")
        return (path_of(parent) + "/" if parent else "") + d["name"]

    for k in existing:
        by_key_path[path_of(k)] = k

    for path, spec in plan["collections"].items():
        parent_path, _, name = path.rpartition("/")
        parent_key = by_key_path[parent_path] if parent_path else False
        if path in by_key_path:
            print(f"collection exists   {path}")
            continue
        rk = spec.get("rename_key")
        if rk and rk in existing:
            print(f"collection rename   {path_of(rk)} -> {path}")
            d = existing[rk]
            d.update(name=name, parentCollection=parent_key)
            z.write("PATCH", f"/collections/{rk}", {"name": name, "parentCollection": parent_key},
                    version=d["version"])
            by_key_path[path] = rk
            continue
        print(f"collection create   {path}")
        res = z.write("POST", "/collections", [{"name": name, "parentCollection": parent_key}])
        if res:
            new_key = res["successful"]["0"]["key"]
            existing[new_key] = {"name": name, "parentCollection": parent_key, "version": z.version}
            by_key_path[path] = new_key
        else:
            by_key_path[path] = f"<new:{path}>"

    # --- items: collections, tags, pinned citation key via Extra, linked attachments
    for ikey, spec in plan["items"].items():
        status, item, hdrs = z.call("GET", f"/items/{ikey}")
        d = item["data"]
        patch = {}
        wanted = {by_key_path[p] for p in spec.get("collections", [])}
        unwanted = {by_key_path[p] for p in spec.get("remove_collections", []) if p in by_key_path}
        cols = (set(d["collections"]) | wanted) - unwanted
        if cols != set(d["collections"]):
            patch["collections"] = sorted(cols)
        have = {t["tag"] for t in d["tags"]}
        tags = [t for t in d["tags"] if t["tag"] not in set(spec.get("remove_tags", []))]
        tags += [{"tag": t} for t in spec.get("tags", []) if t not in have]
        if tags != d["tags"]:
            patch["tags"] = tags
        pin = spec.get("pin")
        extra = d.get("extra", "")
        if pin and "citation key:" not in extra.lower():
            patch["extra"] = (f"Citation Key: {pin}\n" + extra).rstrip("\n")
        if patch:
            print(f"item update         {ikey} {d.get('title', '')[:50]}  {sorted(patch)}")
            z.write("PATCH", f"/items/{ikey}", patch, version=d["version"])
        else:
            print(f"item ok             {ikey} {d.get('title', '')[:50]}")
        links = spec.get("link_attachments", [])
        if links:
            status, children, hdrs = z.call("GET", f"/items/{ikey}/children")
            have_urls = {c["data"].get("url") for c in children}
            new = [{"itemType": "attachment", "linkMode": "linked_url", "parentItem": ikey,
                    "url": l["url"], "title": l.get("title", l["url"]), "tags": [], "collections": [], "relations": {}}
                   for l in links if l["url"] not in have_urls]
            if new:
                print(f"item attach links   {ikey} {[l['url'] for l in new]}")
                z.write("POST", "/items", new)

    for ikey, why in plan.get("trash", {}).items():
        if not do_trash:
            print(f"item keep           {ikey} ({why}); pass --trash to trash it")
            continue
        status, item, hdrs = z.call("GET", f"/items/{ikey}")
        print(f"item trash          {ikey} ({why})")
        z.write("PATCH", f"/items/{ikey}", {"deleted": 1}, version=item["data"]["version"])

    for path in plan.get("delete_collections", []):
        ckey = by_key_path.get(path)
        if not ckey or ckey.startswith("<new:"):
            print(f"collection absent   {path}")
            continue
        status, coll, hdrs = z.call("GET", f"/collections/{ckey}")
        print(f"collection delete   {path} ({coll['meta'].get('numItems', 0)} items, {coll['meta'].get('numCollections', 0)} subcollections)")
        if coll["meta"].get("numItems") or coll["meta"].get("numCollections"):
            print(f"  skipped: not empty")
            continue
        if not dry:
            z.call("DELETE", f"/collections/{ckey}", headers={"If-Unmodified-Since-Version": str(coll["version"])})
    return 0


if __name__ == "__main__":
    sys.exit(main())
