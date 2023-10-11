# FROM haskell:9-slim-buster
# RUN cabal update
# RUN cabal install --global Agda-2.6.4
#
# FROM debian:buster-slim
# COPY --from=0 /root/.cabal/bin/agda /usr/bin/agda
# COPY --from=0 /root/.cabal/store/ghc-9.6.3/Agda-2.6.4-c592e701b6d172f37cf6e17790bc1993481dac7a9e29753b34c448a31924a9ab/share/lib /root/.cabal/store/ghc-9.6.3/Agda-2.6.4-c592e701b6d172f37cf6e17790bc1993481dac7a9e29753b34c448a31924a9ab/share/lib
# CMD ["agda", "--interactive"]

FROM alpine AS base
ENV PATH /root/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
RUN apk add --update curl alpine-sdk ncurses-dev gmp-dev zlib-dev

FROM base AS agda-build
RUN curl -sSL https://get.haskellstack.org/ | sh
RUN stack install ghc-9.4.7
RUN git clone --depth 1 --single-branch --branch v2.6.4 https://github.com/agda/agda
WORKDIR /agda
RUN stack --stack-yaml stack-9.4.7.yaml install

FROM base
COPY --from=agda-build /root/.local/bin/agda /usr/bin/agda
COPY --from=agda-build /agda/.stack-work/install/x86_64-linux-musl/099dc152e5f5edaf6e084b385953a851d037c26c20471a6eefaa57c4704a9540/9.4.7/share/x86_64-linux-ghc-9.4.7/Agda-2.6.4/lib /agda/.stack-work/install/x86_64-linux-musl/099dc152e5f5edaf6e084b385953a851d037c26c20471a6eefaa57c4704a9540/9.4.7/share/x86_64-linux-ghc-9.4.7/Agda-2.6.4/lib
