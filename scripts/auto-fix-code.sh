#!/bin/bash

# 代码自动修复脚本
# 修复常见的ESLint和TypeScript错误

echo "🔧 开始自动修复代码错误..."

# 1. 运行ESLint自动修复
echo "📝 1. 运行ESLint自动修复..."
npx eslint . --fix --ext .ts,.tsx --quiet || true

# 2. 运行TypeScript检查（不报错）
echo "📝 2. 运行TypeScript检查..."
npx tsc --noEmit --pretty false || true

# 3. 运行Prettier格式化
echo "📝 3. 运行Prettier格式化..."
npx prettier --write "**/*.{ts,tsx,js,jsx,json,md}" || true

echo "✅ 代码自动修复完成！"
