#!/bin/bash

echo "Rebuilding development environment..."
docker-compose -f docker-compose.dev.yml down -v

# 删除本地node_modules，确保容器内重新安装
echo "Removing node_modules volume..."
docker volume rm $(docker volume ls -q | grep node_modules) 2>/dev/null || true

echo "Building and starting containers..."
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d

echo "Showing logs..."
docker-compose -f docker-compose.dev.yml logs -f app 