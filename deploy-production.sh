#!/usr/bin/env bash
echo "Deploy script started"
#npm run test;
cd /home/deploy/apis/auth
git stash; git pull origin master; npm install; tsc;

logs_path=dist/logs/$(git rev-parse HEAD)

echo "Setting up logs..."
mkdir $logs_path -p
echo "Logs dir setup"

echo "Reloading application"
pm2 reload auth --update-env
echo "Application started"

echo 'Deploy finished'
echo "Deploy script finished"