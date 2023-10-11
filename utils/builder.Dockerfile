FROM git.mzhang.io/michael/agda:2.6.4-x86_64

FROM node:18-alpine
COPY --from=0 /usr/bin/agda /usr/bin/agda
COPY --from=0 /agda/.stack-work/install/x86_64-linux-musl/099dc152e5f5edaf6e084b385953a851d037c26c20471a6eefaa57c4704a9540/9.4.7/share/x86_64-linux-ghc-9.4.7/Agda-2.6.4/lib /agda/.stack-work/install/x86_64-linux-musl/099dc152e5f5edaf6e084b385953a851d037c26c20471a6eefaa57c4704a9540/9.4.7/share/x86_64-linux-ghc-9.4.7/Agda-2.6.4/lib
