"""Time change events from `yajna serve` for the notebook run.sh made.

    python3 measure.py <yajna binary> <base directory>

For each root, watched and polled: 20 appends, each timed from the write to the change
event that reports the new size; then a burst of 2000 lines a millisecond apart, counting
the events it produces. Prints a table and one ===RESULT=== line.
"""

import http.client
import json
import os
import statistics
import subprocess
import sys
import threading
import time

binary, base = sys.argv[1:]
server = subprocess.Popen(
    [binary, "--root", os.path.join(base, "nb"), "serve", "--port", "0"],
    stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True,
)
for line in server.stdout:
    if line.startswith("serving http://"):
        host, port = line.split("http://")[1].split("/")[0].split(":")
        break

conn = http.client.HTTPConnection(host, int(port))
conn.request("GET", "/api/files/roots", headers={"Host": "localhost"})
roots = json.loads(conn.getresponse().read())

events = []  # (time received, change)
cond = threading.Condition()


def listen():
    c = http.client.HTTPConnection(host, int(port))
    c.request("GET", "/api/events?watch=watched/a.log&watch=polled/a.log", headers={"Host": "localhost"})
    res = c.getresponse()
    while True:
        line = res.fp.readline()
        if not line:
            return
        if line.startswith(b"data:"):
            change = json.loads(line[5:])
            with cond:
                events.append((time.perf_counter(), change))
                cond.notify_all()


for root in ("watched", "polled"):
    open(os.path.join(base, root, "a.log"), "w").close()
threading.Thread(target=listen, daemon=True).start()
time.sleep(1.5)  # the initial state of both files


def wait_for(path, size, timeout=10):
    deadline = time.perf_counter() + timeout
    with cond:
        while True:
            for t, c in events:
                if c["path"] == path and c.get("size") == size:
                    return t
            left = deadline - time.perf_counter()
            if left <= 0:
                return None
            cond.wait(left)


rows, result = [], {}
try:
    for root in ("watched", "polled"):
        path = f"{root}/a.log"
        f = os.path.join(base, root, "a.log")
        delays, missed = [], 0
        for i in range(20):
            line = f"line {i:03d}\n".encode()
            with open(f, "ab") as h:
                t0 = time.perf_counter()
                h.write(line)
            size = os.path.getsize(f)
            got = wait_for(path, size)
            if got is None:
                missed += 1
            else:
                delays.append(got - t0)
            time.sleep(0.6 if root == "watched" else 2.5)
        live = next(r["live"] for r in roots if r["name"] == root)
        rows.append((f"{root} ({live})", "append to event, median / max",
                     f"{statistics.median(delays) * 1000:.0f} / {max(delays) * 1000:.0f} ms, {missed} missed of 20"))
        result[f"{root}_median_ms"] = round(statistics.median(delays) * 1000)
        result[f"{root}_missed"] = missed

        with cond:
            before = sum(1 for _, c in events if c["path"] == path)
        t0 = time.perf_counter()
        with open(f, "ab") as h:
            for i in range(2000):
                h.write(f"burst {i:04d}\n".encode())
                h.flush()
                time.sleep(0.001)
        span = time.perf_counter() - t0
        final = os.path.getsize(f)
        last = wait_for(path, final)
        with cond:
            during = sum(1 for _, c in events if c["path"] == path) - before
        rows.append(("", f"burst of 2000 lines over {span:.1f} s",
                     f"{during} events, {during / span:.1f} a second; last size {'seen' if last else 'NOT seen'}"))
        result[f"{root}_burst_events_per_s"] = round(during / span, 1)
finally:
    server.kill()

width = max(len(r[0]) for r in rows)
for a, b, c in rows:
    print(f"{a:<{width}}  {b:<36}  {c}")
print("===RESULT=== " + json.dumps(result))
