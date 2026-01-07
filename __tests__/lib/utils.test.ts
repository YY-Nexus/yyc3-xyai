/**
 * lib/utils.ts 测试用例
 * 自动生成的测试用例
 */

import {
  formatDate,
  debounce,
  throttle,
  cn,
  sleep,
  generateId,
  chunk,
  groupBy,
  unique,
  uniqueBy,
  pick,
  omit,
  deepClone,
  deepEqual,
  isEmpty,
  isNotEmpty,
  formatFileSize,
  formatNumber,
  formatPercentage,
  clamp,
  randomInt,
  randomFloat,
  roundTo,
  safeDivide,
  getNestedValue,
  setNestedValue,
  retry,
  asyncMap,
  memoize,
  once,
  pipe,
  compose,
  curry,
  partial,
} from '@/lib/utils';

describe('lib/utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-01-30');
      const formatted = formatDate(date, 'YYYY-MM-DD');
      expect(formatted).toBe('2025-01-30');
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      await new Promise(resolve => setTimeout(resolve, 150));

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);

      await new Promise(resolve => setTimeout(resolve, 150));

      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should exclude falsy values', () => {
      const result = cn('class1', false, null, undefined, '');
      expect(result).toBe('class1');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with prefix', () => {
      const id = generateId('test');
      expect(id).toMatch(/^test_/);
    });
  });

  describe('chunk', () => {
    it('should chunk array correctly', () => {
      const arr = [1, 2, 3, 4, 5];
      const chunks = chunk(arr, 2);
      expect(chunks).toEqual([[1, 2], [3, 4], [5]]);
    });
  });

  describe('groupBy', () => {
    it('should group array by key', () => {
      const arr = [
        { id: 1, category: 'a' },
        { id: 2, category: 'b' },
        { id: 3, category: 'a' },
      ];
      const grouped = groupBy(arr, item => item.category);
      expect(grouped.a).toHaveLength(2);
      expect(grouped.b).toHaveLength(1);
    });
  });

  describe('unique', () => {
    it('should remove duplicates', () => {
      const arr = [1, 2, 2, 3, 3, 3];
      const result = unique(arr);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('uniqueBy', () => {
    it('should remove duplicates by key', () => {
      const arr = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 1, name: 'c' },
      ];
      const result = uniqueBy(arr, item => item.id);
      expect(result).toHaveLength(2);
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

  describe('formatFileSize', () => {
    it('should format file size correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
    });
  });

  describe('formatNumber', () => {
    it('should format number correctly', () => {
      const result = formatNumber(1000);
      expect(result).toContain('1,000');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage correctly', () => {
      expect(formatPercentage(0.5)).toBe('50%');
      expect(formatPercentage(0.1234, 2)).toBe('12.34%');
    });
  });

  describe('clamp', () => {
    it('should clamp value between min and max', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('randomInt', () => {
    it('should generate random integer', () => {
      const result = randomInt(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });
  });

  describe('randomFloat', () => {
    it('should generate random float', () => {
      const result = randomFloat(0, 1);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });
  });

  describe('roundTo', () => {
    it('should round to decimals', () => {
      expect(roundTo(3.14159, 2)).toBe(3.14);
      expect(roundTo(3.14159, 0)).toBe(3);
    });
  });

  describe('safeDivide', () => {
    it('should divide safely', () => {
      expect(safeDivide(10, 2)).toBe(5);
      expect(safeDivide(10, 0)).toBe(0);
      expect(safeDivide(10, 0, 1)).toBe(1);
    });
  });

  describe('getNestedValue', () => {
    it('should get nested value', () => {
      const obj = { a: { b: { c: 1 } } };
      expect(getNestedValue(obj, 'a.b.c')).toBe(1);
      expect(getNestedValue(obj, 'a.b.d')).toBeUndefined();
    });
  });

  describe('setNestedValue', () => {
    it('should set nested value', () => {
      const obj = { a: {} } as Record<string, unknown>;
      setNestedValue(obj, 'a.b.c', 1);
      expect((obj.a as Record<string, unknown>).b).toEqual({ c: 1 });
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

  describe('asyncMap', async () => {
    it('should map async functions', async () => {
      const items = [1, 2, 3];
      const result = await asyncMap(items, async x => x * 2);
      expect(result).toEqual([2, 4, 6]);
    });
  });

  describe('memoize', () => {
    it('should memoize function', () => {
      let callCount = 0;
      const fn = (...args: unknown[]) => {
        callCount++;
        const x = args[0] as number;
        return x * 2;
      };
      const memoized = memoize(fn);

      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10);
      expect(callCount).toBe(1);
    });
  });

  describe('once', () => {
    it('should call function only once', () => {
      let callCount = 0;
      const fn = () => {
        callCount++;
        return 'result';
      };
      const onceFn = once(fn);

      expect(onceFn()).toBe('result');
      expect(onceFn()).toBe('result');
      expect(callCount).toBe(1);
    });
  });

  describe('pipe', () => {
    it('should pipe functions', () => {
      const add = (x: number) => x + 1;
      const multiply = (x: number) => x * 2;
      const result = pipe(add, multiply)(5);
      expect(result).toBe(12);
    });
  });

  describe('compose', () => {
    it('should compose functions', () => {
      const add = (x: number) => x + 1;
      const multiply = (x: number) => x * 2;
      const result = compose(add, multiply)(5);
      expect(result).toBe(11);
    });
  });

  describe('curry', () => {
    it('should curry function', () => {
      const add = (...args: unknown[]) => {
        const [a, b, c] = args as [number, number, number];
        return a + b + c;
      };
      const curried = curry(add, 3) as any;
      const result = curried(1)(2)(3) as number;
      expect(result).toBe(6);
    });
  });

  describe('partial', () => {
    it('should partially apply function', () => {
      const add = (...args: unknown[]) => {
        const [a, b, c] = args as [number, number, number];
        return a + b + c;
      };
      const partialAdd = partial(add, 1, 2);
      expect(partialAdd(3) as number).toBe(6);
    });
  });
});
