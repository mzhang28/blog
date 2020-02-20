+++
title = "my setup"

[extra]
toc = true
+++

## laptop

I'm using Arch Linux on my personal machine. Here's a neofetch:

```
# michael @ kawa in ~ [12:42:16]
$ neofetch
                   -`                    michael@kawa
                  .o+`                   ------------
                 `ooo/                   OS: Arch Linux x86_64
                `+oooo:                  Host: K501UX 1.0
               `+oooooo:                 Kernel: 5.1.8-arch1-1-ARCH
               -+oooooo+:                Uptime: 10 hours, 32 mins
             `/:-:++oooo+:               Packages: 960 (pacman), 242 (nix)
            `/++++/+++++++:              Shell: zsh 5.7.1
           `/++++++++++++++:             Resolution: 1920x1080
          `/+++ooooooooooooo/`           Theme: Adwaita [GTK2/3]
         ./ooosssso++osssssso+`          Icons: Adwaita [GTK2/3]
        .oossssso-````/ossssss+`         Terminal: alacritty
       -osssssso.      :ssssssso.        CPU: Intel i7-6500U (4) @ 3.100GHz
      :osssssss/        osssso+++.       GPU: NVIDIA GeForce GTX 950M
     /ossssssss/        +ssssooo/-       GPU: Intel Skylake GT2 [HD Graphics 520]
   `/ossssso+/:-        -:/+osssso+-     Memory: 3789MiB / 7867MiB
  `+sso+:-`                 `.-/+oso:
 `++:.                           `-/+/
 .`                                 `/
```

My desktop environment is [i3](https://i3wm.org) on X11. I like it because it's lightweight and doesn't use much battery. Even after many years my laptop can still sustain 5-6 hours of prolonged usage.

### email

Currently using [ProtonMail](https://protonmail.com/).

### coding

I use the trial version of [Sublime Text 3](http://www.sublimetext.com/) on my personal computer, and [neovim](https://neovim.io/) in the terminal. I use the default theme with the [VSCode Dark](https://github.com/nikeee/visual-studio-dark) theme.

### passwords

For passwords, I'm using [pass](https://www.passwordstore.org/), which is a GPG-encrypted password store. The passwords are checked into a git repository in order to maintain consistency between multiple devices (I'm using [Android Password Store](https://github.com/zeapo/Android-Password-Store) on my phone). Then, I bind `$mod+p` to a [rofi script][#] so I can access them easily.

### music

On my personal computer, I'm using [mpd](https://www.musicpd.org/), the music player daemon along with [Cantata](https://github.com/CDrummond/cantata), which is a Qt frontend. I like using mpd because this also allows me to display my current playing song in my i3 bar.

### screenshot

I'm using a [custom screenshot tool][2], written by myself using Rust. The advantage of this over something like scrot or maim would be the ability to first freeze the screen before selecting a region.

## my phone

My phone is running the latest version of LineageOS without Google Apps, in a small effort to liberate myself from Google services. Most of the apps that I need notifications from on my phone can contact servers directly without going through Google's Firebase Cloud Messaging, which is where push notifications traditionally go.

First, here's a list of free software that I use, available from [F-Droid](https://f-droid.org/en/), a free-software app store:

- [DAVx5](https://f-droid.org/en/packages/at.bitfire.davdroid/). Great for syncing my calendar, contacts, and todo list between my computer and my phone. With a self-hosted CalDAV server, my data is in my hands.
- [DNSFilter](https://f-droid.org/en/packages/dnsfilter.android). Creates a local VPN and selectively blocks requests based on existing blacklists. This actually filters a lot of advertising and tracking data on the regular.
- [Termux](https://f-droid.org/en/packages/com.termux/). It's a terminal on your phone. Why not?
- [Weechat Android](https://f-droid.org/en/packages/com.ubergeek42.WeechatAndroid/). Weechat is an IRC client that can act like a server. With this app, my phone connects to that server and retrieves messages, including sending me notifications for new highlights and such.

Other software I use include:

- [Authy](https://authy.com/). Unfortunately, until I figure out my 2-factor backup plan, I'm going to have to stick with Authy since it handles backups well. The long-term solution here is to use backup codes, but I haven't gotten around to sorting that out yet.
- [Firefox](https://www.mozilla.org/en-US/firefox/mobile/). Yes, Firefox is on Android.
- [Signal](https://signal.org/). Encrypted chat that uses phone numbers for identity so you can basically replace SMS with almost no user-interface changes.

And a slew of other non-free apps that have pretty specific uses, though I think I've crippled my phone to the point where many of those apps are unusable. One of these days I'll go in and purge them again.

## this website

The stack for this website looks like:

- The [source code][1] is written as a set of Gutenberg config files.
- This is then transpiled into static HTML + resources using [Zola](https://getzola.org/), a static site generator written with Rust.
- Changes are deployed using Git hooks.
- Static files are served from a web root using [nginx](https://nginx.org/en/) through a virtual host.
- And here it is!

[1]: https://git.iptq.io/michael/blog
[2]: https://github.com/iptq/leanshot
