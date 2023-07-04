serve:
    hugo serve --bind 0.0.0.0 --port 8313 --buildDrafts

linkcheck:
    wget --spider -r -nd -nv -H -l 1 http://localhost:1313
