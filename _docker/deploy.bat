docker run -d --name=evck-rest --network genn-net -p 3000:3000 -e db_connStr="postgresql://postgres:dautiendo@postgres11-stage/eventcheckin" -e DEBUG_HIDE_DATE=true -e DEBUG="evck:*"  gennovative/event-checkin-rest-server:vpbank-2.1.0
docker run -d --name=evck-rest --network genn-net -p 3000:3000 -e db_host="postgres11-stage" -e db_pass="dautiendo" -e DEBUG_HIDE_DATE=true -e DEBUG="evck:*"  gennovative/event-checkin-rest-server:vpbank-2.3.0

echo "Creating swarm services in stack eventcheckin..."
docker stack deploy -c docker-compose.yml eventcheckin

sleep 5
echo "Done!"
docker service ls
