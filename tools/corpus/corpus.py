#!/usr/bin/env python3
"""Fetch published wet-lab protocols into corpus/ as markdown test fixtures.

Standard library only. See docs/protocol-corpus.md for sources and licences.

  corpus.py search <source> <query> [--limit N]     sources: bioprotocol star jove methodsx oww
  corpus.py fetch <ref> [<ref> ...]                  refs: PMC12345  oww:Page/Title  bioprot:1007
                                                           pio:12345 (needs PROTOCOLS_IO_TOKEN)  labbench
  corpus.py index                                    rewrite corpus/index.md
"""
import argparse, html, json, os, re, sys, time
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError

# Run from the lab root: the corpus lives beside its lab/, not in the tooling repo.
CORPUS = Path.cwd() / "corpus"
RAW = CORPUS / "raw"
OUT = CORPUS / "protocols"
UA = "yajna-corpus/0.1 (academic research; contact via repo)"
EPMC = "https://www.ebi.ac.uk/europepmc/webservices/rest"
JOURNALS = {"bioprotocol": "Bio Protoc", "star": "STAR Protoc", "jove": "J Vis Exp", "methodsx": "MethodsX"}
XLINK = "{http://www.w3.org/1999/xlink}href"
SKIP_TITLES = ("references", "acknowledg", "competing interest", "citation", "footnotes", "author contributions",
               "declaration", "associated data", "supplementary", "supplemental", "contributor information",
               "funding", "data availability", "ethics", "credit authorship", "resource availability", "notes")
LAST_FETCH = {}


def get(url, headers=None, delay=1.0):
    """GET with per-host politeness delay and simple retry."""
    host = url.split("/")[2]
    wait = LAST_FETCH.get(host, 0) + delay - time.time()
    if wait > 0:
        time.sleep(wait)
    req = Request(url, headers={"User-Agent": UA, **(headers or {})})
    for attempt in range(3):
        try:
            with urlopen(req, timeout=60) as r:
                LAST_FETCH[host] = time.time()
                return r.read()
        except HTTPError as e:
            LAST_FETCH[host] = time.time()
            if e.code in (500, 502, 503, 429) and attempt < 2:
                time.sleep(2 * (attempt + 1))
                continue
            raise


# ---------------------------------------------------------------- markdown rendering of JATS-like trees

INLINE_TAGS = {"italic", "bold", "sub", "sup", "xref", "ext-link", "break", "label", "sc", "underline", "monospace",
               "inline-formula", "inline-graphic", "named-content", "uri", "email", "styled-content", "abbrev",
               "mml:math", "roman", "overline", "strike"}


def text_of(el):
    return " ".join("".join(el.itertext()).split())


def inline(el):
    """Render an element's inline content (text + inline children) to a markdown string."""
    parts = [el.text or ""]
    for ch in el:
        if ch.tag in INLINE_TAGS or ch.tag not in BLOCK_RENDER:
            parts.append(inline_el(ch))
        parts.append(ch.tail or "")
    return "".join(parts)


def inline_el(ch):
    t = ch.tag
    if t == "italic":
        return "*" + inline(ch).strip() + "*"
    if t == "bold":
        return "**" + inline(ch).strip() + "**"
    if t == "sub":
        return "<sub>" + inline(ch) + "</sub>"
    if t == "sup":
        return "<sup>" + inline(ch) + "</sup>"
    if t == "break":
        return " "
    if t == "ext-link" or t == "uri":
        href = ch.get(XLINK) or ch.get("href") or ""
        txt = inline(ch).strip() or href
        return f"[{txt}]({href})" if href else txt
    if t == "inline-graphic":
        return ""
    return inline(ch)


def norm_para(s):
    return " ".join(s.split())


