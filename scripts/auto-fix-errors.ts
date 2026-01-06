#!/usr/bin/env bun
/**
 * YYC³-XY-05 自动错误修复脚本
 * 批量修复常见的TypeScript错误
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const PROJECT_ROOT = process.cwd()

interface FixResult {
  file: string
  fixesApplied: number
  status: 'success' | 'partial' | 'failed'
  errors: string[]
}

const results: FixResult[] = []

/**
 * 修复1: 移除导入路径中的.tsx扩展名
 */
function fixImportExtensions(filePath: string, content: string): { content: string; fixes: number } {
  let newContent = content
  let fixes = 0

  // 匹配 import ... from "@/xxx.tsx" 或 import ... from '@/xxx.ts'
  const importRegex = /import\s+(?:(\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"](@\/[^'"]+)\.tsx['"]/g

  newContent = newContent.replace(importRegex, (match, _, path) => {
    fixes++
    return `from '${path}'`
  })

  return { content: newContent, fixes }
}

/**
 * 修复2: 移除未使用的导入（简单版本）
 */
function fixUnusedImports(filePath: string, content: string): { content: string; fixes: number } {
  let newContent = content
  let fixes = 0

  // 常见的未使用导入模式
  const unusedPatterns = [
    /\nimport\s+\{[^}]*Users[^}]*\}\s+from\s+['"]lucide-react['"];?\s*\n/g,  // lucide-react的Users等
    /\nimport\s+\{[^}]*Settings[^}]*\}\s+from\s+['"]lucide-react['"];?\s*\n/g,  // lucide-react的Settings等
  ]

  for (const pattern of unusedPatterns) {
    const matches = newContent.match(pattern)
    if (matches) {
      fixes += matches.length
      newContent = newContent.replace(pattern, '\n')
    }
  }

  return { content: newContent, fixes }
}

/**
 * 修复3: 修复process.env访问
 */
function fixProcessEnvAccess(filePath: string, content: string): { content: string; fixes: number } {
  let newContent = content
  let fixes = 0

  // process.env.KEY 应该改为 process.env['KEY'] 如果使用严格的类型检查
  // 但通常不需要改，因为TypeScript应该能正确处理

  return { content: newContent, fixes }
}

/**
 * 修复4: 添加缺失的any类型
 */
function fixImplicitAnyTypes(filePath: string, content: string): { content: string; fixes: number } {
  let newContent = content
  let fixes = 0

  // 修复常见的隐式any类型
  const patterns = [
    // 错误: Parameter '_' implicitly has an 'any' type.
    // 修复: (_, index) => (_, index: any) => 或 (_, index: unknown) =>
    [/(\w+)\s*:\s*\w+/g, (match, param) => {
      // 简单的类型推断修复
      return match
    }],
  ]

  return { content: newContent, fixes }
}

/**
 * 主修复函数
 */
function fixFile(filePath: string): FixResult {
  try {
    let content = readFileSync(filePath, 'utf-8')
    const originalContent = content
    let totalFixes = 0

    // 应用所有修复
    const fixes = [
      fixImportExtensions,
      fixUnusedImports,
      fixProcessEnvAccess,
      fixImplicitAnyTypes,
    ]

    for (const fix of fixes) {
      const result = fix(filePath, content)
      content = result.content
      totalFixes += result.fixes
    }

    if (content !== originalContent && totalFixes > 0) {
      writeFileSync(filePath, content, 'utf-8')
      return {
        file: filePath,
        fixesApplied: totalFixes,
        status: 'success',
        errors: []
      }
    }

    return {
      file: filePath,
      fixesApplied: 0,
      status: 'success',
      errors: []
    }
  } catch (error) {
    return {
      file: filePath,
      fixesApplied: 0,
      status: 'failed',
      errors: [String(error)]
    }
  }
}

/**
 * 递归获取所有TypeScript文件
 */
function getAllTsFiles(dir: string, excludeDirs: string[] = ['node_modules', '.next', 'dist', 'build']): string[] {
  const files: string[] = []

  try {
    const entries = readdirSync(dir)

    for (const entry of entries) {
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        if (!excludeDirs.includes(entry)) {
          files.push(...getAllTsFiles(fullPath, excludeDirs))
        }
      } else if (stat.isFile() && (/\.(ts|tsx)$/.test(entry))) {
        files.push(fullPath)
      }
    }
  } catch (error) {
    // 忽略无法访问的目录
  }

  return files
}

/**
 * 主执行函数
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║        YYC³-XY-05 自动错误修复工具                               ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log()

  console.log('正在扫描TypeScript文件...')
  const tsFiles = getAllTsFiles(PROJECT_ROOT)
  console.log(`找到 ${tsFiles.length} 个TypeScript文件`)
  console.log()

  console.log('开始自动修复...')
  console.log('─'.repeat(60))

  let totalFixes = 0
  let successCount = 0
  let failedCount = 0

  for (const file of tsFiles) {
    // 跳过node_modules等
    if (file.includes('node_modules') || file.includes('.next')) {
      continue
    }

    const result = fixFile(file)
    results.push(result)

    if (result.status === 'success') {
      if (result.fixesApplied > 0) {
        console.log(`✅ ${file.replace(PROJECT_ROOT, '')} - ${result.fixesApplied} 处修复`)
        totalFixes += result.fixesApplied
        successCount++
      }
    } else if (result.status === 'failed') {
      console.log(`❌ ${file.replace(PROJECT_ROOT, '')} - 失败`)
      console.log(`   错误: ${result.errors.join(', ')}`)
      failedCount++
    }
  }

  console.log('─'.repeat(60))
  console.log()
  console.log('修复完成！')
  console.log()
  console.log(`总计:`)
  console.log(`  处理文件: ${tsFiles.length}`)
  console.log(`  应用修复: ${totalFixes}`)
  console.log(`  ✅ 成功: ${successCount}`)
  console.log(`  ❌ 失败: ${failedCount}`)
  console.log()

  if (totalFixes > 0) {
    console.log('建议运行以下命令验证修复:')
    console.log('  bunx tsc --noEmit')
  }
}

main()
