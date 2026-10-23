"""RUN-20261023-ftnr64: Drive calls `yajna` does not make itself, for the mirror check.
`check <page>` prints whether two exports of the page's doc are identical and whether its
published revision (`yajna_rev`) exports the same bytes; `edit <page> <from>=><to>...`
re-uploads the doc's own HTML with words replaced, as an outside edit (a stand-in for a
person typing: Google rewrites some structure on re-import); `trash` trashes the scratch
root folder. The access token stays in memory."""
import json, os, re, sys, urllib.parse, urllib.request

NS = os.environ.get("NS", "yajna-mirror-check")
c = json.load(open(os.environ.get("YAJNA_GDOC_CREDENTIALS") or os.path.expanduser("~/.config/yajna/gdoc.json")))
body = urllib.parse.urlencode({"client_id": c["client_id"], "client_secret": c["client_secret"],
                               "refresh_token": c["refresh_token"], "grant_type": "refresh_token"}).encode()
tok = json.load(urllib.request.urlopen(c.get("token_uri", "https://oauth2.googleapis.com/token"), body))["access_token"]
API = "https://www.googleapis.com/drive/v3/files"

def call(url, data=None, method=None, raw=False, ctype="application/json"):
    req = urllib.request.Request(url, method=method, headers={"Authorization": f"Bearer {tok}", "Content-Type": ctype},
                                 data=data)
    r = urllib.request.urlopen(req)
    return r.read() if raw else json.load(r)

mode = sys.argv[1]
if mode == "trash":
    q = f"appProperties has {{ key='yajna_notebook' and value='{NS}' }} and trashed=false"
    for f in call(API + "?" + urllib.parse.urlencode({"q": q, "fields": "files(id,name)"}))["files"]:
        call(f"{API}/{f['id']}?fields=id", json.dumps({"trashed": True}).encode(), method="PATCH")
        print("trashed", f["name"])
    sys.exit()
d = re.search(r"doc_id: *([A-Za-z0-9_-]+)", open(sys.argv[2]).read()).group(1)
md = lambda: call(f"{API}/{d}/export?mimeType=text/markdown", raw=True)
if mode == "check":
    rev = call(f"{API}/{d}?fields=appProperties")["appProperties"]["yajna_rev"]
    link = call(f"{API}/{d}/revisions/{rev}?fields=exportLinks")["exportLinks"]["text/markdown"]
    a, b = md(), md()
    print(json.dumps({"exports_identical": a == b, "revision_export_identical": call(link, raw=True) == a}))
elif mode == "edit":
    h = call(f"{API}/{d}/export?mimeType=text/html", raw=True).decode()
    for pair in sys.argv[3:]:
        x, y = pair.split("=>")
        assert x in h, x
        h = h.replace(x, y, 1)
    call(f"https://www.googleapis.com/upload/drive/v3/files/{d}?uploadType=media&fields=id", h.encode(), method="PATCH", ctype="text/html")
