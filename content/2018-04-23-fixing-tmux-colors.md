+++
title = "fixing tmux colors"
template = "post.html"
date = 2018-04-23

tags = ["technology", "shell"]
+++

Put this in your `~/.tmux.conf`.

```bash
set -g default-terminal "screen-256color"
```

If this isn't set properly, tmux usually assumes 16-color mode, which displays colors probably not like what you're used to.