FROM node:12

ENV NODE_ENV production

WORKDIR /usr/src/app
COPY package*.json ./


RUN npm install --production
COPY . .

CMD [ "npm", "run", "start:prod" ]