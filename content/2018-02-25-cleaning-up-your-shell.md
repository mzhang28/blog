+++
title = "cleaning up your shell"
date = 2018-02-25

[taxonomies]
tags = ["bash", "zsh", "terminal"]
+++

Is your shell loading slower than it used to? Maybe you've been sticking a bit more into your `.bashrc`/`.zshrc` than you thought.

It's only been a couple weeks since I installed my computer, and already my shell has been starting to lag. Since there's not that much I've put into my `.zshrc` file, I knew who the main culprits were. Namely, oh-my-zsh's "git" plugin and the nvm (node version manager) trying to load itself on startup. I'm not exactly in a situation where I need nvm most of the time I open my shell, so getting rid of that made my shell load a lot faster. It also means that every time I want to use node or npm, I'd have to manually call nvm, but that's not as important to me as a faster shell load time, especially since I don't really touch node that much.

One trick you can use to see what scripts are being called at startup is the `-x` option (stands for xtrace) that popular shells like `bash` and `zsh` support. If you go into your shell and run `set -o xtrace`, you'll see it start to spit out some bash commands; this is the list of everything that is being run when your shell starts. You might find that some apps take a ridiculous amount of time to start up. These are some of the things you'd want to eliminate.
