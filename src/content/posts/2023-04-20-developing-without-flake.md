---
title: "Developing on projects without flake.nix on NixOS"
date: 2023-04-20
tags: ["linux", "nixos"]
---

Ever since I became a NixOS hobbyist a few years ago, it's easy to plug NixOS
wherever I go. The way flakes create a reproducible development environment
across projects is so easy. I could clone any repository with a `flake.nix` or a
`shell.nix` file, run a simple `nix develop` (or `nix-shell`), and be completely
ready to start writing code without doing any additional setup. It configures
both the dependencies and environment variables I need and plops me straight
into a shell that has everything set up.

```
michael in 🌐 molecule in liveterm on  master [⇡] is 📦 v0.1.0 via 🦀 v1.68.0-nightly
❯ nix develop

[michael@molecule:~/Projects/liveterm]$ █
```

To make things even easier, [direnv] (along with [nix-direnv]) can insert shell
hooks so that I don't even have to run any commands; just going into the
directory itself triggers a hook that sets up my current shell, so I can keep
all of my fancy prompts and highlighting and other shell features.

```
michael in 🌐 molecule in ~
❯ j liveterm
/home/michael/Projects/liveterm
direnv: loading ~/Projects/liveterm/.envrc
direnv: using flake
direnv: nix-direnv: using cached dev shell
direnv: using flake
direnv: nix-direnv: using cached dev shell
direnv: export +AR +AS +CC +CONFIG_SHELL +CXX +DETERMINISTIC_BUILD +HOST_PATH +IN_NIX_SHELL +LD +NIX_BINTOOLS +NIX_BINTOOLS_WRAPPER_TARGET_HOST_x86_64_unknown_linux_gnu +NIX_BUILD_CORES +NIX_CC +NIX_CC_WRAPPER_TARGET_HOST_x86_64_unknown_linux_gnu +NIX_CFLAGS_COMPILE +NIX_ENFORCE_NO_NATIVE +NIX_HARDENING_ENABLE +NIX_INDENT_MAKE +NIX_LDFLAGS +NIX_PKG_CONFIG_WRAPPER_TARGET_HOST_x86_64_unknown_linux_gnu +NIX_SSL_CERT_FILE +NIX_STORE +NM +OBJCOPY +OBJDUMP +PKG_CONFIG +PKG_CONFIG_PATH +PYTHONHASHSEED +PYTHONNOUSERSITE +PYTHONPATH +RANLIB +READELF +SIZE +SOURCE_DATE_EPOCH +STRINGS +STRIP +SYSTEM_CERTIFICATE_PATH +_PYTHON_HOST_PLATFORM +_PYTHON_SYSCONFIGDATA_NAME +buildInputs +buildPhase +builder +cmakeFlags +configureFlags +depsBuildBuild +depsBuildBuildPropagated +depsBuildTarget +depsBuildTargetPropagated +depsHostHost +depsHostHostPropagated +depsTargetTarget +depsTargetTargetPropagated +doCheck +doInstallCheck +dontAddDisableDepTrack +mesonFlags +name +nativeBuildInputs +out +outputs +patches +phases +propagatedBuildInputs +propagatedNativeBuildInputs +shell +shellHook +stdenv +strictDeps +system ~PATH ~XDG_DATA_DIRS

michael in 🌐 molecule in liveterm on  master [⇡] is 📦 v0.1.0 via 🦀 v1.68.0-nightly via ❄️  impure (nix-shell)
❯ █
```

The reason behind this is that on NixOS, I am able to prevent cluttering my
global environment with project-specific configurations. While I do still have a
global Node and Python for testing one-off things, all of my projects have their
own flake file, that locks specific versions of Node and Python so I can be sure
it builds in the future.

But what about projects that don't have a flake definition file? Without some
kind of existing configuration, I have _no_ dependencies, and if I want to even
build it, I would have to write a flake myself. That's fine and all, but
typically the `flake.nix` file lives in the root directory of the project, and
it's good practice in the Nix world to commit the flake file along with its
corresponding lock file. However, the upstream project may not appreciate it if
I shove new config files in their root directory.

```
  project
    ...
     .envrc ✗
     flake.lock ✗
     flake.nix ✗
```

> The `✗` indicates that I added the file to the project, and it hasn't been
> committed to the repo yet.

One way to fix this is just to never commit the flake file. Always use explicit
names with `git add`, and constantly check `git status` to make sure the file
isn't committed. While this is good practice anyway, it gets quite cumbersome.
Some upstream projects may also be ok with adding entries into the `.gitignore`
file for the flake files, but I wouldn't be writing about it if these were the
only solutions!

### Separating the flake from the repo

[direnv] uses a file called `.envrc` to configure setup instructions whenever you
go into the directory (or subdirectories). For a normal flake setup, a simple
config would look something like this:

```
use flake
```

This would query for the default dev shell found in the current directory's
flake and set up my current shell accordingly. I figured this would probably
take parameters, and unsurprisingly, it does! So my approach is just to create a
separate directory alongside the git repository that just contains Nix flake
files.

```
  project
    ...
     .envrc ✗
  project-dev-flake
     flake.lock
     flake.nix
```

Now, the flake exists in a separate directory outside of the git repo. Now
`.envrc` needs to be updated to point to this new directory:

```
use flake /path/to/project-dev-flake
```

If you have multiple dev shells, you can also use the `project-dev-flake#shell`
syntax to point to whichever shell you would like to automatically enter.

---

Ok great, now the flake file's out of the way. But we still have this `.envrc`
that needs to exist. This file defines the behavior of the shell hook of the
directory we're in, so in the repo for us for the hook to trigger ...right?

### Separating the `.envrc` file from the repo

So actually, the `.envrc` file conveniently affects all of the subdirectories of
the directory the file is in, not just the current one. This way if you `cd`
somewhere within your project hierarchy, you're not losing all the shell hook
behavior.

We can use this by moving the git repo _into_ the dev flake instead. So now the
project structure should look a bit more like this:

```
  project-dev-flake
    project
     .envrc
     flake.lock
     flake.nix
```

> Remember, since you moved the `.envrc` file, you will need to run `direnv
allow` again. Depending on how you moved it, you might also need to change the
> path you wrote in the `use flake` command.

With this setup, the `project` directory can contain a clean clone of upstream
and your flake files will create the appropriate environment.

This _does_ create an extra layer of directory nesting, but except for copying
longer paths, it really doesn't hurt my workflow. I use [autojump], which
automatically just remembers where paths are, so I can just type `j <project>`
to go to my project's directory directly. It's sorted by frequency, so as long
as I don't visit the `-dev-flake` container directory more often, my workflow
doesn't change at all.

---

I hope this helps you set up projects to contribute to non-NixOS projects a bit
easier!

[direnv]: https://direnv.net/
[nix-direnv]: https://github.com/nix-community/nix-direnv
[autojump]: https://github.com/wting/autojump
