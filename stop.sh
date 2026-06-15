#!/bin/bash

echo "========================================"
echo "  消防队综合管理系统 - 停止服务"
echo "========================================"
echo ""

BACKEND_PID=$(lsof -ti:8080 2>/dev/null)
FRONTEND_PID=$(lsof -ti:4200 2>/dev/null)

if [ -z "$BACKEND_PID" ] && [ -z "$FRONTEND_PID" ]; then
    echo "没有正在运行的服务"
    exit 0
fi

if [ -n "$BACKEND_PID" ]; then
    echo "停止后端服务 (端口 8080, PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null
    sleep 1
    if lsof -ti:8080 >/dev/null 2>&1; then
        echo "强制停止后端服务..."
        kill -9 $BACKEND_PID 2>/dev/null
    fi
    echo "✓ 后端服务已停止"
else
    echo "- 后端服务未运行 (端口 8080)"
fi

if [ -n "$FRONTEND_PID" ]; then
    echo "停止前端服务 (端口 4200, PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null
    sleep 1
    if lsof -ti:4200 >/dev/null 2>&1; then
        echo "强制停止前端服务..."
        kill -9 $FRONTEND_PID 2>/dev/null
    fi
    echo "✓ 前端服务已停止"
else
    echo "- 前端服务未运行 (端口 4200)"
fi

echo ""
echo "所有服务已停止"
