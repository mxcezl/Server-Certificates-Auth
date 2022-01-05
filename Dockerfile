# syntax=docker/dockerfile:1
FROM node

ENV NODE_ENV=production

WORKDIR /
COPY ["package.json","package-lock.json","./"]
RUN npm install --production
COPY . .

WORKDIR /
CMD ["node","server.js"]

