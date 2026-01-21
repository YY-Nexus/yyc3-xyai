#!/usr/bin/env bun
/**
 * Winston 日志系统整合脚本
 *
 * 本脚本用于将所有 console 调用替换为 logger 调用
 * @author YYC³
 * @version 2.0.0
 * @created 2026-01-19
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import pkg from 'glob';
const { glob } = pkg;
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const stats = {
  totalFiles: 0,
  modifiedFiles: 0,
  consoleLog: 0,
  consoleError: 0,
  consoleWarn: 0,
  consoleInfo: 0,
  consoleDebug: 0,
};

function replaceConsoleCalls(content: string, filepath: string): string | null {
  let modified = false;
  let newContent = content;

  const hasLoggerImport = /import.*logger.*from.*['"].*logger['"]/.test(content);

  if (
    !hasLoggerImport &&
    (content.includes('console.log') ||
      content.includes('console.error') ||
      content.includes('console.warn') ||
      content.includes('console.info') ||
      content.includes('console.debug'))
  ) {
    const importRegex = /^(import\s+.*from\s+['"][^'"]+['"].*;?)$/gm;
    const imports = content.match(importRegex);

    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const insertPosition =
        content.lastIndexOf(lastImport) + lastImport.length;

      const relativePath = getRelativePath(filepath);

      newContent =
        newContent.slice(0, insertPosition) +
        `\nimport { error, warn, info, debug } from '${relativePath}';` +
        newContent.slice(insertPosition);
      modified = true;
    }
  }

  newContent = newContent.replace(/console\.log\(([^)]+)\)/g, (match, args) => {
    stats.consoleLog++;
    modified = true;
    return `info(${args})`;
  });

  newContent = newContent.replace(
    /console\.error\(([^)]+)\)/g,
    (match, args) => {
      stats.consoleError++;
      modified = true;
      return `error(${args})`;
    }
  );

  newContent = newContent.replace(
    /console\.warn\(([^)]+)\)/g,
    (match, args) => {
      stats.consoleWarn++;
      modified = true;
      return `warn(${args})`;
    }
  );

  newContent = newContent.replace(
    /console\.info\(([^)]+)\)/g,
    (match, args) => {
      stats.consoleInfo++;
      modified = true;
      return `info(${args})`;
    }
  );

  newContent = newContent.replace(
    /console\.debug\(([^)]+)\)/g,
    (match, args) => {
      stats.consoleDebug++;
      modified = true;
      return `debug(${args})`;
    }
  );

  return modified ? newContent : null;
}

function getRelativePath(filepath: string): string {
  const projectRoot = '/Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-ai';
  const absFilepath = filepath;

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
    return 'yyc3-xy-ai/lib/logger';
  }
}

async function main() {
  console.log('🚀 开始替换 console 调用为 logger 调用...\n');

  const globResult = await glob('**/*.{ts,tsx}', {
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
    nodir: true,
  });

  const files = Array.isArray(globResult) ? globResult : [];

  stats.totalFiles = files.length;

  console.log(`📁 找到 ${files.length} 个文件\n`);

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

main().catch(console.error);
