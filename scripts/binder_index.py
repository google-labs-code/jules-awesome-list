#!/usr/bin/env python3
import os, hashlib, time

OUT="binder/INDEX.md"
lines=["# Fortress Binder — Receipts Index\n", f"_generated: {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}_\n"]

def sha(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for ch in iter(lambda:f.read(1<<20), b''): h.update(ch)
    return h.hexdigest()

ref = ""
p = "binder/EX11_binder_oci/ref.txt"
if os.path.exists(p):
    ref=open(p).read().strip()
if ref:
    lines += [f"- **binder OCI**: `{ref}`\n"]

for root,_,files in os.walk("binder"):
    for f in sorted(files):
        pth=os.path.join(root,f)
        if any(x in pth for x in ("/release/","/.git/","/__pycache__/","/PaxHeaders/")):
            continue
        if os.path.isdir(pth):
            continue
        if pth.endswith((".png",".jpg",".jpeg",".gif",".zip",".gz",".json",".csv",".txt",".spdx.json",".bundle.json",".intoto.jsonl",".tar.gz",".sha256",".md")):
            try:
                h = open(pth).read().split()[0] if pth.endswith(".sha256") else sha(pth)
            except Exception:
                continue
            lines.append(f"- `{pth}` — sha256: `{h}`")

os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT,"w").write("\n".join(lines)+"\n")
print(OUT)