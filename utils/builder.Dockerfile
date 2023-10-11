FROM git.mzhang.io/michael/agda:2.6.4-x86_64

FROM node:18
COPY --from=0 /usr/bin/agda /usr/bin/agda
COPY --from=0 /root/.cabal/store/ghc-9.6.3/Agda-2.6.4-c592e701b6d172f37cf6e17790bc1993481dac7a9e29753b34c448a31924a9ab/share/lib /root/.cabal/store/ghc-9.6.3/Agda-2.6.4-c592e701b6d172f37cf6e17790bc1993481dac7a9e29753b34c448a31924a9ab/share/lib
