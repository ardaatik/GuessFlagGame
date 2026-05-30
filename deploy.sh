#!/usr/bin/env bash
set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ENV_FILE="${1:-.env}"
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

COMPOSE_FILE="${GUESSTHEFLAG_COMPOSE_FILE:-compose.yml}"
STACK_NAME="${GUESSTHEFLAG_STACK_NAME:-guesstheflag}"

docker stack deploy \
  -c "$COMPOSE_FILE" \
  "$STACK_NAME" \
  --with-registry-auth
