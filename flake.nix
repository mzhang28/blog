{
  outputs = { self, nixpkgs, flake-utils }: flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };
      flakePkgs = { builder = pkgs.callPackage ./docker/builder.nix { }; };
    in
    {
      packages = flake-utils.lib.flattenTree flakePkgs;
    });
}
