{ dockerTools
, agda-bin
, bash
, bun
, coreutils
, gitMinimal
, gnused
, minio-client
, openssh
, pkgsLinux
, rsync
, typst
, nodejs_22
}:

dockerTools.buildLayeredImage {
  name = "blog-docker-builder";

  contents = with dockerTools; [
    agda-bin
    bash
    bun
    caCertificates
    coreutils
    fakeNss
    gitMinimal
    gnused
    minio-client
    openssh
    rsync
    typst
    usrBinEnv
    nodejs_22
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

