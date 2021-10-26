#!/bin/bash

if [[ -d /var/www/cache/node_modules ]]
then
  echo "Moving node_modules from cache to working directory can take a while..."
  mv -f /var/www/cache/node_modules /var/www/base_nodejs_api/
  echo "Move node_modules => DONE"
fi

if [[ -f /var/www/cache/package-lock.json ]]
then
  mv -f /var/www/cache/package-lock.json /var/www/base_nodejs_api/
  echo "Move package-lock.json from cache to working directory"
fi

if [[ -f /var/www/cache/server.cert.pem ]]
then
  mv -f /var/www/cache/server.cert.pem /var/www/base_nodejs_api/
  echo "Move server.cert.pem from cache to working directory"
fi

if [[ -f /var/www/cache/server.key.pem ]]
then
  mv -f /var/www/cache/server.key.pem /var/www/base_nodejs_api/
  echo "Move server.key.pem from cache to working directory"
fi

exec npm run dev.docker