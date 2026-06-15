#!/bin/bash

cd "$(dirname "$0")"

echo "========================================"
echo "  消防队综合管理系统 - 启动所有服务"
echo "========================================"
echo ""

BACKEND_RUNNING=$(lsof -ti:8080 2>/dev/null)
FRONTEND_RUNNING=$(lsof -ti:4200 2>/dev/null)

if [ -n "$BACKEND_RUNNING" ]; then
    echo "⚠ 后端服务已在运行 (端口 8080, PID: $BACKEND_RUNNING)"
else
    echo "启动后端服务..."
    osascript -e 'tell application "Terminal" to do script "cd '"$(pwd)"'/backend && ./start.sh"'
    echo "✓ 后端启动命令已发送（新终端窗口）"
fi

if [ -n "$FRONTEND_RUNNING" ]; then
    echo "⚠ 前端服务已在运行 (端口 4200, PID: $FRONTEND_RUNNING)"
else
    echo "启动前端服务..."
    osascript -e 'tell application "Terminal" to do script "cd '"$(pwd)"'/frontend && ./start.sh"'
    echo "✓ 前端启动命令已发送（新终端窗口）"
fi

echo ""
echo "访问地址："
echo "  前端: http://localhost:4200"
echo "  后端: http://localhost:8080/api"
echo "  H2:   http://localhost:8080/api/h2-console"
