#!/bin/bash

sudo chown jenkins /var/run/docker.sock

exec "$@"