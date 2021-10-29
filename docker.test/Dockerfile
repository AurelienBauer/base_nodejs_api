FROM node:16.11.1

RUN mkdir -p /var/www/base_nodejs_api

WORKDIR /var/www/base_nodejs_api

COPY .env.test .env

COPY . .

RUN npm install

CMD [  "npm", "run", "test" ]