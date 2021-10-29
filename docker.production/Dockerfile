FROM node:16.11.1

EXPOSE 3000

ARG ARG_JWT_SECRET

ENV NODE_ENV="production"
ENV RUN_ON_DOCKER="1"
ENV PROJECT_NAME="blank_api"
ENV PORT=3000
ENV JWT_EXPIRATION_DELAY="4"
ENV USE_REFRESHTOKEN="1"
ENV LOGGER=file
ENV MONGO_HOST=mongodb://localhost:27017/base_api
ENV JWT_SECRET=$ARG_JWT_SECRET

RUN mkdir -p /var/www/base_nodejs_api

WORKDIR /var/www/base_nodejs_api

COPY . .

RUN npm install

CMD [  "npm", "run", "start.docker" ]
