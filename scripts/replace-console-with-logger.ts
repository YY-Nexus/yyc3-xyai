#!/usr/bin/env bun
/**
 * Winston 日志系统整合脚本
 *
 * 本脚本用于将所有 console 调用替换为 logger 调用
 */

import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 统计
let stats = {
  totalFiles: 0,
  modifiedFiles: 0,
  consoleLog: 0,
  consoleError: 0,
  consoleWarn: 0,
  consoleInfo: 0,
  consoleDebug: 0,
};

/**
 * 替换 console 调用为 logger 调用
 */
function replaceConsoleCalls(content: string, filepath: string): string {
  let modified = false;
  let newContent = content;

  // 检查是否已经导入了 logger
  const hasLoggerImport = /import.*logger.*from.*['"].*logger['"]/.test(
    content
  );

  // 如果没有导入 logger，添加导入语句
  if (
    !hasLoggerImport &&
    (content.includes('console.log') ||
      content.includes('console.error') ||
      content.includes('console.warn') ||
      content.includes('console.info') ||
      content.includes('console.debug'))
  ) {
    // 找到第一个 import 语句
    const importRegex = /^(import\s+.*(?:from\s+['"].*['"]\s*;?)$/gm;
    const imports = content.match(importRegex);

    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const insertPosition =
        content.lastIndexOf(lastImport) + lastImport.length;

      // 计算相对路径
      const relativePath = getRelativePath(filepath);

      newContent =
        newContent.slice(0, insertPosition) +
        `\nimport { log as logger } from '${relativePath}';` +
        newContent.slice(insertPosition);
      modified = true;
    }
  }

  // 替换 console.log
  newContent = newContent.replace(/console\.log\(([^)]+)\)/g, (match, args) => {
    stats.consoleLog++;
    modified = true;
    return `logger.info(${args})`;
  });

  // 替换 console.error
  newContent = newContent.replace(
    /console\.error\(([^)]+)\)/g,
    (match, args) => {
      stats.consoleError++;
      modified = true;
      return `logger.error(${args})`;
    }
  );

  // 替换 console.warn
  newContent = newContent.replace(
    /console\.warn\(([^)]+)\)/g,
    (match, args) => {
      stats.consoleWarn++;
      modified = true;
      return `logger.warn(${args})`;
    }
  );

  // 替换 console.info
  newContent = newContent.replace(
    /console\.info\(([^)]+)\)/g,
    (match, args) => {
      stats.consoleInfo++;
      modified = true;
      return `logger.info(${args})`;
    }
  );

  // 替换 console.debug
  newContent = newContent.replace(
    /console\.debug\(([^)]+)\)/g,
    (match, args) => {
      stats.consoleDebug++;
      modified = true;
      return `logger.debug(${args})`;
    }
  );

  return modified ? newContent : null;
}

/**
 * 计算相对路径
 */
function getRelativePath(filepath: string): string {
  // 计算从文件到 lib/logger.ts 的相对路径
  const projectRoot = '/Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-ai';
  const absFilepath = filepath;

  // 如果文件在项目根目录或 lib/ 目录下
  if (absFilepath.startsWith(join(projectRoot, 'lib'))) {
    return './logger';
  } else if (absFilepath.startsWith(join(projectRoot, 'hooks'))) {
    return '../lib/logger';
  } else if (absFilepath.startsWith(join(projectRoot, 'components'))) {
    return '../lib/logger';
  } else if (absFilepath.startsWith(join(projectRoot, 'services'))) {
    return '../lib/logger';
  } else if (absFilepath.startsWith(join(projectRoot, 'app'))) {
    return '../lib/logger';
  } else if (absFilepath.startsWith(join(projectRoot, 'types'))) {
    return '../lib/logger';
  } else if (absFilepath.startsWith(join(projectRoot, 'store'))) {
    return '../lib/logger';
  } else if (absFilepath.startsWith(join(projectRoot, 'src'))) {
    return '../lib/logger';
  } else if (absFilepath.startsWith(join(projectRoot, 'backend'))) {
    return '../lib/logger';
  } else {
    // 默认使用绝对路径
    return 'yyc3-xy-ai/lib/logger';
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始替换 console 调用为 logger 调用...\n');

  // 搜索所有 .ts 和 .tsx 文件
  const files = await glob('**/*.{ts,tsx}', {
    cwd: '/Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-ai',
    ignore: [
      '**/node_modules/**',
      '**/.next/**',
      '**/from-xy*/**',
      '**/dist/**',
      '**/build/**',
      '**/out/**',
      '**/logs/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
    ],
  });

  stats.totalFiles = files.length;

  console.log(`📁 找到 ${files.length} 个文件\n`);

  // 处理每个文件
  for (const file of files) {
    const filepath = join('/Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-ai', file);

    try {
      const content = await readFile(filepath, 'utf-8');
      const newContent = replaceConsoleCalls(content, filepath);

      if (newContent) {
        await writeFile(filepath, newContent, 'utf-8');
        stats.modifiedFiles++;
        console.log(`✅ 已修改: ${file}`);
      }
    } catch (error) {
      console.error(`❌ 处理失败: ${file}`, error);
    }
  }

  // 输出统计结果
  console.log('\n' + '='.repeat(50));
  console.log('📊 替换统计:');
  console.log('='.repeat(50));
  console.log(`📁 总文件数: ${stats.totalFiles}`);
  console.log(`📝 修改文件数: ${stats.modifiedFiles}`);
  console.log(`📋 console.log: ${stats.consoleLog}`);
  console.log(`📋 console.error: ${stats.consoleError}`);
  console.log(`📋 console.warn: ${stats.consoleWarn}`);
  console.log(`📋 console.info: ${stats.consoleInfo}`);
  console.log(`📋 console.debug: ${stats.consoleDebug}`);
  console.log(
    `📊 总计替换: ${stats.consoleLog + stats.consoleError + stats.consoleWarn + stats.consoleInfo + stats.consoleDebug}`
  );
  console.log('='.repeat(50));
  console.log('\n✅ 替换完成！');
}

// 运行主函数
main().catch(console.error);
