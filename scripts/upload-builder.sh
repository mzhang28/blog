#!/usr/bin/env bash

set -euo pipefail

nix build .#docker-builder
IMAGE_NAME=$(docker load -q -i ./result | cut -d':' -f2,3 | xargs)
REMOTE_IMAGE_NAME="git.mzhang.io/michael/$IMAGE_NAME"
docker image tag "$IMAGE_NAME" "$REMOTE_IMAGE_NAME"

sed -i -E "s~(.*image: ).*blog-docker-builder:?.*~\1$REMOTE_IMAGE_NAME~" .woodpecker.yml
echo "Created $REMOTE_IMAGE_NAME"

if [ "${1+}" == "push" ]; then
  docker push "$REMOTE_IMAGE_NAME"
fi
