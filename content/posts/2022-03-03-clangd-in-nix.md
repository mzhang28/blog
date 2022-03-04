+++
title = "Clangd in Nix"
date = 2022-03-03
tags = ["nixos"]
+++

I've been using [Nix][NixOS] a lot recently since it handles dependency
management very cleanly, but one gripe that I've been having is that when I'm
doing C/C++ development work using `nix develop`, all my dependencies are
actually in the Nix store in `/nix`, so my [clangd] editor plugin won't be able
to find them.

Fortunately, clangd supports looking for a file called `compile_commands.json`,
which describes the compilation commands used for each file, with absolute paths
for all dependencies.

For [CMake]-based projects, there's an option to dump this information
automatically into the build directory, which I typically then symlink into my
project's root directory for my editor to find and apply to my files. Here's the
snippet:

```cmake
# Generate the `compile_commands.json` file.
set(CMAKE_EXPORT_COMPILE_COMMANDS ON CACHE INTERNAL "")

if(CMAKE_EXPORT_COMPILE_COMMANDS)
  set(CMAKE_CXX_STANDARD_INCLUDE_DIRECTORIES
    ${CMAKE_CXX_IMPLICIT_INCLUDE_DIRECTORIES})
endif()
```

[NixOS]: https://nixos.org/
[clangd]: https://clangd.llvm.org/
[CMake]: https://cmake.org/
