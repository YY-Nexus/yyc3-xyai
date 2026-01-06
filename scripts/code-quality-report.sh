#!/usr/bin/env bun

/**
 * 代码质量报告脚本
 *
 * 本脚本用于生成代码质量报告
 */

import { $ } from 'bun'

console.log('🔍 Running code quality checks...')

// 运 lint
console.log('\n🔍 Running linter...')
const lintResult = await $`bun run lint --format=json > eslint-report.json`.nothrow()

if (lintResult.exitCode !== 0) {
  console.error('\n❌ Linter failed!')
} else {
  console.log('\n✅ Linter passed!')
}

// 运行类型检查
console.log('\n🔧 Running type check...')
const typeCheckResult = await $`bun run type-check`.nothrow()

if (typeCheckResult.exitCode !== 0) {
  console.error('\n❌ Type check failed!')
} else {
  console.log('\n✅ Type check passed!')
}

// 运行测试覆盖率
console.log('\n🧪 Running tests with coverage...')
const testResult = await $`bun test --coverage`.nothrow()

if (testResult.exitCode !== 0) {
  console.error('\n❌ Tests failed!')
} else {
  console.log('\n✅ Tests passed!')
}

console.log('\n📊 Code quality report generated!')
console.log('View ESLint report at: eslint-report.json')
console.log('View coverage report at: coverage/html/index.html')
