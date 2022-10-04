FROM node

RUN apt-get update
RUN apt-get install sqlite3

WORKDIR /usr/src/app
COPY . .

RUN rm -rf node_modules
RUN npm install
RUN npm audit fix

EXPOSE 3000

CMD [ "npx", "ts-node", "src/infrastructure/api/server.ts" ]