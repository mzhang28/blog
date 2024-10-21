{ dockerTools
, agda-bin
, bash
, corepack
, coreutils
, gitMinimal
, gnused
, minio-client
, nodejs_20
, openssh
, pkgsLinux
, rsync
}:

dockerTools.buildLayeredImage {
  name = "blog-docker-builder";

  contents = with dockerTools; [
    agda-bin
    bash
    caCertificates
    corepack
    coreutils
    fakeNss
    gitMinimal
    gnused
    minio-client
    nodejs_20
    openssh
    rsync
    usrBinEnv
  ];

  # fakeRootCommands = ''
  #   #!${pkgsLinux.runtimeShell}
  #   ${pkgsLinux.dockerTools.shadowSetup}
  #   groupadd -r builder
  #   useradd -r -g builder builder
  # '';
}

#   copyToRoot = with dockerTools; buildEnv {
#     name = "blog-docker-builder-image-root";
#     paths = [
#     ];
#   };

