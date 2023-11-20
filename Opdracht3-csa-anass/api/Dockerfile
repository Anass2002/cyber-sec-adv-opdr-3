FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

CMD [ "node", "server.js" ]

EXPOSE 3001