class Renderer:
    def __init__(self):
        self.lines = []

    def emit(self, line=""):
        self.lines.append(line)

    def render(self, el, level=1):
        fn = BLOCK_RENDER.get(el.tag, Renderer.r_children)
        fn(self, el, level)

    def r_children(self, el, level):
        for ch in el:
            self.render(ch, level)

    def r_sec(self, el, level):
        title = el.find("title")
        if title is not None:
            t = text_of(title).lower()
            if any(t.startswith(s) for s in SKIP_TITLES):
                return
            self.emit("#" * min(level + 1, 6) + " " + inline(title).strip())
            self.emit()
        for ch in el:
            if ch is not title:
                self.render(ch, level + 1)

    def r_title(self, el, level):
        self.emit("**" + inline(el).strip() + "**")
        self.emit()

    def r_p(self, el, level):
        buf = [el.text or ""]
        for ch in el:
            if ch.tag in BLOCK_RENDER and ch.tag not in INLINE_TAGS:
                self.flush_para(buf)
                self.render(ch, level)
            else:
                buf.append(inline_el(ch))
            buf.append(ch.tail or "")
        self.flush_para(buf)

    def flush_para(self, buf):
        s = norm_para("".join(buf))
        buf.clear()
        if s:
            self.emit(s)
            self.emit()

    def r_list(self, el, level):
        ltype = el.get("list-type", "bullet")
        n = 0
        for item in el.findall("list-item"):
            n += 1
            label = item.find("label")
            if label is not None and text_of(label):
                marker = text_of(label)
                if not re.search(r"[.):]$", marker):
                    marker += "."
            else:
                marker = list_marker(ltype, n)
            sub = Renderer()
            for ch in item:
                if ch is not label:
                    sub.render(ch, level)
            body = sub.lines
            while body and body[-1] == "":
                body.pop()
            if not body:
                body = [""]
            pad = " " * (len(marker) + 1)
            self.emit(marker + " " + body[0])
            for line in body[1:]:
                self.emit(pad + line if line else "")
        self.emit()

    def r_table(self, el, level):
        cap = el.find("caption")
        if cap is not None:
            self.emit("**Table: " + text_of(cap) + "**")
            self.emit()
        table = el if el.tag == "table" else el.find(".//table")
        if table is None:
            return
        rows = []
        for tr in table.iter("tr"):
            cells = [tr_cell(c) for c in tr if c.tag in ("td", "th")]
            if cells and any(cells):
                rows.append(cells)
        if not rows:
            return
        width = max(len(r) for r in rows)
        rows = [r + [""] * (width - len(r)) for r in rows]
        self.emit("| " + " | ".join(rows[0]) + " |")
        self.emit("|" + "---|" * width)
        for r in rows[1:]:
            self.emit("| " + " | ".join(r) + " |")
        self.emit()

    def r_quote(self, el, level):
        sub = Renderer()
        sub.r_children(el, level)
        for line in sub.lines:
            self.emit(("> " + line).rstrip())
        self.emit()

    def r_fig(self, el, level):
        label = el.find("label")
        cap = el.find("caption")
        txt = (text_of(label) + ": " if label is not None else "Figure: ") + (text_of(cap) if cap is not None else "")
        self.emit("*" + txt.strip() + "*")
        self.emit()

    def r_deflist(self, el, level):
        for item in el.findall("def-item"):
            term, d = item.find("term"), item.find("def")
            self.emit("- **" + (text_of(term) if term is not None else "") + "**: " + (text_of(d) if d is not None else ""))
        self.emit()

    def r_pre(self, el, level):
        self.emit("```")
        self.emit("".join(el.itertext()).rstrip())
        self.emit("```")
        self.emit()

    def r_skip(self, el, level):
        return


def tr_cell(c):
    return norm_para(inline(c)).replace("|", "\\|")


def list_marker(ltype, n):
    if ltype in ("order", "decimal", "label", "simple"):
        return f"{n}."
    if ltype == "alpha-lower":
        return chr(96 + n) + "."
    if ltype == "alpha-upper":
        return chr(64 + n) + "."
    if ltype.startswith("roman"):
        r = to_roman(n)
        return (r.lower() if ltype.endswith("lower") else r) + "."
    return "-"


