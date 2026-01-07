#!/usr/bin/env node

/**
 * 测试用例生成器
 * 自动为低覆盖率模块生成测试用例
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 开始生成测试用例...\n');

// 1. 生成 lib/utils.ts 的测试用例
console.log('📝 1. 生成 lib/utils.ts 的测试用例...');
generateUtilsTests();

// 2. 生成 lib/character-manager.ts 的测试用例
console.log('📝 2. 生成 lib/character-manager.ts 的测试用例...');
generateCharacterManagerTests();

console.log('\n✅ 测试用例生成完成！');

/**
 * 生成 lib/utils.ts 的测试用例
 */
function generateUtilsTests() {
  const testContent = `/**
 * lib/utils.ts 测试用例
 * 自动生成的测试用例
 */

import {
  formatDate,
  debounce,
  throttle,
  classNames,
  truncate,
  sanitize,
  slugify,
  capitalize,
  isEmail,
  isUrl,
  isValidPhone,
  formatCurrency,
  formatNumber,
  formatDateRelative,
  getAge,
  getAgeGroup,
  uuid,
  randomString,
  sleep,
  retry,
  deepClone,
  deepEqual,
  isEmpty,
  isNotEmpty,
  pick,
  omit,
  merge,
  flatten,
  unflatten,
} from '@/lib/utils';

describe('lib/utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-01-30');
      const formatted = formatDate(date, 'YYYY-MM-DD');
      expect(formatted).toBe('2025-01-30');
    });

    it('should handle null date', () => {
      const formatted = formatDate(null);
      expect(formatted).toBe('');
    });

    it('should handle undefined date', () => {
      const formatted = formatDate(undefined);
      expect(formatted).toBe('');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should clear timeout on cancel', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn.cancel();

      jest.advanceTimersByTime(100);

      expect(mockFn).not.toHaveBeenCalled();
    });

    jest.useRealTimers();
  });

  describe('throttle', () => {
    jest.useFakeTimers();

    it('should throttle function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);

      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    jest.useRealTimers();
  });

  describe('classNames', () => {
    it('should merge class names correctly', () => {
      const result = classNames('class1', 'class2', { class3: true });
      expect(result).toBe('class1 class2 class3');
    });

    it('should exclude falsy values', () => {
      const result = classNames('class1', false, null, undefined, '');
      expect(result).toBe('class1');
    });
  });

  describe('truncate', () => {
    it('should truncate string correctly', () => {
      const result = truncate('Hello World', 5);
      expect(result).toBe('Hello...');
    });

    it('should not truncate short string', () => {
      const result = truncate('Hi', 5);
      expect(result).toBe('Hi');
    });
  });

  describe('sanitize', () => {
    it('should sanitize HTML', () => {
      const result = sanitize('<script>alert("XSS")</script>');
      expect(result).not.toContain('<script>');
    });
  });

  describe('slugify', () => {
    it('should convert string to slug', () => {
      const result = slugify('Hello World!');
      expect(result).toBe('hello-world');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      const result = capitalize('hello');
      expect(result).toBe('Hello');
    });
  });

  describe('isEmail', () => {
    it('should validate email correctly', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('invalid')).toBe(false);
    });
  });

  describe('isUrl', () => {
    it('should validate URL correctly', () => {
      expect(isUrl('https://example.com')).toBe(true);
      expect(isUrl('invalid')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate phone number correctly', () => {
      expect(isValidPhone('13800138000')).toBe(true);
      expect(isValidPhone('invalid')).toBe(false);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      const result = formatCurrency(1000);
      expect(result).toContain('1,000');
    });
  });

  describe('formatNumber', () => {
    it('should format number correctly', () => {
      const result = formatNumber(1000);
      expect(result).toContain('1,000');
    });
  });

  describe('formatDateRelative', () => {
    it('should format date relative to now', () => {
      const result = formatDateRelative(new Date());
      expect(result).toBeTruthy();
    });
  });

  describe('getAge', () => {
    it('should calculate age correctly', () => {
      const now = new Date();
      const birthDate = new Date(now.getFullYear() - 20, 0, 1);
      const age = getAge(birthDate);
      expect(age).toBe(20);
    });
  });

  describe('getAgeGroup', () => {
    it('should return correct age group', () => {
      expect(getAgeGroup(5)).toBe('学龄前');
      expect(getAgeGroup(10)).toBe('小学');
      expect(getAgeGroup(15)).toBe('初中');
    });
  });

  describe('uuid', () => {
    it('should generate valid UUID', () => {
      const id = uuid();
      expect(id).toMatch(/^[0-9a-f-]{36}$/i);
    });
  });

  describe('randomString', () => {
    it('should generate random string', () => {
      const str = randomString(10);
      expect(str).toHaveLength(10);
    });
  });

  describe('sleep', async () => {
    it('should sleep for specified time', async () => {
      const start = Date.now();
      await sleep(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(100);
    });
  });

  describe('retry', async () => {
    it('should retry function on failure', async () => {
      let attempts = 0;
      const mockFn = jest.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Failed');
        }
        return 'Success';
      });

      const result = await retry(mockFn, { maxAttempts: 3 });
      expect(result).toBe('Success');
      expect(mockFn).toHaveBeenCalledTimes(3);
    });
  });

  describe('deepClone', () => {
    it('should deep clone object', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
    });
  });

  describe('deepEqual', () => {
    it('should check deep equality', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { a: 1, b: { c: 2 } };
      expect(deepEqual(obj1, obj2)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('should check if value is empty', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
      expect(isEmpty('hello')).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    it('should check if value is not empty', () => {
      expect(isNotEmpty('hello')).toBe(true);
      expect(isNotEmpty('')).toBe(false);
    });
  });

  describe('pick', () => {
    it('should pick specified properties', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = pick(obj, ['a', 'b']);
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('omit', () => {
    it('should omit specified properties', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omit(obj, ['c']);
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('merge', () => {
    it('should merge objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const result = merge(obj1, obj2);
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('flatten', () => {
    it('should flatten object', () => {
      const obj = { a: { b: { c: 1 } } };
      const result = flatten(obj);
      expect(result).toEqual({ 'a.b.c': 1 });
    });
  });

  describe('unflatten', () => {
    it('should unflatten object', () => {
      const obj = { 'a.b.c': 1 };
      const result = unflatten(obj);
      expect(result).toEqual({ a: { b: { c: 1 } } });
    });
  });
});
`;

  const testPath = path.join(__dirname, '../__tests__/lib/utils.test.ts');
  ensureDirectoryExists(testPath);
  fs.writeFileSync(testPath, testContent);
  console.log(`  ✅ 生成: ${testPath}`);
}

