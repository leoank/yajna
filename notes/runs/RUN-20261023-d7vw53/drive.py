"""Read back what RUN-20261023-d7vw53 made in Drive, with the refresh token from `yajna sync
login` (kept in memory). `comment <page>` leaves a comment on a page's doc; `check <dir>`
prints one ===RESULT=== line; `trash <dir>` trashes the run's root folder."""
import html, json, os, re, sys, urllib.parse, urllib.request

NS = "yajna-sync-check"
c = json.load(open(os.environ.get("YAJNA_GDOC_CREDENTIALS") or os.path.expanduser("~/.config/yajna/gdoc.json")))
body = urllib.parse.urlencode({"client_id": c["client_id"], "client_secret": c["client_secret"],
                               "refresh_token": c["refresh_token"], "grant_type": "refresh_token"}).encode()
tok = json.load(urllib.request.urlopen(c.get("token_uri", "https://oauth2.googleapis.com/token"), body))["access_token"]
API = "https://www.googleapis.com/drive/v3/files"

def call(url, data=None, method=None, raw=False):
    req = urllib.request.Request(url, method=method, headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json"},
                                 data=None if data is None else json.dumps(data).encode())
    r = urllib.request.urlopen(req)
    return r.read().decode() if raw else json.load(r)

def doc_id(page):
    return re.search(r"doc_id: *([A-Za-z0-9_-]+)", open(page).read()).group(1)

def folders(q):
    url = API + "?" + urllib.parse.urlencode({"q": q + " and mimeType='application/vnd.google-apps.folder' and trashed=false",
                                             "fields": "files(id,name,parents,appProperties)", "spaces": "drive", "pageSize": 100})
    return call(url)["files"]

def root():
    roots = folders(f"appProperties has {{ key='yajna_notebook' and value='{NS}' }}")
    return roots

mode, arg = sys.argv[1:3]
if mode == "comment":
    d = doc_id(arg)
    call(f"{API}/{d}/comments?fields=id", {"content": "comment before the move"})
elif mode == "trash":
    for r in root():
        call(f"{API}/{r['id']}?fields=id", {"trashed": True}, method="PATCH")
        print("trashed", r["name"])
else:
    base = arg
    a = os.path.join(base, "a")
    roots = root()
    r = roots[0]["id"]
    tree = folders(f"appProperties has {{ key='yajna_root' and value='{r}' }}")
    paths = sorted(f["appProperties"]["yajna_path"] for f in tree)
    by_id = {f["id"]: f["appProperties"]["yajna_path"] for f in tree}
    by_id[r] = ""
    pages = open(os.path.join(base, "pages.txt")).read().split()
    where = {}
    for p in pages + ["notes/projects/PRJ-0001-sync-check/README.md"]:
        d = doc_id(os.path.join(a, p))
        meta = call(f"{API}/{d}?fields=parents,name,trashed")
        where[p.split("/")[-1][:19]] = [by_id.get(x, "?") for x in meta["parents"]]
    meeting = doc_id(os.path.join(a, pages[1]))
    comments = call(f"{API}/{meeting}/comments?fields=comments(content)")["comments"]
    prop = html.unescape(call(f"{API}/{doc_id(os.path.join(a, pages[2]))}/export?mimeType=text/html", raw=True))
    open(os.path.join(base, "proposal.html"), "w").write(prop)
    s = {n: open(os.path.join(base, f"sync{n}.txt")).read() for n in (1, 2, 3)}
    grab = lambda t, k: int(re.search(rf"(\d+) {k}", t).group(1))
    print("===RESULT===", json.dumps({
        "roots": len(roots), "folders": len(tree), "unique_paths": len(set(paths)) == len(paths), "paths": paths,
        "doc_folders": where,
        "clone_published": grab(s[2], "published"), "clone_moved": grab(s[2], "moved"),
        "moved": grab(s[3], "moved"), "comment_kept": any(c["content"] == "comment before the move" for c in comments),
        "comment_pulled": "comment before the move" in open(os.path.join(a, pages[1])).read(),
        "citation": "Shih, Goyal, and Kim 2015" in prop, "references": "References" in prop,
        "reference_entry": "Automating Synthetic Biology" in prop and "1151" in prop,
        "email_not_cited": "ada@example.org" in prop, "task_mark": "☐ read the reviews" in prop,
    }))
