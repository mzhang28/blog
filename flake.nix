{
  inputs.agda.url = "github:agda/agda";
  outputs = { self, nixpkgs, flake-utils, agda, }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        agda-pkg = agda.packages.x86_64-linux.default;
        flakePkgs = rec {
          agda-bin = pkgs.callPackage ./nix/agda-bin.nix { inherit agda-pkg; };
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
              woodpecker-cli
              nixfmt-rfc-style
              dive
              nix-tree
              vips
              shellcheck
              agda-bin

              nodejs_20
              corepack
            ];
        };
      });
}
