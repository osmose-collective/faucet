FROM node:11-alpine

# Create app directory
WORKDIR /home/node/faucet

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN apk add --no-cache --virtual .build-deps make gcc g++ python git bash \
    && npm ci --only=production

COPY . /home/node/faucet

USER node

EXPOSE 8080

CMD [ "node", "main.js"]