{ dockerTools
, agda-bin
, corepack
, rsync
, openssh
, bash
, coreutils
, nodejs_20
, gnused
, pkgsLinux
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
    fakeNss
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

