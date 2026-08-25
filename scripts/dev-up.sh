#!/bin/sh
# Resolves this Mac's LAN IP (needed by the mobile-metro container so Metro
# advertises a reachable address to the Simulator and physical devices) and
# starts the full dev stack. ipconfig is macOS-only, which is exactly why
# this runs on the host rather than inside a Linux container.
set -e

LAN_IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"

if [ -z "$LAN_IP" ]; then
  echo "Could not resolve a LAN IP via en0/en1 — check your network connection." >&2
  exit 1
fi

export LAN_IP
echo "Using LAN_IP=$LAN_IP"

exec docker compose up "$@"
