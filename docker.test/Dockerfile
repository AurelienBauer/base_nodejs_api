FROM node:16.11.1

ENV NODE_ENV="test"
ENV RUN_ON_DOCKER="0"
ENV PROJECT_NAME="blank_api"
ENV PORT=3000
ENV JWT_EXPIRATION_DELAY="4"
ENV USE_REFRESHTOKEN="1"
ENV LOGGER=all
ENV JWT_SECRET=my_secret_jwt

RUN mkdir -p /var/www/base_nodejs_api

WORKDIR /var/www/base_nodejs_api

COPY . .

RUN npm install

CMD [  "npm", "run", "test" ]
