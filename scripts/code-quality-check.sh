#!/usr/bin/env bun

/**
 * 代码质量检查脚本
 *
 * 本脚本用于检查代码质量
 */

import { $ } from 'bun'

console.log('🔍 Running code quality checks...')

let allPassed = true

// 检查代码复杂度
console.log('\n📊 Checking code complexity...')
const complexityResult = await $`bunx complexity-report src --format json`.nothrow()

if (complexityResult.exitCode !== 0) {
  console.warn('\n⚠️  High complexity detected in some files!')
  console.warn('Please consider refactoring complex functions.')
} else {
  console.log('\n✅ Code complexity is acceptable!')
}

// 检查代码重复
console.log('\n📋 Checking code duplication...')
const duplicationResult = await $`bunx jscpd --min-tokens 50 --format json --format json --output duplication-report.json .`.nothrow()

if (duplicationResult.exitCode !== 0) {
  console.warn('\n⚠️  Code duplication detected!')
  console.warn('Please consider refactoring duplicated code.')
} else {
  console.log('\n✅ No code duplication detected!')
}

// 检查代码风格
console.log('\n🎨 Checking code style...')
const styleResult = await $`bun run lint:fix`.nothrow()

if (styleResult.exitCode !== 0) {
  console.error('\n❌ Code style check failed!')
  allPassed = false
} else {
  console.log('\n✅ Code style is consistent!')
}

// 检查代码安全
console.log('\n🔒 Checking code security...')
const securityResult = await $`bunx npm audit --production`.nothrow()

if (securityResult.exitCode !== 0) {
  console.error('\n❌ Security vulnerabilities detected!')
  console.error('Please run `bunx npm audit fix` to fix vulnerabilities.')
  allPassed = false
} else {
  console.log('\n✅ No security vulnerabilities detected!')
}

// 检查依赖更新
console.log('\n📦 Checking dependency updates...')
const outdatedResult = await $`bunx npm outdated --json`.nothrow()

if (outdatedResult.exitCode !== 0) {
  console.warn('\n⚠️  Some dependencies are outdated!')
  console.warn('Please consider updating dependencies.')
} else {
  console.log('\n✅ All dependencies are up to date!')
}

// 总结
if (allPassed) {
  console.log('\n✅ All code quality checks passed!')
  process.exit(0)
} else {
  console.error('\n❌ Some code quality checks failed!')
  console.error('Please fix the issues before committing.')
  process.exit(1)
}
