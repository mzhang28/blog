{ dockerTools
, awscli2
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
    awscli2
    bash
    caCertificates
    corepack
    coreutils
    fakeNss
    gnused
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

