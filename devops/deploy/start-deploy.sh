#!/bin/bash
# start-deploy.sh - runs sshd in foreground (as root) because opensshd requires root for bindings
set -e

# ensure /var/run/sshd exists (should be created in Dockerfile)
if [ ! -d /var/run/sshd ]; then
  mkdir -p /var/run/sshd
fi

# start sshd as root (we need root to bind port 22)
sudo /usr/sbin/sshd -D