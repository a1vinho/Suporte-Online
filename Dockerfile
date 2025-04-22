FROM node

WORKDIR /app

COPY package.json
COPY . .

RUN apt update && apt upgrade -y && npm install 

EXPOSE 8083

CMD ["npm","start"]