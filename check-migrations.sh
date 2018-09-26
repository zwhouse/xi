#!/usr/bin/env bash

if [ -z "$DATABASE_URL" ]; then
    # On a local dev machine, or on Travis CI, the DATABASE_URL will not be set.
    echo "skipping 'typeorm migration:run'";
else
    IFS=':/@' read -ra TOKENS <<< "$DATABASE_URL"

    username="${TOKENS[3]}";
    password="${TOKENS[4]}";
    host="${TOKENS[5]}";
    port="${TOKENS[6]}";
    database="${TOKENS[7]}";

    echo "{
           \"type\": \"postgres\",
           \"host\": \"$host\",
           \"port\": $port,
           \"username\": \"$username\",
           \"password\": \"$password\",
           \"database\": \"$database\",
           \"entities\": [\"dist/src/db/*.js\"],
           \"migrationsTableName\": \"__migrations__\",
           \"migrations\": [\"dist/src/migration/*.js\"],
           \"cli\": {
             \"migrationsDir\": \"src/migration\"
           },
           \"extra\": {
             \"ssl\": true
           },
           \"logging\": false
         }" > "ormconfig-production.json";

    tsc
    typeorm migration:run --config ormconfig-production
fi