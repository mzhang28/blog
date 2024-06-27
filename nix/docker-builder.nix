{ dockerTools
, buildEnv
, agda-bin
, corepack
, rsync
, openssh
, bash
, coreutils
, bun
, nodejs_20
}:

dockerTools.buildLayeredImage {
  name = "blog-docker-builder";

  contents = with dockerTools; [
    agda-bin
    corepack
    rsync
    openssh
    bash
    coreutils
    bun
    nodejs_20
    usrBinEnv
    caCertificates
  ];
}

#   copyToRoot = with dockerTools; buildEnv {
#     name = "blog-docker-builder-image-root";
#     paths = [
#     ];
#   };

