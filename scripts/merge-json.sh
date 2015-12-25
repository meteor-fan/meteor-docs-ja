#!/bin/sh

DATE=`date '+%Y%m%d'`

cat translations/p-*.json | jq -s 'add' > translations/p-$DATE-merged.json
cat translations/strong-*.json | jq -s 'add' > translations/strong-$DATE-merged.json
cat translations/dt-*.json | jq -s 'add' > translations/dt-$DATE-merged.json
cat translations/dd-*.json | jq -s 'add' > translations/dd-$DATE-merged.json
cat translations/h1-*.json | jq -s 'add' > translations/h1-$DATE-merged.json
cat translations/h2-*.json | jq -s 'add' > translations/h2-$DATE-merged.json
cat translations/h3-*.json | jq -s 'add' > translations/h3-$DATE-merged.json
cat translations/em-*.json | jq -s 'add' > translations/em-$DATE-merged.json
cat translations/li-*.json | jq -s 'add' > translations/li-$DATE-merged.json
cat translations/pre-*.json | jq -s 'add' > translations/pre-$DATE-merged.json
