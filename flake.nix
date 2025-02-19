{
  inputs.agda.url = "github:agda/agda?tag=release-2.7.0";
  inputs.agda.inputs.nixpkgs.follows = "nixpkgs";

  inputs.nixpkgs.url = "github:nixos/nixpkgs";

  outputs = { self, nixpkgs, flake-utils, agda, }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; overlays = [ agda.overlays.default ]; };
        agda-pkg = agda.packages.x86_64-linux.default;
        flakePkgs = rec {
          agda-bin = pkgs.callPackage ./nix/agda-bin.nix { agda-pkg = pkgs.haskellPackages.Agda.bin; };
          docker-builder =
            pkgs.callPackage ./nix/docker-builder.nix { inherit agda-bin; };
        };
      in {
        packages = flake-utils.lib.flattenTree flakePkgs;
        devShell = pkgs.mkShell {
          ASTRO_TELEMETRY_DISABLED = 1;

          packages = with pkgs;
            with flakePkgs; [
              bun
              nixfmt-rfc-style
              nix-tree
              shellcheck

              nodejs_20
              corepack
            ];
        };
      });
}
