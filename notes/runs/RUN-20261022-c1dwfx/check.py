"""Read both docs back with the refresh token from `yajna sync login` and print one
===RESULT=== line. The access token stays in memory; exports go to the scratch lab."""
import html as h, json, os, sys, urllib.parse, urllib.request

lab, pdoc, edoc = sys.argv[1:4]
created1, pub1, pub2, pub3, created3 = map(int, sys.argv[4:9])
path = os.environ.get("YAJNA_GDOC_CREDENTIALS") or os.path.expanduser("~/.config/yajna/gdoc.json")
c = json.load(open(path))
body = urllib.parse.urlencode({"client_id": c["client_id"], "client_secret": c["client_secret"],
                               "refresh_token": c["refresh_token"], "grant_type": "refresh_token"}).encode()
tok = json.load(urllib.request.urlopen(c.get("token_uri", "https://oauth2.googleapis.com/token"), body))["access_token"]

def get(url, raw=False):
    r = urllib.request.urlopen(urllib.request.Request(url, headers={"Authorization": f"Bearer {tok}"}))
    return r.read().decode() if raw else json.load(r)

api = "https://www.googleapis.com/drive/v3/files/"
meta = {d: get(api + d + "?fields=id,name,mimeType,trashed,appProperties") for d in (pdoc, edoc)}
html = {d: get(api + d + "/export?mimeType=text/html", raw=True) for d in (pdoc, edoc)}
for d, text in html.items():
    open(os.path.join(lab, f"export-{d}.html"), "w").write(text)
e = h.unescape(html[edoc])
res = {
    "created_first": created1, "published_first": pub1, "published_unchanged": pub2,
    "published_after_edit": pub3, "created_after_edit": created3,
    "is_google_doc": all(m["mimeType"] == "application/vnd.google-apps.document" for m in meta.values()),
    "hash_stored": all("yajna_hash" in m.get("appProperties", {}) for m in meta.values()),
    "headings": "<h2" in e, "list": "<li" in e, "table": "<table" in e,
    "task_marks": "☐ an open task" in e and "☑ a done task" in e,
    "link_to_project_doc": pdoc in e,
    "edit_arrived": "a line added after the first publish" in e,
}
print("===RESULT===", json.dumps(res))
