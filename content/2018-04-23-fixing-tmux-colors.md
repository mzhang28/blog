+++
title = "fixing tmux colors"
date = 2018-04-23

[taxonomies]
tags = ["computers", "terminal"]
+++

Put this in your `~/.tmux.conf`.

```bash
set -g default-terminal "screen-256color"
```

If this isn't set properly, tmux usually assumes 16-color mode, which displays colors probably not like what you're used to.
