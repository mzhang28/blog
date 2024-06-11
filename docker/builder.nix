{ pkgs ? import <nixpkgs> { }
}:


pkgs.dockerTools.buildImage {
  name = "hello-docker";
  config = {
    Cmd = [ "${pkgs.hello}/bin/hello" ];
    Env = [
      "PATH=${pkgs.agda.withPackages (p: with p; { standard-library })}" ];
  };
}