def to_roman(n):
    out = ""
    for v, s in ((10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")):
        while n >= v:
            out += s
            n -= v
    return out


BLOCK_RENDER = {
    "sec": Renderer.r_sec, "title": Renderer.r_title, "p": Renderer.r_p, "list": Renderer.r_list,
    "table-wrap": Renderer.r_table, "table": Renderer.r_table, "disp-quote": Renderer.r_quote,
    "boxed-text": Renderer.r_quote, "fig": Renderer.r_fig, "def-list": Renderer.r_deflist,
    "preformat": Renderer.r_pre, "ref-list": Renderer.r_skip, "fn-group": Renderer.r_skip,
    "supplementary-material": Renderer.r_skip, "table-wrap-foot": Renderer.r_skip, "graphic": Renderer.r_skip,
    "body": Renderer.r_children, "abstract": Renderer.r_sec, "list-item": Renderer.r_children,
    "caption": Renderer.r_children, "statement": Renderer.r_quote, "fig-group": Renderer.r_children,
}


# ---------------------------------------------------------------- JATS XML (Europe PMC)

def jats_meta(root):
    f = root.find(".//article-meta")
    j = root.find(".//journal-meta")
    get1 = lambda path, node=f: (text_of(node.find(path)) if node is not None and node.find(path) is not None else "")
    ids = {a.get("pub-id-type"): text_of(a) for a in f.findall("article-id")} if f is not None else {}
    lic = root.find(".//license")
    lic_url = ""
    if lic is not None:
        lic_url = lic.get(XLINK, "")
        for e in lic.iter("ext-link"):
            lic_url = lic_url or e.get(XLINK, "")
    year = ""
    for pd in f.findall("pub-date") if f is not None else []:
        if pd.find("year") is not None:
            year = text_of(pd.find("year"))
            break
    return {
        "title": get1("title-group/article-title"),
        "journal": get1("journal-title-group/journal-title", j) or get1("journal-title", j),
        "doi": ids.get("doi", ""), "pmcid": ids.get("pmcid") or ids.get("pmc", ""), "year": year,
        "authors": [text_of(c.find("name/surname")) for c in root.iter("contrib") if c.find("name/surname") is not None],
        "keywords": [text_of(k) for k in root.iter("kwd")],
        "license": (text_of(lic.find("license-p")) if lic is not None and lic.find("license-p") is not None
                    else text_of(lic) if lic is not None else ""), "license_url": lic_url,
    }


def jats_to_markdown(xml_bytes):
    root = ET.fromstring(xml_bytes)
    meta = jats_meta(root)
    r = Renderer()
    abstract = root.find(".//article-meta/abstract")
    if abstract is not None:
        r.emit("## Abstract")
        r.emit()
        r.r_children(abstract, 2)
    body = root.find(".//body")
    if body is not None:
        r.render(body, 1)
    return meta, "\n".join(r.lines)


# ---------------------------------------------------------------- PMC HTML (fallback for non-OA PMC articles)

HTML_TAG_MAP = {"section": "sec", "ol": "list", "ul": "list", "li": "list-item", "em": "italic", "i": "italic",
                "strong": "bold", "b": "bold", "blockquote": "disp-quote", "figure": "fig", "figcaption": "caption",
                "a": "ext-link", "img": "inline-graphic", "br": "break", "pre": "preformat", "dl": "def-list",
                "dt": "term", "dd": "def", "h1": "title", "h2": "title", "h3": "title", "h4": "title", "h5": "title",
                "h6": "title", "table": "table", "caption": "caption"}
HTML_DROP = {"script", "style", "nav", "button", "input", "svg", "noscript", "head", "form", "select", "iframe", "math"}
HTML_VOID = {"br", "img", "hr", "col", "input", "link", "meta", "source", "wbr", "area", "base", "embed", "param", "track"}


class TreeBuilder(HTMLParser):
    """Build an ElementTree from HTML, mapping tags onto JATS names so Renderer can be reused."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = ET.Element("html")
        self.stack = [self.root]
        self.drop = 0
        self.meta = {}

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "meta" and a.get("name", "").startswith("citation_"):
            self.meta.setdefault(a["name"], []).append(a.get("content", ""))
        if self.drop or tag in HTML_DROP:
            if tag not in HTML_VOID:
                self.drop += 1  # count every open tag inside a dropped subtree so the matching close unwinds it
            return
        if tag in HTML_VOID and tag not in ("br", "img", "hr"):
            return
        name = HTML_TAG_MAP.get(tag, tag)
        el = ET.SubElement(self.stack[-1], name, {k: v for k, v in a.items() if k in ("id", "class", "href", "style")})
        if tag == "ol":
            style = a.get("style", "")
            el.set("list-type", "alpha-upper" if "upper-alpha" in style else "alpha-lower" if "lower-alpha" in style
                   else "roman-lower" if "lower-roman" in style else "roman-upper" if "upper-roman" in style else "order")
        elif tag == "ul":
            el.set("list-type", "bullet")
        if tag not in HTML_VOID:
            self.stack.append(el)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in HTML_VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if self.drop:
            if tag not in HTML_VOID:
                self.drop -= 1
            return
        if tag in HTML_VOID:
            return
        name = HTML_TAG_MAP.get(tag, tag)
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == name:
                del self.stack[i:]
                return

    def handle_data(self, data):
        if self.drop:
            return
        el = self.stack[-1]
        if len(el):
            el[-1].tail = (el[-1].tail or "") + data
        else:
            el.text = (el.text or "") + data


def pmc_html_to_markdown(html_bytes):
    tb = TreeBuilder()
    tb.feed(html_bytes.decode("utf-8", "replace"))
    m = tb.meta
    one = lambda k: (m.get(k) or [""])[0]
    meta = {"title": one("citation_title"), "journal": one("citation_journal_title"), "doi": one("citation_doi"),
            "pmcid": "", "year": one("citation_publication_date")[:4], "authors": m.get("citation_author", []),
            "keywords": [], "license": "", "license_url": ""}
    body = None
    for sec in tb.root.iter("sec"):
        if "main-article-body" in sec.get("class", ""):
            body = sec
            break
    txt = html_bytes.decode("utf-8", "replace")
    lm = re.search(r"https?://creativecommons\.org/licenses/[a-z\-]+/[0-9.]+/?", txt)
    if lm:
        meta["license_url"] = lm.group(0)
        meta["license"] = "Creative Commons (see license_url)"
    r = Renderer()
    if body is not None:
        for ch in body:
            # PMC HTML wraps the article in sections whose headings are h2; treat each as level-1 sec
            r.render(ch, 1)
    return meta, "\n".join(r.lines)


# ---------------------------------------------------------------- sources

def epmc_search(journal, query, limit):
    q = f'JOURNAL:"{journal}" AND HAS_FT:y'
    if query:
        q += f" AND ({query})"
    url = f"{EPMC}/search?" + urlencode({"query": q, "format": "json", "pageSize": limit, "resultType": "lite"})
    d = json.loads(get(url))
    for r in d["resultList"]["result"]:
        yield r.get("pmcid", ""), r.get("pubYear", ""), "OA" if r.get("isOpenAccess") == "Y" else "  ", html.unescape(r.get("title", ""))


def fetch_pmc(pmcid):
    """Europe PMC full-text XML for the OA subset; PMC HTML otherwise (publisher blocks XML download)."""
    xml_path = RAW / f"{pmcid}.xml"
    html_path = RAW / f"{pmcid}.html"
    if xml_path.exists():
        return jats_to_markdown(xml_path.read_bytes()), f"europepmc:{pmcid}"
    if not html_path.exists():
        try:
            data = get(f"{EPMC}/{pmcid}/fullTextXML")
            if b"<body" in data:
                xml_path.write_bytes(data)
                return jats_to_markdown(data), f"europepmc:{pmcid}"
        except HTTPError as e:
            if e.code != 500:
                raise
        page = get(f"https://pmc.ncbi.nlm.nih.gov/articles/{pmcid}/", delay=2.0)
        if b"main-article-body" not in page:
            sys.exit(f"{pmcid}: PMC returned a challenge page instead of the article (rate limited?); retry later")
        html_path.write_bytes(page)
    meta, md = pmc_html_to_markdown(html_path.read_bytes())
    meta["pmcid"] = pmcid
    return (meta, md), f"pmc-html:{pmcid}"


def oww_search(query, limit):
    url = "https://openwetware.org/mediawiki/api.php?" + urlencode(
        {"action": "query", "list": "search", "srsearch": query, "srlimit": limit, "format": "json"})
    for r in json.loads(get(url))["query"]["search"]:
        yield "oww:" + r["title"], r["timestamp"][:4], "  ", r["title"]


def wikitext_to_markdown(wt):
    out = []
    for line in wt.splitlines():
        line = re.sub(r"\{\{[^}]*\}\}", "", line)
        line = re.sub(r"\[\[(?:Image|File|Media):[^\]]*\]\]", "", line)
        line = re.sub(r"\[\[(?:[^|\]]*\|)?([^\]]*)\]\]", r"\1", line)
        line = re.sub(r"\[https?://\S+ ([^\]]*)\]", r"\1", line)
        line = re.sub(r"'''(.*?)'''", r"**\1**", line)
        line = re.sub(r"''(.*?)''", r"*\1*", line)
        line = re.sub(r"<br\s*/?>", " ", line)
        m = re.match(r"^(=+)\s*(.*?)\s*=+\s*$", line)
        if m:
            out.append("#" * (len(m.group(1)) + 1) + " " + m.group(2))
            out.append("")
            continue
        m = re.match(r"^([#*:]+)\s*(.*)$", line)
        if m:
            marks, text = m.groups()
            marker = "1." if marks[-1] == "#" else "-"
            out.append("    " * (len(marks) - 1) + marker + " " + text)
            continue
        out.append(line)
    return "\n".join(out)


def fetch_oww(title):
    url = "https://openwetware.org/mediawiki/api.php?" + urlencode(
        {"action": "parse", "page": title, "prop": "wikitext", "format": "json"})
    d = json.loads(get(url))["parse"]
    wt = d["wikitext"]["*"]
    (RAW / (slug(title) + ".wiki")).write_text(wt)
    meta = {"title": d["title"], "journal": "OpenWetWare", "doi": "", "pmcid": "", "year": "", "authors": [],
            "keywords": [], "license": "CC BY-SA 3.0 (OpenWetWare default)",
            "license_url": "https://creativecommons.org/licenses/by-sa/3.0/",
            "url": "https://openwetware.org/wiki/" + quote(title.replace(" ", "_"))}
    return meta, wikitext_to_markdown(wt)


def fetch_bioprot(pid):
    url = f"https://raw.githubusercontent.com/bioplanner/bioplanner/main/bioprot/{pid}.json"
    data = get(url)
    (RAW / f"bioprot-{pid}.json").write_bytes(data)
    d = json.loads(data)
    meta = {"title": d["title"], "journal": "protocols.io via BioProt (BioPlanner, O'Donoghue et al. 2023)",
            "doi": "", "pmcid": "", "year": "", "authors": [], "keywords": [],
            "license": "protocols.io content (CC BY 4.0 for most public protocols); BioProt repo has no licence file",
            "license_url": "", "url": d.get("protocols.io url", "")}
    md = ["## Description", "", d.get("original description", ""), "", "## Steps", "", d.get("steps", ""), "",
          "## BioProt pseudocode", "", "```python", d.get("edited_pseudocode") or d.get("generated_pseudocode", ""), "```"]
    return meta, "\n".join(md)


def fetch_pio(pid):
    """protocols.io v4. Untested: needs a client access token from protocols.io/developers."""
    tok = os.environ.get("PROTOCOLS_IO_TOKEN")
    if not tok:
        sys.exit("set PROTOCOLS_IO_TOKEN (client access token from https://www.protocols.io/developers)")
    h = {"Authorization": "Bearer " + tok}
    base = f"https://www.protocols.io/api/v4/protocols/{pid}"
    p = json.loads(get(base + "?content_format=markdown", h))
    s = json.loads(get(base + "/steps?content_format=markdown", h))
    (RAW / f"pio-{pid}.json").write_text(json.dumps({"protocol": p, "steps": s}, indent=1))
    pr = p.get("payload", p)
    meta = {"title": pr.get("title", ""), "journal": "protocols.io", "doi": pr.get("doi", ""), "pmcid": "",
            "year": "", "authors": [a.get("name", "") for a in pr.get("authors", [])], "keywords": [],
            "license": "see protocols.io page (usually CC BY 4.0)", "license_url": "", "url": pr.get("url", "")}
    md = ["## Description", "", pr.get("description") or "", "", "## Steps", ""]
    for i, st in enumerate(s.get("payload", s) if isinstance(s, dict) else s, 1):
        title = st.get("title") or ""
        body = st.get("step") or st.get("description") or ""
        if not body and st.get("components"):
            body = "\n".join(str(c.get("source", {}).get("description") or c.get("source", {}).get("body") or "")
                             for c in st["components"])
        md.append(f"{i}. " + (f"**{title}** " if title else "") + body.strip())
    return meta, "\n".join(md)


def fetch_labbench():
    rows = []
    for off in (0, 100):
        url = ("https://datasets-server.huggingface.co/rows?" +
               urlencode({"dataset": "futurehouse/lab-bench", "config": "ProtocolQA", "split": "train",
                          "offset": off, "length": 100}))
        rows += [r["row"] for r in json.loads(get(url))["rows"]]
    (RAW / "labbench-protocolqa.json").write_text(json.dumps(rows, indent=1))
    for r in rows:
        meta = {"title": r["protocol"].split("\n")[0][:120], "journal": "LAB-Bench ProtocolQA (FutureHouse)",
                "doi": "", "pmcid": "", "year": "2024", "authors": [], "keywords": [],
                "license": "CC BY-SA 4.0; benchmark data, do not include in training corpora", "license_url": "",
                "url": "https://huggingface.co/datasets/futurehouse/lab-bench", "canary": r["canary"],
                "question": r["question"], "ideal": r["ideal"], "distractors": r["distractors"]}
        md = ["## Protocol", "", r["protocol"], "", "## Troubleshooting question", "", r["question"], "",
              "Ideal answer: " + r["ideal"]]
        write_protocol("labbench", r["id"][:8], meta, "\n".join(md), "labbench:" + r["id"])
    return len(rows)


# ---------------------------------------------------------------- output

def slug(s):
    s = re.sub(r"[^A-Za-z0-9]+", "-", s).strip("-").lower()
    return s[:60] or "untitled"


def yaml_str(v):
    return json.dumps(v, ensure_ascii=False)


def write_protocol(source, ident, meta, md, origin):
    d = OUT / source
    d.mkdir(parents=True, exist_ok=True)
    path = d / f"{ident}.md"
    fm = ["---", f"title: {yaml_str(meta['title'])}", f"source: {source}", f"origin: {yaml_str(origin)}",
          f"journal: {yaml_str(meta.get('journal', ''))}", f"year: {yaml_str(meta.get('year', ''))}",
          f"doi: {yaml_str(meta.get('doi', ''))}", f"url: {yaml_str(meta.get('url') or ('https://doi.org/' + meta['doi'] if meta.get('doi') else ''))}",
          f"license: {yaml_str(meta.get('license', ''))}", f"license_url: {yaml_str(meta.get('license_url', ''))}",
          f"authors: {yaml_str(meta.get('authors', []))}", f"keywords: {yaml_str(meta.get('keywords', []))}",
          f"fetched: {time.strftime('%Y-%m-%d')}", "framework_status: untested", "---", "",
          f"# {meta['title']}", ""]
    for k in ("canary", "question", "ideal", "distractors"):
        if k in meta:
            fm.insert(-4, f"{k}: {yaml_str(meta[k])}")
    path.write_text("\n".join(fm) + md.rstrip() + "\n")
    print("wrote", path.relative_to(Path.cwd()))
    return path


def fetch(ref):
    if re.fullmatch(r"PMC\d+", ref):
        (meta, md), origin = fetch_pmc(ref)
        src = {"Bio-protocol": "bioprotocol", "STAR Protocols": "star", "Journal of Visualized Experiments : JoVE": "jove",
               "MethodsX": "methodsx"}.get(meta["journal"], slug(meta["journal"]) or "pmc")
        return write_protocol(src, ref, meta, md, origin)
    if ref.startswith("oww:"):
        meta, md = fetch_oww(ref[4:])
        return write_protocol("oww", slug(ref[4:]), meta, md, ref)
    if ref.startswith("bioprot:"):
        meta, md = fetch_bioprot(ref[8:])
        return write_protocol("bioprot", ref[8:], meta, md, ref)
    if ref.startswith("pio:"):
        meta, md = fetch_pio(ref[4:])
        return write_protocol("pio", ref[4:], meta, md, ref)
    if ref == "labbench":
        return fetch_labbench()
    sys.exit(f"unknown ref {ref}")


def frontmatter(path):
    txt = path.read_text()
    m = re.match(r"---\n(.*?)\n---", txt, re.S)
    out = {}
    for line in (m.group(1) if m else "").splitlines():
        k, _, v = line.partition(":")
        try:
            out[k.strip()] = json.loads(v.strip())
        except ValueError:
            out[k.strip()] = v.strip()
    return out


def write_index():
    rows = []
    for p in sorted(OUT.rglob("*.md")):
        fm = frontmatter(p)
        rows.append(f"| [{fm.get('title', p.stem)[:80]}]({p.relative_to(CORPUS)}) | {fm.get('source', '')} | "
                    f"{fm.get('year', '')} | {str(fm.get('license', ''))[:40]} | {fm.get('framework_status', '')} |")
    text = ["# Protocol corpus index", "", "Generated by `tools/corpus/corpus.py index`. Edit `framework_status` in each file's frontmatter.", "",
            "| Title | Source | Year | Licence | Framework status |", "|---|---|---|---|---|", *rows, ""]
    (CORPUS / "index.md").write_text("\n".join(text))
    print(f"indexed {len(rows)} protocols -> corpus/index.md")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("search")
    s.add_argument("source", choices=[*JOURNALS, "oww"])
    s.add_argument("query", nargs="?", default="")
    s.add_argument("--limit", type=int, default=10)
    f = sub.add_parser("fetch")
    f.add_argument("refs", nargs="+")
    sub.add_parser("index")
    a = ap.parse_args()
    RAW.mkdir(parents=True, exist_ok=True)
    if a.cmd == "search":
        hits = oww_search(a.query, a.limit) if a.source == "oww" else epmc_search(JOURNALS[a.source], a.query, a.limit)
        for ident, year, oa, title in hits:
            print(f"{ident:<14} {year:<5} {oa} {title}")
    elif a.cmd == "fetch":
        for ref in a.refs:
            fetch(ref)
        write_index()
    elif a.cmd == "index":
        write_index()


if __name__ == "__main__":
    main()
