/**
 * Type Guards 类型守卫测试
 */

import { describe, it, expect } from 'bun:test';

describe('Type Guards 类型守卫测试', () => {
  // 测试字符串守卫
  it('应该能够检测字符串类型', () => {
    const isString = (value: unknown): value is string => {
      return typeof value === 'string';
    };

    expect(isString('hello')).toBe(true);
    expect(isString(123)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
  });

  // 测试数字守卫
  it('应该能够检测数字类型', () => {
    const isNumber = (value: unknown): value is number => {
      return typeof value === 'number' && !isNaN(value);
    };

    expect(isNumber(123)).toBe(true);
    expect(isNumber('hello')).toBe(false);
    expect(isNumber(NaN)).toBe(false);
  });

  // 测试布尔守卫
  it('应该能够检测布尔类型', () => {
    const isBoolean = (value: unknown): value is boolean => {
      return typeof value === 'boolean';
    };

    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
    expect(isBoolean('hello')).toBe(false);
    expect(isBoolean(1)).toBe(false);
  });

  // 测试数组守卫
  it('应该能够检测数组类型', () => {
    const isArray = (value: unknown): value is unknown[] => {
      return Array.isArray(value);
    };

    expect(isArray([1, 2, 3])).toBe(true);
    expect(isArray([])).toBe(true);
    expect(isArray('hello')).toBe(false);
    expect(isArray(null)).toBe(false);
  });

  // 测试对象守卫
  it('应该能够检测对象类型', () => {
    const isObject = (value: unknown): value is Record<string, unknown> => {
      return (
        typeof value === 'object' && value !== null && !Array.isArray(value)
      );
    };

    expect(isObject({ a: 1, b: 2 })).toBe(true);
    expect(isObject({})).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject('hello')).toBe(false);
  });

  // 测试函数守卫
  it('应该能够检测函数类型', () => {
    const isFunction = (
      value: unknown
    ): value is (...args: unknown[]) => unknown => {
      return typeof value === 'function';
    };

    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true);
    expect(isFunction('hello')).toBe(false);
  });

  // 测试 null 守卫
  it('应该能够检测 null 类型', () => {
    const isNull = (value: unknown): value is null => {
      return value === null;
    };

    expect(isNull(null)).toBe(true);
    expect(isNull(undefined)).toBe(false);
    expect(isNull('hello')).toBe(false);
  });

  // 测试 undefined 守卫
  it('应该能够检测 undefined 类型', () => {
    const isUndefined = (value: unknown): value is undefined => {
      return value === undefined;
    };

    expect(isUndefined(undefined)).toBe(true);
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined('hello')).toBe(false);
  });

  // 测试日期守卫
  it('应该能够检测日期类型', () => {
    const isDate = (value: unknown): value is Date => {
      return value instanceof Date;
    };

    expect(isDate(new Date())).toBe(true);
    expect(isDate('2024-01-01')).toBe(false);
    expect(isDate(123)).toBe(false);
  });

  // 测试正则表达式守卫
  it('应该能够检测正则表达式类型', () => {
    const isRegExp = (value: unknown): value is RegExp => {
      return value instanceof RegExp;
    };

    expect(isRegExp(/test/)).toBe(true);
    expect(isRegExp(new RegExp('test'))).toBe(true);
    expect(isRegExp('test')).toBe(false);
  });

  // 测试 Promise 守卫
  it('应该能够检测 Promise 类型', () => {
    const isPromise = (value: unknown): value is Promise<unknown> => {
      return (
        value !== null &&
        typeof value === 'object' &&
        'then' in value &&
        'catch' in value
      );
    };

    // 创建一个简单的 Promise-like 对象
    const promiseLike = {
      then: () => {},
      catch: () => {},
    };

    expect(isPromise(promiseLike)).toBe(true);
    expect(isPromise('hello')).toBe(false);
    expect(isPromise(null)).toBe(false);
  });

  // 测试错误守卫
  it('应该能够检测错误类型', () => {
    const isError = (value: unknown): value is Error => {
      return value instanceof Error;
    };

    expect(isError(new Error())).toBe(true);
    expect(isError(new TypeError())).toBe(true);
    expect(isError('hello')).toBe(false);
  });

  // 测试自定义类型守卫
  it('应该能够创建自定义类型守卫', () => {
    interface User {
      id: string;
      name: string;
      email: string;
    }

    const isUser = (value: unknown): value is User => {
      return (
        typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        'name' in value &&
        'email' in value
      );
    };

    expect(isUser({ id: '1', name: 'John', email: 'john@example.com' })).toBe(
      true
    );
    expect(isUser({ id: '1', name: 'John' })).toBe(false);
    expect(isUser(null)).toBe(false);
  });

  // 测试类型守卫组合
  it('应该能够组合类型守卫', () => {
    const isStringOrNumber = (value: unknown): value is string | number => {
      return typeof value === 'string' || typeof value === 'number';
    };

    expect(isStringOrNumber('hello')).toBe(true);
    expect(isStringOrNumber(123)).toBe(true);
    expect(isStringOrNumber(true)).toBe(false);
    expect(isStringOrNumber(null)).toBe(false);
  });

  // 测试类型守卫否定
  it('应该能够否定类型守卫', () => {
    const isNotNull = (value: unknown): value is never => {
      return false;
    };

    expect(isNotNull('hello')).toBe(false);
  });

  // 测试类型守卫交集
  it('应该能够创建类型守卫交集', () => {
    const isPositiveNumber = (value: unknown): value is number => {
      return typeof value === 'number' && !isNaN(value) && value > 0;
    };

    expect(isPositiveNumber(123)).toBe(true);
    expect(isPositiveNumber(-123)).toBe(false);
    expect(isPositiveNumber(0)).toBe(false);
    expect(isPositiveNumber('hello')).toBe(false);
  });

  // 测试类型守卫并集
  it('应该能够创建类型守卫并集', () => {
    const isStringOrBoolean = (value: unknown): value is string | boolean => {
      return typeof value === 'string' || typeof value === 'boolean';
    };

    expect(isStringOrBoolean('hello')).toBe(true);
    expect(isStringOrBoolean(true)).toBe(true);
    expect(isStringOrBoolean(false)).toBe(true);
    expect(isStringOrBoolean(123)).toBe(false);
  });
});
