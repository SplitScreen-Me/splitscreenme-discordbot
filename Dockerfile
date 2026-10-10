FROM node:22-slim

ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY package.json yarn.lock ./


RUN yarn install --frozen-lockfile --production
COPY . .

CMD [ "npm", "run", "start:prod" ]
