FROM node:16.11.1

EXPOSE 3000

ENV RUN_ON_DOCKER=1

RUN mkdir -p /var/www/base_nodejs_api

WORKDIR /var/www/base_nodejs_api

COPY . .

COPY .env.test .env

RUN npm install

RUN openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 -subj "/C=FR/ST=France/L=_/O=_/CN=_" -keyout server.key.pem -out server.cert.pem

CMD [  "npm", "run", "start.docker" ]
