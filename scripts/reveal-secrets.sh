#!/bin/sh
set -e

# Handle the separate keyrings, reveal secrets
if [ $NODE_ENV == "production" ];
  then
    npm run reveal-secrets:prod
  else
    npm run reveal-secrets
fi

SECRETS_LOCATION=packages/backend/config
LIQUIBASE_SECRETS_LOCATION=packages/database/configs

# Delete unencrypted secrets whose names isn't matching the current NODE_ENV
# This is to avoid having secrets in production that are not in development
ls -d $SECRETS_LOCATION/* | grep -v ".op.json\|default.json\|database.js\|test.json\|custom-environment-variables.json" | grep -v "${NODE_ENV#*-}" | grep ".json$" | xargs rm -f
ls -d $LIQUIBASE_SECRETS_LOCATION/* | grep -v "${NODE_ENV#*-}.properties" | grep -v ".op.properties$" | grep ".properties$" | xargs rm -f
