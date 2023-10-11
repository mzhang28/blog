FROM git.mzhang.io/michael/agda:2.6.4-x86_64

FROM node:18-alpine AS node
RUN apk add --update git
RUN npm install -g pnpm

FROM node AS astro-build
WORKDIR /tmp
RUN git clone https://git.mzhang.io/michael/astro --depth 1
WORKDIR /tmp/astro
RUN pnpm install
RUN pnpm run build
RUN rm -rf node_modules


FROM node
COPY --from=0 /usr/bin/agda /usr/bin/agda
COPY --from=0 /agda/.stack-work/install/x86_64-linux-musl/099dc152e5f5edaf6e084b385953a851d037c26c20471a6eefaa57c4704a9540/9.4.7/share/x86_64-linux-ghc-9.4.7/Agda-2.6.4/lib /agda/.stack-work/install/x86_64-linux-musl/099dc152e5f5edaf6e084b385953a851d037c26c20471a6eefaa57c4704a9540/9.4.7/share/x86_64-linux-ghc-9.4.7/Agda-2.6.4/lib

COPY --from=astro-build /tmp/astro /tmp/astro
WORKDIR /tmp/astro/packages/astro
RUN pnpm link --global
WORKDIR /tmp/astro/packages/markdown/remark
RUN pnpm link --global

WORKDIR /

