{ agda, runCommand }:

runCommand "agda-bin" { }
  ''
    cp ${agda}/bin/agda $out
  ''
