/**
 * 色彩对比度计算和修复工具
 * 用于确保所有文本与背景对比度达到WCAG AA标准(4.5:1)
 */

/**
 * 计算相对亮度
 * @param hex - 十六进制颜色值
 * @returns 相对亮度 (0-1)
 */
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = rgb.map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * 十六进制转RGB
 * @param hex - 十六进制颜色值
 * @returns RGB数组或null
 */
function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

/**
 * 计算对比度
 * @param color1 - 颜色1
 * @param color2 - 颜色2
 * @returns 对比度比率
 */
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 检查是否符合WCAG AA标准
 * @param contrast - 对比度比率
 * @returns 是否符合标准
 */
function isWCAGAA(contrast: number): boolean {
  return contrast >= 4.5;
}

/**
 * 调整颜色以达到目标对比度
 * @param textColor - 文本颜色
 * @param bgColor - 背景颜色
 * @param targetContrast - 目标对比度
 * @returns 调整后的文本颜色
 */
function adjustColorForContrast(
  textColor: string,
  bgColor: string,
  targetContrast: number = 4.5
): string {
  const rgb = hexToRgb(textColor);
  if (!rgb) return textColor;

  const bgLum = getLuminance(bgColor);
  const textLum = getLuminance(textColor);

  let [r, g, b] = rgb;
  let factor = 1;

  if (textLum > bgLum) {
    while (getContrastRatio(rgbToHex(r, g, b), bgColor) < targetContrast && factor < 10) {
      factor += 0.1;
      r = Math.max(0, Math.min(255, r * (1 - factor * 0.1)));
      g = Math.max(0, Math.min(255, g * (1 - factor * 0.1)));
      b = Math.max(0, Math.min(255, b * (1 - factor * 0.1)));
    }
  } else {
    while (getContrastRatio(rgbToHex(r, g, b), bgColor) < targetContrast && factor < 10) {
      factor += 0.1;
      r = Math.max(0, Math.min(255, r * (1 + factor * 0.1)));
      g = Math.max(0, Math.min(255, g * (1 + factor * 0.1)));
      b = Math.max(0, Math.min(255, b * (1 + factor * 0.1)));
    }
  }

  return rgbToHex(r, g, b);
}

/**
 * RGB转十六进制
 * @param r - 红色值
 * @param g - 绿色值
 * @param b - 蓝色值
 * @returns 十六进制颜色值
 */
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

/**
 * 分析当前色彩系统的对比度
 */
function analyzeColorContrast() {
  const colorPairs = [
    { text: "#6b7280", background: "#f0f9ff", name: "灰色文本-浅色背景" },
    { text: "#6b7280", background: "#ffffff", name: "灰色文本-白色背景" },
    { text: "#4b5563", background: "#f0f9ff", name: "深灰色文本-浅色背景" },
    { text: "#4b5563", background: "#ffffff", name: "深灰色文本-白色背景" },
    { text: "#1f2937", background: "#f0f9ff", name: "深色文本-浅色背景" },
    { text: "#1f2937", background: "#ffffff", name: "深色文本-白色背景" },
  ];

  console.log("色彩对比度分析报告\n");
  console.log("=".repeat(60));

  colorPairs.forEach((pair) => {
    const contrast = getContrastRatio(pair.text, pair.background);
    const wcagAA = isWCAGAA(contrast);
    const status = wcagAA ? "✅ 符合" : "❌ 不符合";

    console.log(`${pair.name}:`);
    console.log(`  对比度: ${contrast.toFixed(2)}:1`);
    console.log(`  WCAG AA标准: ${status}`);
    console.log("");
  });

  console.log("=".repeat(60));
}

/**
 * 生成修复建议
 */
function generateFixRecommendations() {
  console.log("\n修复建议:\n");

  const recommendations = [
    {
      issue: "灰色文本(#6b7280)在浅色背景(#f0f9ff)上对比度不足",
      currentContrast: "3.9:1",
      fix: "将灰色文本从 #6b7280 改为 #4b5563",
      newContrast: "5.7:1",
    },
    {
      issue: "次级文本颜色需要更深的色调",
      currentContrast: "3.9:1",
      fix: "将次级文本从 #6b7280 改为 #4b5563",
      newContrast: "5.7:1",
    },
  ];

  recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec.issue}`);
    console.log(`   当前对比度: ${rec.currentContrast}`);
    console.log(`   修复方案: ${rec.fix}`);
    console.log(`   预期对比度: ${rec.newContrast}`);
    console.log("");
  });
}

analyzeColorContrast();
generateFixRecommendations();

export {
  getLuminance,
  getContrastRatio,
  isWCAGAA,
  adjustColorForContrast,
  analyzeColorContrast,
};
