#!/usr/bin/env sh

# Copy SSH keys for Docker builder to pull code from private repositories.
\cp -Rf ~/.ssh ./.ssh

docker build -t gennovative/event-checkin-rest-server:vpbank-1.0.0 -f ./Dockerfile ..

\rm -rf ./.ssh
