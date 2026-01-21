#!/usr/bin/env bun

/**
 * 预提交钩子脚本
 *
 * 本脚本用于在提交代码前自动运行测试
 */

import { $ } from 'bun'

console.log('🚀 Running pre-commit checks...')

// 运行测试
console.log('\n🧪 Running tests...')
const testResult = await $`bun test`.nothrow()

if (testResult.exitCode !== 0) {
  console.error('\n❌ Tests failed! Please fix the issues before committing.')
  process.exit(1)
}

// 运行 lint
console.log('\n🔍 Running linter...')
const lintResult = await $`bun run lint`.nothrow()

if (lintResult.exitCode !== 0) {
  console.error('\n❌ Linter failed! Please fix the issues before committing.')
  process.exit(1)
}

// 运行类型检查
console.log('\n🔧 Running type check...')
const typeCheckResult = await $`bun run type-check`.nothrow()

if (typeCheckResult.exitCode !== 0) {
  console.error('\n❌ Type check failed! Please fix the issues before committing.')
  process.exit(1)
}

// 运行代码质量检查
console.log('\n🔍 Running code quality checks...')
const codeQualityResult = await $`bun run code-quality-check`.nothrow()

if (codeQualityResult.exitCode !== 0) {
  console.error('\n❌ Code quality checks failed! Please fix the issues before committing.')
  process.exit(1)
}

console.log('\n✅ All checks passed! Ready to commit.')
process.exit(0)
