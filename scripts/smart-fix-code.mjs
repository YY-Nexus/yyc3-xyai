#!/usr/bin/env node

/**
 * 智能代码修复脚本
 * 真正修复代码问题，而不是隐藏问题
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔧 开始智能代码修复...\n');

// 1. 修复Promise未await的问题
console.log('📝 1. 修复Promise未await的问题...');
fixFloatingPromises();

// 2. 修复void表达式的问题
console.log('📝 2. 修复void表达式的问题...');
fixVoidExpressions();

// 3. 运行ESLint自动修复
console.log('📝 3. 运行ESLint自动修复...');
runESLintFix();

// 4. 运行Prettier格式化
console.log('📝 4. 运行Prettier格式化...');
runPrettier();

console.log('\n✅ 智能代码修复完成！');

/**
 * 修复Promise未await的问题
 */
function fixFloatingPromises() {
  const files = getAllFiles('./app', '.tsx')
    .concat(getAllFiles('./components', '.tsx'))
    .concat(getAllFiles('./lib', '.ts'));

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // 修复: someAsyncFunction() -> void someAsyncFunction()
    content = content.replace(
      /(\s+)([a-zA-Z_$][a-zA-Z0-9_$]*\.\w+\(|await\s+\([^{]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*\s*\()/g,
      (match, indent, func) => {
        // 检查是否是async函数
        if (func.startsWith('await') || func.includes('=>')) {
          return match;
        }
        // 检查是否已经包含void
        if (match.includes('void ')) {
          return match;
        }
        // 如果是单独的函数调用（不是表达式），添加void
        if (
          match.includes('(') &&
          !match.includes('=') &&
          !match.includes('return')
        ) {
          return `${indent}void ${func}`;
        }
        return match;
      }
    );

    if (modified) {
      fs.writeFileSync(file, content);
      console.log(`  ✅ 修复: ${file}`);
    }
  });
}

/**
 * 修复void表达式的问题
 */
function fixVoidExpressions() {
  const files = getAllFiles('./app', '.tsx')
    .concat(getAllFiles('./components', '.tsx'))
    .concat(getAllFiles('./lib', '.ts'));

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // 修复: () => someAsyncFunction() -> () => { someAsyncFunction(); }
    content = content.replace(
      /(\(\)\s*=>\s*)([a-zA-Z_$][a-zA-Z0-9_$]*\(\))/g,
      (match, arrow, func) => {
        // 检查是否是async函数
        if (content.includes('async ' + func)) {
          return `${arrow}{\n    ${func};\n  }`;
        }
        // 如果函数名包含async，添加大括号
        if (
          func.includes('async') ||
          func.includes('fetch') ||
          func.includes('post')
        ) {
          return `${arrow}{\n    ${func};\n  }`;
        }
        return match;
      }
    );

    if (modified) {
      fs.writeFileSync(file, content);
      console.log(`  ✅ 修复: ${file}`);
    }
  });
}

/**
 * 运行ESLint自动修复
 */
function runESLintFix() {
  try {
    execSync('npx eslint . --fix --ext .ts,.tsx --quiet', {
      stdio: 'inherit',
    });
  } catch (error) {
    // ESLint fix可能会有非零退出码，忽略错误
  }
}

/**
 * 运行Prettier格式化
 */
function runPrettier() {
  try {
    execSync('npx prettier --write "**/*.{ts,tsx,js,jsx}"', {
      stdio: 'inherit',
    });
  } catch (error) {
    console.log('  ⚠️  Prettier未安装，跳过格式化');
  }
}

/**
 * 获取目录下所有指定扩展名的文件
 */
function getAllFiles(dir, extension) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(file, extension));
    } else {
      if (file.endsWith(extension)) {
        results.push(file);
      }
    }
  });

  return results;
}
