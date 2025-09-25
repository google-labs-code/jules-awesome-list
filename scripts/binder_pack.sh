#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-binder}"
OUT_DIR="binder/release"

mkdir -p "$OUT_DIR"

TS=0
SHA=$(git rev-parse --short=12 HEAD 2>/dev/null || date -u +%Y%m%d%H%M%S)
TAR="$OUT_DIR/binder-${SHA}.tar.gz"
TMP=$(mktemp -d)

rsync -a --delete --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r "$ROOT"/ "$TMP/binder/"

export GZIP=-n
tar --sort=name --mtime="@${TS}" --owner=0 --group=0 --numeric-owner \
  --format=pax --pax-option=exthdr.name=%d/PaxHeaders/%f,delete=atime,delete=ctime \
  -C "$TMP" -czf "$TAR" binder

sha256sum "$TAR" | tee "$TAR.sha256"

echo "$TAR"