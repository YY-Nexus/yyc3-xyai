#!/usr/bin/env bun

/**
 * 代码质量监控脚本
 *
 * 本脚本用于监控代码质量并自动阻止低质量代码提交
 */

import { $ } from 'bun'

console.log('🔍 Monitoring code quality...')

let allPassed = true

// 1. 检查测试覆盖率
console.log('\n📊 Checking test coverage...')
const coverageThreshold = 80

// 运行测试覆盖率
const coverageResult = await $`bun test --coverage`.nothrow()

if (coverageResult.exitCode !== 0) {
  console.error('\n❌ Tests failed!')
  allPassed = false
} else {
  // 读取覆盖率报告
  try {
    const coverageReport = await Bun.file('coverage/lcov.info').text()
    const lines = coverageReport.split('\n').filter(line => line.includes('LF:') || line.includes('LH:'))

    if (lines.length > 0) {
      const totalLines = lines.reduce((sum, line) => {
        const match = line.match(/LF:(\d+)/)
        return sum + (match ? parseInt(match[1]) : 0)
      }, 0)

      const coveredLines = lines.reduce((sum, line) => {
        const match = line.match(/LH:(\d+)/)
        return sum + (match ? parseInt(match[1]) : 0)
      }, 0)

      const coverage = (coveredLines / totalLines) * 100

      console.log(`\n✅ Test coverage: ${coverage.toFixed(2)}%`)

      if (coverage < coverageThreshold) {
        console.error(`\n❌ Test coverage is below threshold (${coverageThreshold}%)!`)
        allPassed = false
      }
    }
  } catch (error) {
    console.warn('\n⚠️  Could not read coverage report')
  }
}

// 2. 检查代码复杂度
console.log('\n📊 Checking code complexity...')
const maxComplexity = 20

// 使用 complexity-report 检查代码复杂度
const complexityResult = await $`bunx complexity-report lib --format json --max-complexity ${maxComplexity}`.nothrow()

if (complexityResult.exitCode !== 0) {
  console.error('\n❌ Code complexity is too high!')
  console.error('Please consider refactoring complex functions.')
  allPassed = false
} else {
  console.log('\n✅ Code complexity is acceptable!')
}

// 3. 检查代码重复
console.log('\n📋 Checking code duplication...')
const maxDuplication = 5 // 百分比

// 使用 jscpd 检查代码重复
const duplicationResult = await $`bunx jscpd --min-tokens 50 --threshold ${maxDuplication} .`.nothrow()

if (duplicationResult.exitCode !== 0) {
  console.error('\n❌ Code duplication is too high!')
  console.error('Please consider refactoring duplicated code.')
  allPassed = false
} else {
  console.log('\n✅ Code duplication is acceptable!')
}

// 4. 检查代码风格
console.log('\n🎨 Checking code style...')
const styleThreshold = 90 // 百分比

// 运行 ESLint
const lintResult = await $`bun run lint --format=json > eslint-report.json`.nothrow()

if (lintResult.exitCode !== 0) {
  console.error('\n❌ Code style check failed!')
  allPassed = false
} else {
  // 读取 ESLint 报告
  try {
    const eslintReport = await Bun.file('eslint-report.json').json() as any[]
    const totalFiles = eslintReport.length
    const passedFiles = eslintReport.filter((report: any) => report.errorCount === 0 && report.warningCount === 0).length
    const styleScore = (passedFiles / totalFiles) * 100

    console.log(`\n✅ Code style score: ${styleScore.toFixed(2)}%`)

    if (styleScore < styleThreshold) {
      console.error(`\n❌ Code style score is below threshold (${styleThreshold}%)!`)
      allPassed = false
    }
  } catch (error) {
    console.warn('\n⚠️  Could not read ESLint report')
  }
}

// 5. 检查代码安全
console.log('\n🔒 Checking code security...')

// 运行 npm audit
const auditResult = await $`bunx npm audit --production --audit-level=moderate`.nothrow()

if (auditResult.exitCode !== 0) {
  console.error('\n❌ Security vulnerabilities detected!')
  console.error('Please run `bunx npm audit fix` to fix vulnerabilities.')
  allPassed = false
} else {
  console.log('\n✅ No security vulnerabilities detected!')
}

// 6. 检查类型安全
console.log('\n🔧 Checking type safety...')

// 运行类型检查
const typeCheckResult = await $`bun run type-check`.nothrow()

if (typeCheckResult.exitCode !== 0) {
  console.error('\n❌ Type check failed!')
  allPassed = false
} else {
  console.log('\n✅ Type check passed!')
}

// 7. 检查依赖更新
console.log('\n📦 Checking dependency updates...')

// 检查过时的依赖
const outdatedResult = await $`bunx npm outdated --json`.nothrow()

if (outdatedResult.exitCode !== 0) {
  console.warn('\n⚠️  Some dependencies are outdated!')
  console.warn('Please consider updating dependencies.')
  // 不阻止提交
} else {
  console.log('\n✅ All dependencies are up to date!')
}

// 8. 检查代码质量评分
console.log('\n📊 Calculating code quality score...')

// 计算代码质量评分
const qualityScore = allPassed ? 100 : 0

console.log(`\n📊 Code quality score: ${qualityScore}/100`)

// 总结
if (allPassed) {
  console.log('\n✅ All code quality checks passed!')
  console.log('🎉 Your code is ready to be committed!')
  process.exit(0)
} else {
  console.error('\n❌ Some code quality checks failed!')
  console.error('🚫 Please fix the issues before committing.')
  console.error('📚 Run `bun run code-quality` for more details.')
  process.exit(1)
}
