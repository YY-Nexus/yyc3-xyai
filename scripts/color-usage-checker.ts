/**
 * 色彩使用检查工具
 * 用于识别和替换硬编码颜色为CSS变量
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * 硬编码颜色模式
 */
const HARDCODED_COLOR_PATTERNS = [
  // 十六进制颜色
  /#[0-9a-fA-F]{3,8}/g,
  // RGB颜色
  /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g,
  // RGBA颜色
  /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g,
  // HSL颜色
  /hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)/g,
  // HSLA颜色
  /hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)/g,
];

/**
 * 排除的文件模式
 */
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.next/,
  /dist/,
  /build/,
  /coverage/,
  /\.git/,
  /package-lock\.json/,
  /yarn\.lock/,
  /pnpm-lock\.yaml/,
  /tsconfig\.json/,
  /\.md$/,
  /\.txt$/,
  /\.json$/,
  /\.svg$/,
];

/**
 * CSS变量映射表
 */
const CSS_VARIABLE_MAP: Record<string, string> = {
  // 主色
  '#3b82f6': 'var(--color-primary)',
  '#2563eb': 'var(--color-primary-dark)',
  '#60a5fa': 'var(--color-primary-light)',

  // 辅助色
  '#8b5cf6': 'var(--color-secondary-purple)',
  '#ec4899': 'var(--color-secondary-pink)',

  // 功能色
  '#10b981': 'var(--color-success)',
  '#f59e0b': 'var(--color-warning)',
  '#ef4444': 'var(--color-error)',

  // 中性色
  '#ffffff': 'var(--color-white)',
  '#f9fafb': 'var(--color-gray-100)',
  '#f3f4f6': 'var(--color-gray-200)',
  '#e5e7eb': 'var(--color-gray-300)',
  '#d1d5db': 'var(--color-gray-400)',
  '#9ca3af': 'var(--color-gray-500)',
  '#6b7280': 'var(--color-gray-600)',
  '#4b5563': 'var(--color-gray-700)',
  '#374151': 'var(--color-gray-800)',
  '#1f2937': 'var(--color-gray-900)',
  '#111827': 'var(--color-gray-950)',

  // 背景色
  '#f0f9ff': 'var(--color-background)',
  '#f8fafc': 'var(--color-component)',
  '#f1f5f9': 'var(--color-hover)',
  '#e0f2fe': 'var(--color-selected)',

  // 文本色
  '#1f2937': 'var(--color-foreground)',
  '#4b5563': 'var(--color-muted-foreground)',
  '#374151': 'var(--color-secondary-foreground)',

  // 边框色
  '#e5e7eb': 'var(--color-border)',
};

/**
 * 检查文件是否应该被排除
 */
function shouldExclude(filePath: string): boolean {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
}

/**
 * 递归获取目录中的所有文件
 */
function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (!shouldExclude(filePath)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * 检查文件中的硬编码颜色
 */
function checkFileForHardcodedColors(filePath: string): {
  filePath: string;
  colors: { color: string; line: number; column: number }[];
} {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const colors: { color: string; line: number; column: number }[] = [];

    lines.forEach((line, lineIndex) => {
      HARDCODED_COLOR_PATTERNS.forEach(pattern => {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const color = match[0];

          // 排除注释中的颜色
          const beforeMatch = line.substring(0, match.index);
          if (beforeMatch.includes('//') || beforeMatch.includes('/*')) {
            continue;
          }

          colors.push({
            color,
            line: lineIndex + 1,
            column: match.index + 1,
          });
        }
      });
    });

    return { filePath, colors };
  } catch (error) {
    return { filePath, colors: [] };
  }
}

/**
 * 获取颜色替换建议
 */
function getColorReplacement(color: string): string | null {
  return CSS_VARIABLE_MAP[color.toLowerCase()] || null;
}

/**
 * 生成色彩使用报告
 */
function generateColorUsageReport(projectRoot: string) {
  console.log('色彩使用检查报告\n');
  console.log('='.repeat(80));

  const files = getAllFiles(projectRoot);
  const results: {
    filePath: string;
    colors: { color: string; line: number; column: number; replacement?: string }[];
  }[] = [];

  let totalHardcodedColors = 0;
  let totalReplacableColors = 0;

  files.forEach(filePath => {
    const { colors } = checkFileForHardcodedColors(filePath);

    if (colors.length > 0) {
      const colorsWithReplacement = colors.map(c => ({
        ...c,
        replacement: getColorReplacement(c.color),
      }));

      results.push({
        filePath,
        colors: colorsWithReplacement,
      });

      totalHardcodedColors += colors.length;
      totalReplacableColors += colorsWithReplacement.filter(c => c.replacement).length;
    }
  });

  console.log(`\n扫描文件数: ${files.length}`);
  console.log(`发现硬编码颜色文件数: ${results.length}`);
  console.log(`硬编码颜色总数: ${totalHardcodedColors}`);
  console.log(`可替换颜色数: ${totalReplacableColors}`);
  console.log(`替换率: ${((totalReplacableColors / totalHardcodedColors) * 100).toFixed(1)}%`);

  console.log('\n' + '='.repeat(80));
  console.log('\n详细结果:\n');

  results.forEach(({ filePath, colors }) => {
    const replacableColors = colors.filter(c => c.replacement);
    if (replacableColors.length > 0) {
      console.log(`\n文件: ${filePath}`);
      console.log(`可替换颜色数: ${replacableColors.length}/${colors.length}`);

      replacableColors.forEach(({ color, line, column, replacement }) => {
        console.log(`  行 ${line}, 列 ${column}: ${color} → ${replacement}`);
      });
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n修复建议:\n');

  console.log('1. 优先替换高频使用的硬编码颜色');
  console.log('2. 对于没有对应CSS变量的颜色，考虑添加到设计系统中');
  console.log('3. 建立代码审查规则，禁止新的硬编码颜色');
  console.log('4. 使用ESLint规则自动检测硬编码颜色');

  console.log('\n' + '='.repeat(80));
}

if (process.argv.length < 3) {
  console.error('Usage: npx tsx scripts/color-usage-checker.ts <project-root>');
  process.exit(1);
}

const projectRoot = process.argv[2];
generateColorUsageReport(projectRoot);