/**
 * 生成 lib/character-manager.ts 的测试用例
 */
function generateCharacterManagerTests() {
  const testContent = `/**
 * lib/character-manager.ts 测试用例
 * 自动生成的测试用例
 */

import { CharacterManager } from '@/lib/character-manager';

describe('lib/character-manager', () => {
  let characterManager: CharacterManager;

  beforeEach(() => {
    characterManager = new CharacterManager();
  });

  describe('初始化', () => {
    it('应该成功初始化角色管理器', () => {
      expect(characterManager).toBeInstanceOf(CharacterManager);
    });

    it('应该加载默认角色配置', () => {
      const config = characterManager.getConfig();
      expect(config).toBeDefined();
    });
  });

  describe('角色管理', () => {
    it('应该能够创建新角色', () => {
      const character = characterManager.createCharacter({
        name: '测试角色',
        gender: 'female',
        age: 3,
      });
      expect(character).toBeDefined();
      expect(character.name).toBe('测试角色');
    });

    it('应该能够更新角色信息', () => {
      const character = characterManager.createCharacter({
        name: '测试角色',
        gender: 'female',
        age: 3,
      });

      const updated = characterManager.updateCharacter(character.id, {
        name: '更新后的角色',
      });

      expect(updated.name).toBe('更新后的角色');
    });

    it('应该能够删除角色', () => {
      const character = characterManager.createCharacter({
        name: '测试角色',
        gender: 'female',
        age: 3,
      });

      characterManager.deleteCharacter(character.id);

      const retrieved = characterManager.getCharacter(character.id);
      expect(retrieved).toBeNull();
    });

    it('应该能够获取角色列表', () => {
      characterManager.createCharacter({
        name: '角色1',
        gender: 'female',
        age: 3,
      });

      characterManager.createCharacter({
        name: '角色2',
        gender: 'male',
        age: 4,
      });

      const characters = characterManager.listCharacters();
      expect(characters).toHaveLength(2);
    });

    it('应该能够通过ID获取角色', () => {
      const character = characterManager.createCharacter({
        name: '测试角色',
        gender: 'female',
        age: 3,
      });

      const retrieved = characterManager.getCharacter(character.id);
      expect(retrieved).toEqual(character);
    });
  });

  describe('表情管理', () => {
    it('应该能够设置角色表情', () => {
      const character = characterManager.createCharacter({
        name: '测试角色',
        gender: 'female',
        age: 3,
      });

      characterManager.setExpression(character.id, 'happy');

      const updated = characterManager.getCharacter(character.id);
      expect(updated.expression).toBe('happy');
    });

    it('应该能够获取角色表情', () => {
      const character = characterManager.createCharacter({
        name: '测试角色',
        gender: 'female',
        age: 3,
      });

      characterManager.setExpression(character.id, 'happy');

      const expression = characterManager.getExpression(character.id);
      expect(expression).toBe('happy');
    });
  });

  describe('主题管理', () => {
    it('应该能够设置角色主题', () => {
      const character = characterManager.createCharacter({
        name: '测试角色',
        gender: 'female',
        age: 3,
      });

      characterManager.setTheme(character.id, 'pink');

      const updated = characterManager.getCharacter(character.id);
      expect(updated.theme).toBe('pink');
    });

    it('应该能够获取角色主题', () => {
      const character = characterManager.createCharacter({
        name: '测试角色',
        gender: 'female',
        age: 3,
      });

      characterManager.setTheme(character.id, 'pink');

      const theme = characterManager.getTheme(character.id);
      expect(theme).toBe('pink');
    });
  });

  describe('成长阶段管理', () => {
    it('应该能够计算成长阶段', () => {
      const character = characterManager.createCharacter({
        name: '测试角色',
        gender: 'female',
        age: 3,
      });

      const stage = characterManager.getGrowthStage(character.id);
      expect(stage).toBeDefined();
      expect(stage).toBe('学龄前');
    });

    it('应该能够更新成长阶段', () => {
      const character = characterManager.createCharacter({
        name: '测试角色',
        gender: 'female',
        age: 3,
      });

      characterManager.updateAge(character.id, 6);

      const stage = characterManager.getGrowthStage(character.id);
      expect(stage).toBe('小学');
    });
  });

  describe('错误处理', () => {
    it('应该处理无效的角色ID', () => {
      const retrieved = characterManager.getCharacter('invalid-id');
      expect(retrieved).toBeNull();
    });

    it('应该处理创建角色时的无效数据', () => {
      expect(() => {
        characterManager.createCharacter({
          name: '',
          gender: 'invalid',
          age: -1,
        });
      }).toThrow();
    });

    it('应该处理更新角色时的无效数据', () => {
      const character = characterManager.createCharacter({
        name: '测试角色',
        gender: 'female',
        age: 3,
      });

      expect(() => {
        characterManager.updateCharacter(character.id, {
          age: -1,
        });
      }).toThrow();
    });
  });

  describe('数据持久化', () => {
    it('应该能够保存角色数据', () => {
      const character = characterManager.createCharacter({
        name: '测试角色',
        gender: 'female',
        age: 3,
      });

      characterManager.save();

      const newManager = new CharacterManager();
      const retrieved = newManager.getCharacter(character.id);
      expect(retrieved).toEqual(character);
    });

    it('应该能够加载角色数据', () => {
      characterManager.load();

      const characters = characterManager.listCharacters();
      expect(characters).toBeDefined();
    });
  });
});
`;

  const testPath = path.join(
    __dirname,
    '../__tests__/lib/character-manager.test.ts'
  );
  ensureDirectoryExists(testPath);
  fs.writeFileSync(testPath, testContent);
  console.log(`  ✅ 生成: ${testPath}`);
}

/**
 * 确保目录存在
 */
function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
