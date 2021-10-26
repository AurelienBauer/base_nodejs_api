FROM node:16.11.1

EXPOSE 3000

RUN mkdir -p /var/www/cache

WORKDIR /var/www/cache

COPY package.json ./

RUN npm install && rm package.json

RUN openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 -subj "/C=FR/ST=France/L=_/O=_/CN=_" -keyout server.key.pem -out server.cert.pem

RUN mkdir -p /var/www/base_nodejs_api

WORKDIR /var/www/base_nodejs_api

#ENTRYPOINT [ "mv", "/var/www/cache/*", "." ]

# CMD [  "mv", "/var/www/cache/*", "." ]