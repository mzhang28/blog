+++
title = "Getting a shell in a Docker Compose container without any shells"
date = 2023-03-29
tags = ["docker", "linux"]
+++

Here is a rather dumb way of entering a Docker Compose container that didn't
have a shell. In this specific case, I was trying to enter a Woodpecker CI
container without exiting it. Some Docker containers are incredibly stripped
down to optimize away bloat (which is good!) but this may make debugging them
relatively annoying.

> These are my specific steps for running it, please replace the paths and
> container names with the ones relevant to your specific use-case.

At first, I tried an approach following [this][1] document. But once I got to
actually running commands within the namespace, I realized that this exposes the
exact same interface as Docker compose; if there was no shell available from the
Docker container entirely, then I couldn't run something from outside. I would
need to get some shell into the container.

[1]: https://www.redhat.com/sysadmin/container-namespaces-nsenter

Fortunately, there's a software that contains a lot of handy tools in one
binary: [busybox][2]. It's a GPL software that contains a small implementation
of some coreutils (the Unix utilities like `ls` and `cp`) in a single static
binary.

[2]: https://busybox.net/

I grabbed a copy of the busybox tool using:

```
$ nix build nixpkgs#pkgsStatic.busybox
```

(if you are not using [Nix][3], you may want to grab one of the pre-built
binaries from their website)

[3]: https://nixos.org/

To make sure it's statically linked (this means it doesn't depend on any
libraries already existing on your system, which may not be available within the
container), run this:

```
$ ldd ./result/bin/busybox
	not a dynamic executable
```

If it doesn't say "not a dynamic executable" exactly, you're not using a static
build. If you're downloading off the website, make sure you look for something
that says [`musl`][4], which is a static version of libc.

[4]: https://musl.libc.org/

Now it's just a matter of getting this binary into the container.

```
$ docker compose cp ./result/bin/busybox woodpecker-server:/
```

Now, I can run a shell, using the busybox program:

```
$ docker compose exec woodpecker-server /busybox sh
/ #
```

If you just ran busybox without the `sh` param, then it would list all the
busybox utilities that were built into your static binary. At this point, I also
ran:

```
/ # /busybox --install -s /bin
```

within the container. This installs symlinks to busybox so it acts as each of
the individual programs it emulates. Now I can type `ls` instead of having to
run `busybox ls` every single time.
