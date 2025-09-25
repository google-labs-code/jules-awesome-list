#!/usr/bin/env bash
set -euo pipefail

# binder-as-OCI receipts (online); switch to --tar for air-gapped labs
python3 scripts/verify_binder_oci.py