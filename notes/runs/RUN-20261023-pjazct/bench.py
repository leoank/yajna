"""Time the file API of `yajna serve` on the tree built by run.sh.

    python3 bench.py <yajna binary> <notebook>

Starts the server on a free port, times listings (first page with an empty cache, the
same page again, every page), stat and byte ranges, samples the server's memory, and
prints a table and one ===RESULT=== line with the headline numbers.
"""

import http.client
import json
import statistics
import subprocess
import sys
import time

binary, notebook = sys.argv[1:]
server = subprocess.Popen(
    [binary, "--root", notebook, "serve", "--port", "0"],
    stdout=subprocess.PIPE,
    stderr=subprocess.DEVNULL,
    text=True,
)
for line in server.stdout:
    if line.startswith("serving http://"):
        host, port = line.split("http://")[1].split("/")[0].split(":")
        break


def get(path, headers=None):
    """(seconds to the first byte, seconds in all, status, body)."""
    conn = http.client.HTTPConnection(host, int(port))
    t0 = time.perf_counter()
    conn.request("GET", path, headers={"Host": "localhost", **(headers or {})})
    res = conn.getresponse()
    first = res.read(1)
    t1 = time.perf_counter()
    body = first + res.read()
    t2 = time.perf_counter()
    conn.close()
    return t1 - t0, t2 - t0, res.status, body


def rss_mb():
    out = subprocess.run(["ps", "-o", "rss=", "-p", str(server.pid)], capture_output=True, text=True)
    return int(out.stdout.strip()) / 1024


def ms(s):
    return round(s * 1000, 1)


rows = []
result = {}
try:
    rows.append(("server idle", "rss", f"{rss_mb():.0f} MB"))
    for name in ["d1k", "d100k", "d1m"]:
        _, cold, status, body = get(f"/api/files/list?path=tree/{name}")
        assert status == 200, body
        total = json.loads(body)["total"]
        _, warm, _, _ = get(f"/api/files/list?path=tree/{name}")
        pages, cursor, t0 = [], 0, time.perf_counter()
        while cursor is not None:
            _, t, _, body = get(f"/api/files/list?path=tree/{name}&cursor={cursor}")
            pages.append(t)
            cursor = json.loads(body).get("next")
        walk = time.perf_counter() - t0
        rows += [
            (f"list {name} ({total} entries)", "first page, empty cache", f"{ms(cold)} ms"),
            ("", "first page again", f"{ms(warm)} ms"),
            ("", f"all {len(pages)} pages", f"{ms(walk)} ms, median page {ms(statistics.median(pages))} ms"),
            ("", "server rss after", f"{rss_mb():.0f} MB"),
        ]
        result[f"list_{name}_first_ms"] = ms(cold)
        result[f"list_{name}_warm_ms"] = ms(warm)
    result["rss_after_listings_mb"] = round(rss_mb())

    deep = "tree/deep/" + "/".join(["d"] * 100) + "/leaf.txt"
    times = [get(f"/api/files/stat?path={deep}")[1] for _ in range(20)]
    rows.append(("stat 100 levels down", "median of 20", f"{ms(statistics.median(times))} ms"))
    result["stat_deep_ms"] = ms(statistics.median(times))

    _, _, status, body = get("/api/files/stat?path=tree/big.bin")
    size = json.loads(body)["size"]
    for label, rng in [
        ("start", "bytes=0-65535"),
        ("middle", f"bytes={size // 2}-{size // 2 + 65535}"),
        ("end", "bytes=-65536"),
    ]:
        firsts, alls = [], []
        for _ in range(10):
            first, total, status, body = get("/api/files/raw?path=tree/big.bin", {"Range": rng})
            assert status == 206 and len(body) == 65536, (status, len(body))
            firsts.append(first)
            alls.append(total)
        rows.append((f"64 KiB of 10 GiB, {label}", "first byte / all, median of 10",
                     f"{ms(statistics.median(firsts))} / {ms(statistics.median(alls))} ms"))
        result[f"range_{label}_ms"] = ms(statistics.median(alls))

    _, total, status, body = get("/api/files/raw?path=tree/big.bin", {"Range": "bytes=0-1073741823"})
    assert status == 206 and len(body) == 1 << 30
    rows.append(("1 GiB range streamed", "all", f"{ms(total)} ms, {1024 / total:.0f} MiB/s"))
    rows.append(("", "server rss after", f"{rss_mb():.0f} MB"))
    result["stream_mib_s"] = round(1024 / total)
    result["rss_after_stream_mb"] = round(rss_mb())

    for path in ["tree/loop", "tree/link-out"]:
        _, t, status, _ = get(f"/api/files/list?path={path}")
        rows.append((f"list {path}", "status", f"{status} in {ms(t)} ms"))
finally:
    server.kill()

width = max(len(r[0]) for r in rows)
for a, b, c in rows:
    print(f"{a:<{width}}  {b:<32}  {c}")
print("===RESULT=== " + json.dumps(result))
