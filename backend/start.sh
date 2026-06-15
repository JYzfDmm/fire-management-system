#!/bin/bash
export JAVA_HOME="/Users/jyzf/tools/jdk-17.0.9.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:/Users/jyzf/tools/apache-maven-3.9.6/bin:$PATH"

cd "$(dirname "$0")"

echo "========================================"
echo "  消防队综合管理系统 - 后端启动"
echo "========================================"
echo ""
echo "访问地址："
echo "  后端 API: http://localhost:8080/api"
echo "  H2 控制台: http://localhost:8080/api/h2-console"
echo "  JDBC URL: jdbc:h2:mem:firedb"
echo "  用户名: sa"
echo "  密码: (空)"
echo ""
echo "按 Ctrl+C 停止服务"
echo "========================================"
echo ""

exec mvn spring-boot:run
