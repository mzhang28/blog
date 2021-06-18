+++
title = "random scripts"
+++

### convert a bunch of `flac`s to `mp3`

```bash
#!/bin/bash
function flac2mp3() { ffmpeg -y -i "$1" -acodec libmp3lame "$(basename "$1")".mp3; }
export -f flac2mp3 # only works in bash
fd "\.flac$" | parallel flac2mp3
```
