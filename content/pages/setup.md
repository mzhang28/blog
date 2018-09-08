+++
title = "my setup"
template = "post.html"
+++

## Desktop

I'm using Arch Linux on my personal machine. Here's a neofetch:

```
# michael @ arch in ~ [16:42:51]
$ neofetch
                   -`                    michael@arch
                  .o+`                   ------------
                 `ooo/                   OS: Arch Linux x86_64
                `+oooo:                  Host: K501UX 1.0
               `+oooooo:                 Kernel: 4.18.5-arch1-1-ARCH
               -+oooooo+:                Uptime: 1 hour, 47 mins
             `/:-:++oooo+:               Packages: 1143 (pacman)
            `/++++/+++++++:              Shell: zsh 5.5.1
           `/++++++++++++++:             Resolution: 1920x1080
          `/+++ooooooooooooo/`           WM: i3
         ./ooosssso++osssssso+`          Theme: Adwaita [GTK2/3]
        .oossssso-````/ossssss+`         Icons: Adwaita [GTK2/3]
       -osssssso.      :ssssssso.        Terminal: alacritty
      :osssssss/        osssso+++.       Terminal Font: Roboto Mono for Powerline
     /ossssssss/        +ssssooo/-       CPU: Intel i7-6500U (4) @ 3.100GHz
   `/ossssso+/:-        -:/+osssso+-     GPU: NVIDIA GeForce GTX 950M
  `+sso+:-`                 `.-/+oso:    GPU: Intel Skylake GT2 [HD Graphics 520]
 `++:.                           `-/+/   Memory: 6708MiB / 7871MiB
 .`                                 `/

```

For my desktop environment, I've got [i3](https://i3wm.org/), a tiling window manager. I like it because it's lightweight and doesn't use much battery. My config can be found [here](https://git.mzhang.me/michael/dotfiles/src/branch/master/.config/i3/config). I tried i3gaps at one point but didn't feel like trying to fix the rendering artifacts so I switched back.

### Coding

I use the trial version of [Sublime Text 3](http://www.sublimetext.com/) on my personal computer, and [neovim](https://neovim.io/) in the terminal. I use the default theme with the [VSCode Dark](https://github.com/nikeee/visual-studio-dark) theme.

### Passwords

For passwords, I'm using [pass](https://www.passwordstore.org/), which is a GPG-encrypted password store. The passwords are checked into a git repository in order to maintain consistency between multiple devices (I'm using [Android Password Store](https://github.com/zeapo/Android-Password-Store) on my phone). Then, I bind `$mod+p` to a [rofi script](https://git.mzhang.me/michael/dotfiles/src/branch/master/.local/scripts/passmenu) so I can access them easily.

### Music

On my personal computer, I'm using [mpd](https://www.musicpd.org/), the music player daemon along with [sonata](https://www.nongnu.org/sonata/), which is a GTK frontend. I like using mpd because this also allows me to display my current playing song in my i3 bar.

### Social Media

I'm using [Rambox](https://rambox.pro), which is essentially just an Electron app that combines multiple services into a single view.

### Screenshot

I'm using a [custom screenshot tool](https://git.mzhang.me/michael/screenshot).

## This Website

The stack for this website looks like:

- The [source code](https://git.mzhang.me/michael/blog) is written as a set of Gutenberg config files.
- This is then transpiled into static HTML + resources using [Gutenberg](https://www.getgutenberg.io/), a static site generator.
- Static files are served from a web root using [nginx](https://nginx.org/en/) through a virtual host.
- And here it is!

For deployment, I'm using [dip](https://nobs.mzhang.me/dip), a customizable webhook server that I wrote that rebuilds the source code on push.
