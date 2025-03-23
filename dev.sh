#!/bin/bash

# 启动开发环境
echo "Starting development environment..."
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d

# 显示日志
echo "Showing logs..."
docker-compose -f docker-compose.dev.yml logs -f app 