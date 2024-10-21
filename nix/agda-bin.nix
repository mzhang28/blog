{ agda-pkg, runCommand, writeShellScriptBin, writeTextFile, agdaPackages }:

let
  libraryFile =
    with agdaPackages;
    writeTextFile {
      name = "agda-libraries";
      text = ''
        ${agdaPackages.cubical.src}/cubical.agda-lib
        ${agdaPackages.standard-library.src}/standard-library.agda-lib
      '';
    };

  # Add an extra layer of indirection here to prevent all of GHC from being pulled in
  wtf = runCommand "agda-bin" { } ''
    cp ${agda-pkg}/bin/agda $out
  '';
in

writeShellScriptBin "agda" ''
  set -euo pipefail
  exec ${wtf} --library-file=${libraryFile} $@
''
