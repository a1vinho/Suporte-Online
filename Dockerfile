FROM node:alpine

WORKDIR /app

COPY . .

CMD ['npx',"nodemon serve.js"]