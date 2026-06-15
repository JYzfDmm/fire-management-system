#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd "$(dirname "$0")"

echo "========================================"
echo "  消防队综合管理系统 - 前端启动"
echo "========================================"
echo ""
echo "访问地址：http://localhost:4200"
echo ""
echo "按 Ctrl+C 停止服务"
echo "========================================"
echo ""

exec npm start
