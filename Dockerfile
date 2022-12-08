FROM node:alpine AS nodeServer
WORKDIR /app
EXPOSE 8090/tcp
COPY package*.json ./
COPY .env.docker ./.env
RUN npm config set scripts-prepend-node-path true && yarn install
COPY . .
CMD [ "yarn","start" ]
