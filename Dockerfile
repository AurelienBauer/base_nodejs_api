FROM node:16.11.1

EXPOSE 3000

RUN mkdir -p /var/www/cache

WORKDIR /var/www/cache

COPY package.json ./

RUN npm install && rm package.json

RUN mkdir -p /var/www/base_nodejs_api

WORKDIR /var/www/base_nodejs_api

#ENTRYPOINT [ "mv", "/var/www/cache/*", "." ]

# CMD [  "mv", "/var/www/cache/*", "." ]