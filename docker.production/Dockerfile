FROM node:16.11.1

EXPOSE 3000

ENV RUN_ON_DOCKER=1

RUN mkdir -p /var/www/base_nodejs_api

WORKDIR /var/www/base_nodejs_api

COPY . .

COPY .env.test .env

RUN npm install

CMD [  "npm", "run", "start.docker" ]
