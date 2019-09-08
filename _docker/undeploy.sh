#!/usr/bin/env sh

source ./constants.sh .

echo "Removing swarm services in stack '$stackname'..."
docker stack rm $stackname

sleep 5
echo "Done!"
docker service ls
