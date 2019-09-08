#!/usr/bin/env sh

source ./constants.sh .

echo "Creating swarm services in stack '$stackname'..."
docker stack deploy -c docker-compose.yml $stackname

sleep 5
echo "Done!"
docker service ls
