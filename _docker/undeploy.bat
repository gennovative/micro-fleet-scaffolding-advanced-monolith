echo "Removing swarm services in stack eventcheckin..."
docker stack rm eventcheckin

sleep 5
echo "Done!"
docker service ls
