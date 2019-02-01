+++
title = "my new life stack"
date = 2018-02-01

tags = ["life", "technology"]
+++

This is my first post on my new blog! I used to put a CTF challenge writeup here but decided to change it up a bit. Recently, I've been changing a lot of the technology that I use day to day. Here's some of the changes that I've made!

## Operating System

I've ran regular Ubuntu on my laptop for a while, then switched to Elementary OS, which I found a lot more pleasing to use. After using Elementary OS for about 6 months, some of the software on my computer started behaving strangely, and I decided it was time for some change.

```
# michael @ arch in ~ [3:20:09] 
$ screenfetch
                   -`                 
                  .o+`                 michael@arch
                 `ooo/                 OS: Arch Linux 
                `+oooo:                Kernel: x86_64 Linux 4.14.15-1-ARCH
               `+oooooo:               Uptime: 6h 3m
               -+oooooo+:              Packages: 546
             `/:-:++oooo+:             Shell: zsh 5.4.2
            `/++++/+++++++:            Resolution: 1920x1080
           `/++++++++++++++:           WM: i3
          `/+++ooooooooooooo/`         CPU: Intel Core i7-6500U @ 4x 3.1GHz [37.0Â°C]
         ./ooosssso++osssssso+`        GPU: intel
        .oossssso-````/ossssss+`       RAM: 2963MiB / 7872MiB
       -osssssso.      :ssssssso.     
      :osssssss/        osssso+++.    
     /ossssssss/        +ssssooo/-    
   `/ossssso+/:-        -:/+osssso+-  
  `+sso+:-`                 `.-/+oso: 
 `++:.                           `-/+/
 .`                                 `/

```

I installed Arch Linux on my laptop the day before yesterday. I've used Arch Linux before, about a year ago, so setup was relatively familiar. On top of Arch Linux, I'm using the very widely recommended i3 tiling window manager, and urxvt terminal emulator.

## Code Editor

I usually use Sublime Text and Visual Studio Code (VSCode) equally much. Both editors are extremely customizable (and VSCode seems to be heavily inspired from Sublime), but when it comes down to it, VSCode doesn't outperform Sublime. There are many occasions when VSCode just takes forever (for example, when trying to open large codebases, and then automatically running static analyzers over the entire thing).

Since I started using Arch Linux, I've been trying out neovim. I'm packing my configuration with plugins, and seeing how well it works out as my main code editor. If I get really comfortable with it, I'll share my init file on a Git repo, probably.

## Browser... ??

I used to use Chromium, and ..I still do. I've tried several alternatives, like Firefox or even Vivaldi, but all of them seem to be missing something. I haven't tried the new Firefox Quantum yet, but unless there's a really big reason for me to change my browser, I'm probably going to stick to Chrome for a while. Chrome's DevTools are by far the best I've used, and its general ease of use makes it my favorite browser.

### cVim

[cVim](https://chrome.google.com/webstore/detail/cvim/ihlenndgcmojhcghmfjfneahoeklbjjh?hl=en) is a nice Chrome extension that provides vim-like keyboard bindings to Chrome. I'm going to have to admit that there's a lot of quirks around using it on pages that have heavy key bindings, but ever since I started using it, I can't help but use j/k scrolling and H/L for back and forth navigation!

## Personal Server

I got a droplet off DigitalOcean for hosting things that I regularly depend on. In fact, this blog (running Ghost) is hosted there now! I'm also hosting a Git server over at [https://git.mzhang.me](https://git.mzhang.me). It's running Gitea, a Go-based GitHub alternative. This doesn't mean I'm completely ditching GitHub, I just have things that I _really_ want to keep private, private.