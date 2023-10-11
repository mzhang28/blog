FROM haskell:9
RUN cabal update
RUN cabal install Agda-2.6.4

