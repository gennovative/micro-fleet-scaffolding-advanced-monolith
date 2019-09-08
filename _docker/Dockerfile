# Multi-stage Build. See: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#use-multi-stage-builds
FROM node:12-alpine as build

# Install tools required for project
RUN apk add --update --virtual .dev-dep git openssh build-base ca-certificates python perl openssh-client gnupg netcat-openbsd

# This layer is only re-built when package.json is updated
RUN mkdir -m 777 -p /usr/src
COPY package.json /usr/src
WORKDIR /usr/src
RUN npm install --production --no-cache
RUN npm install @event-checkin/contracts@=2.3.0

# Uninstall development dependencies and clear caches to keep the image tiny.
RUN rm -rf /var/lib/apk/lists/* && \
    rm /var/cache/apk/* && \
    apk del .dev-dep

# Copy the entire project
# This layer is rebuilt when a file changes in the project directory
COPY . .

# This results in a single layer image
FROM node:12-alpine
COPY --from=build /usr/src /usr/src
WORKDIR /usr/src
CMD ["node", "./dist/app/server.js"]
