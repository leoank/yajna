"""`post`: add a comment and a reply to the experiment doc. `check`: read the comment back
and print one ===RESULT=== line. Uses the refresh token from `yajna sync login`; the access
token stays in memory and the comment ID only in the scratch lab."""
import html, json, os, sys, urllib.parse, urllib.request

mode, lab = sys.argv[1:3]
edoc = open(os.path.join(lab, "docs.txt")).read().split("\n")[1].split()[1]
path = os.environ.get("YAJNA_GDOC_CREDENTIALS") or os.path.expanduser("~/.config/yajna/gdoc.json")
c = json.load(open(path))
body = urllib.parse.urlencode({"client_id": c["client_id"], "client_secret": c["client_secret"],
                               "refresh_token": c["refresh_token"], "grant_type": "refresh_token"}).encode()
tok = json.load(urllib.request.urlopen(c.get("token_uri", "https://oauth2.googleapis.com/token"), body))["access_token"]
api = f"https://www.googleapis.com/drive/v3/files/{edoc}"

def call(url, data=None, raw=False):
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json"},
                                 data=None if data is None else json.dumps(data).encode())
    r = urllib.request.urlopen(req)
    return r.read().decode() if raw else json.load(r)

if mode == "post":
    cm = call(api + "/comments?fields=id", {"content": "a comment from the API",
                                            "quotedFileContent": {"mimeType": "text/html", "value": "a done task"}})
    call(api + f"/comments/{cm['id']}/replies?fields=id", {"content": "a reply from the API"})
    open(os.path.join(lab, "comment.txt"), "w").write(cm["id"])
else:
    pulled, reply_pulled, _, resolved_n, published6, fresh6 = sys.argv[3:9]
    cid = open(os.path.join(lab, "comment.txt")).read().strip()
    cm = call(api + f"/comments/{cid}?fields=resolved,replies(action,content)")
    doc = html.unescape(call(api + "/export?mimeType=text/html", raw=True))
    print("===RESULT===", json.dumps({
        "comment_pulled": int(pulled) == 1, "reply_pulled": int(reply_pulled) == 1,
        "resolved_by_sync": int(resolved_n or 0), "resolved_in_doc": cm.get("resolved", False),
        "resolve_reply_recorded": any(r.get("action") == "resolve" for r in cm.get("replies", [])),
        "review_not_published": "a comment from the API" not in doc and "Review" not in doc,
        "published_when_settled": int(published6 or 0), "new_comments_when_settled": int(fresh6 or 0),
    }))
