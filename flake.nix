{
  inputs.agda.url = "github:agda/agda";
  outputs = { self, nixpkgs, flake-utils, agda }: flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };
      agda-pkg = agda.packages.x86_64-linux.default;
      flakePkgs = {
        agda = agda-pkg;
        agda-bin = pkgs.callPackage ./nix/agda-bin.nix { agda = agda-pkg; };
        docker-builder = pkgs.callPackage ./nix/docker-builder.nix { };
      };
    in
    {
      packages = flake-utils.lib.flattenTree flakePkgs;
      devShell = pkgs.mkShell {
        packages = with pkgs; [ nixfmt-rfc-style ];
      };
    });
}
