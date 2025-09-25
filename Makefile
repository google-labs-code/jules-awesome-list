binder-pack:
	chmod +x scripts/binder_pack.sh && scripts/binder_pack.sh binder

binder-verify-oci:
	python3 scripts/verify_binder_oci.py

binder-verify-oci-offline:
	python3 scripts/verify_binder_oci.py --tar $$(ls binder/release/binder-*.tar.gz | tail -n1)

index:
	python3 scripts/binder_index.py