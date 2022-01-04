# syntax=docker/dockerfile:1
FROM node

ENV NODE_ENV=production

WORKDIR /
COPY ["package.json","package-lock.json","./"]
RUN npm install --production
COPY . .

WORKDIR /keys/server
RUN /scripts/create_cert_server

WORKDIR /
CMD ["node","server.js"]

