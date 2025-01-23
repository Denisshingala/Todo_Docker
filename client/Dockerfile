FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN ["npm", "install"]

COPY . .

CMD ["npm", "start"]

VOLUME /app

EXPOSE 3000