{ dockerTools
, buildEnv
, agda-bin
, corepack
, rsync
, openssh
, bash
, coreutils
, nodejs_20
, gnused
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
    nodejs_20
    gnused
    usrBinEnv
    caCertificates
  ];
}

#   copyToRoot = with dockerTools; buildEnv {
#     name = "blog-docker-builder-image-root";
#     paths = [
#     ];
#   };

