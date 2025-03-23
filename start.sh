#!/bin/bash

# 清理现有容器和数据
echo "Cleaning up existing containers and volumes..."
docker-compose down -v

# 重新构建和启动项目
echo "Building and starting production environment..."
docker-compose build
docker-compose up -d

# 显示容器状态
echo "Container status:"
docker-compose ps

# 查看日志
echo "Showing logs..."
docker-compose logs -f 