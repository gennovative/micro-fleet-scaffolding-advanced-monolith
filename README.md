# Scafolding for simple monolith RESTful service with [MicroFleet](https://github.com/gennovative/micro-fleet) framework


---
## COMPILING SOURCE CODE

- First of all, run `npm install`: To install dependencies.
- Service settings can be customized in `src/app/configs.ts`
- Run `npm run build` to transpile TypeScript to JavaScript, or `npm run watch` to keep watching and transpiling changes in files.
- Run `npm run dev` to bootstrap the service in debug mode, errors are logged to console as well as returned to client-side.
- Run `npm start` to start service in production mode, errors are not logged and client-side only receives validation errors.

## SETUP DATABASE
This scafolding uses PostgreSQL as default, you can change database engine in `src/app/configs.ts`. If you don't already have PostgreSQL installed, the quickest way is run a Docker image:

  ```bash
  docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:11-alpine
  ```

We use database migration file for more fine-grained control of table creation:

- `cd _database`
- `npx knex migrate:latest` to create tables for development.
- `npx knex seed:run` to insert seed data.

- To re-run migration, go to database then delete all rows in table `knex_migrations.`

## RELEASE

- Jump to script folder: `cd ./_docker`
- Create Docker image: `sudo sh ./create-image.sh`
- Deploy services to Docker swarm: `sudo sh ./deploy.sh`
- Remove services from Docker swarm: `sudo sh ./undeploy.sh`