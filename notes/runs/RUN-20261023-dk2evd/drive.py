"""RUN-20261023-dk2evd: `export <page> <dir>` saves the page's doc as doc.pdf and doc.html
and prints how Google Docs kept the reference list: the first entry's inline style, an
empty paragraph before it, raw HTML in titles, an italic species name;
`trash <dir>` trashes the scratch root folder. The access token stays in memory."""
import json, os, re, sys, urllib.parse, urllib.request

NS = os.environ.get("NS", "yajna-ref-style")
c = json.load(open(os.environ.get("YAJNA_GDOC_CREDENTIALS") or os.path.expanduser("~/.config/yajna/gdoc.json")))
body = urllib.parse.urlencode({"client_id": c["client_id"], "client_secret": c["client_secret"],
                               "refresh_token": c["refresh_token"], "grant_type": "refresh_token"}).encode()
tok = json.load(urllib.request.urlopen(c.get("token_uri", "https://oauth2.googleapis.com/token"), body))["access_token"]
API = "https://www.googleapis.com/drive/v3/files"

def call(url, data=None, method=None, raw=False):
    req = urllib.request.Request(url, method=method, headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json"},
                                 data=None if data is None else json.dumps(data).encode())
    r = urllib.request.urlopen(req)
    return r.read() if raw else json.load(r)

mode = sys.argv[1]
if mode == "export":
    page, out = sys.argv[2:4]
    d = re.search(r"doc_id: *([A-Za-z0-9_-]+)", open(page).read()).group(1)
    open(os.path.join(out, "doc.pdf"), "wb").write(call(f"{API}/{d}/export?mimeType=application/pdf", raw=True))
    h = call(f"{API}/{d}/export?mimeType=text/html", raw=True).decode()
    open(os.path.join(out, "doc.html"), "w").write(h)
    i = h.find(">References<")
    # the first reference entry: the first paragraph after the heading with text in it
    m = re.search(r'<p style="([^"]*)"><span style="([^"]*)">[^<]', h[i:])
    p_style, span_style = (m.group(1), m.group(2)) if m else ("", "")
    empty_before = bool(re.match(r'\s*<p style="[^"]*"><span[^>]*></span></p>', h[h.find("</h2>", i) + 5:]))
    print("===RESULT===", json.dumps({
        "space_after": re.findall(r"padding-bottom:[^;]+", p_style),
        "line_height": re.findall(r"line-height:[^;]+", p_style),
        "font_size": re.findall(r"font-size:[^;]+", span_style),
        "hanging_indent": "text-indent:-" in p_style,
        "empty_paragraph_before_entries": empty_before,
        "raw_html_in_titles": "&lt;i&gt;" in h,
        "species_italic": bool(re.search(r"font-style:italic[^>]*>Caulobacter crescentus<", h))}))
else:
    q = f"appProperties has {{ key='yajna_notebook' and value='{NS}' }} and trashed=false"
    for f in call(API + "?" + urllib.parse.urlencode({"q": q, "fields": "files(id,name)"}))["files"]:
        call(f"{API}/{f['id']}?fields=id", {"trashed": True}, method="PATCH")
        print("trashed", f["name"])
