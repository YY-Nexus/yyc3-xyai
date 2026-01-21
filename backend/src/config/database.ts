import { Pool } from 'pg';
import { createClient } from 'redis';
import { getConfig } from './index';
import type { PostgresConfig, RedisConfig } from './types';
import fs from 'fs';
import path from 'path';

const config = getConfig();

// 检查是否使用SQLite
const useSQLite = process.env.DB_TYPE === 'sqlite';

// SQLite配置（使用内存数据库模拟）
const sqlitePath = process.env.DB_SQLITE_PATH || './database.sqlite';
let sqliteDb: any = null;

// 简单的内存数据库实现
class MemoryDatabase {
  private tables: Map<string, any[]> = new Map();

  constructor() {
    this.tables.set('users', []);
    this.tables.set('children', []);
    this.tables.set('ai_conversations', []);
  }

  exec(sql: string) {
    console.log('MemoryDatabase.exec:', sql);
  }

  prepare(sql: string) {
    return {
      get: () => {
        console.log('MemoryDatabase.prepare.get:', sql);
        return null;
      },
      all: () => {
        console.log('MemoryDatabase.prepare.all:', sql);
        return [];
      },
      run: () => {
        console.log('MemoryDatabase.prepare.run:', sql);
        return { lastID: Date.now() };
      }
    };
  }

  close() {
    console.log('MemoryDatabase closed');
  }
}

export const postgresConfig: PostgresConfig = config.database.postgres;
export const redisConfig: RedisConfig = config.database.redis;

const poolConfig = {
  host: postgresConfig.host,
  port: postgresConfig.port,
  database: postgresConfig.database,
  user: postgresConfig.user,
  password: postgresConfig.password,
  ssl: postgresConfig.ssl,
  max: postgresConfig.max,
  idleTimeoutMillis: postgresConfig.idleTimeoutMillis,
  connectionTimeoutMillis: postgresConfig.connectionTimeoutMillis,
};

export const pool = useSQLite ? null : new Pool(poolConfig);

const redisClientConfig = {
  socket: {
    host: redisConfig.host,
    port: redisConfig.port,
  },
  password: redisConfig.password,
  database: redisConfig.database,
} as any;

export const redisClient = useSQLite ? null : createClient(redisClientConfig);

// 数据库连接状态
let isConnected = false;

// 初始化数据库连接
export const initializeDatabase = async (): Promise<void> => {
  try {
    if (useSQLite) {
      // 使用SQLite
      sqliteDb = new MemoryDatabase();
      console.info('MemoryDatabase connected successfully');

      isConnected = true;
    } else {
      // 使用PostgreSQL
      if (pool && redisClient) {
        await pool.query('SELECT NOW()');
        console.info('PostgreSQL connected successfully');

        await redisClient.connect();
        console.info('Redis connected successfully');

        isConnected = true;
      }
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

// 关闭数据库连接
export const closeDatabase = async (): Promise<void> => {
  try {
    if (useSQLite && sqliteDb) {
      sqliteDb.close();
      sqliteDb = null;
      console.info('SQLite connection closed');
    } else if (pool && redisClient) {
      await pool.end();
      await redisClient.quit();
      console.info('PostgreSQL and Redis connections closed');
    }
    isConnected = false;
    console.info('Database connections closed');
  } catch (error) {
    console.error('Error closing database connections:', error);
    throw error;
  }
};

// 检查数据库连接状态
export const isDatabaseConnected = (): boolean => isConnected;

// 数据库健康检查
export const healthCheck = async (): Promise<{
  postgres: boolean;
  redis: boolean;
}> => {
  const health = {
    postgres: false,
    redis: false,
  };

  try {
    if (useSQLite && sqliteDb) {
      // SQLite健康检查
      try {
        // 检查数据库实例是否存在且可用
        if (sqliteDb && typeof sqliteDb.prepare === 'function') {
          sqliteDb.prepare('SELECT 1').get();
          health.postgres = true; // 使用postgres字段表示SQLite状态
        }
      } catch (error) {
        console.error('SQLite health check failed:', error);
      }
    } else if (pool) {
      // PostgreSQL健康检查
      await pool.query('SELECT 1');
      health.postgres = true;
    }
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  try {
    if (redisClient) {
      await redisClient.ping();
      health.redis = true;
    }
  } catch (error) {
    console.error('Redis health check failed:', error);
  }

  return health;
};

// 导出常用的数据库操作工具
export const db = {
  // 执行查询
  query: async (text: string, params?: any[]) => {
    const start = Date.now();
    try {
      const result = await pool.query(text, params);
      const duration = Date.now() - start;
      console.debug('Executed query', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      console.error('Query execution failed', { text, error });
      throw error;
    }
  },

  // 执行事务
  transaction: async (callback: (client: any) => Promise<any>) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // 获取单个记录
  one: async (text: string, params?: any[]) => {
    const result = await pool.query(text, params);
    return result.rows[0];
  },

  // 获取多个记录
  many: async (text: string, params?: any[]) => {
    const result = await pool.query(text, params);
    return result.rows;
  },

  // 插入记录并返回ID
  insert: async (table: string, data: Record<string, any>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

    const query = `
      INSERT INTO ${table} (${keys.join(', ')})
      VALUES (${placeholders})
      RETURNING id
    `;

    const result = await pool.query(query, values);
    return result.rows[0].id;
  },

  // 更新记录
  update: async (
    table: string,
    id: string | number,
    data: Record<string, any>
  ) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const query = `
      UPDATE ${table}
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  },

  // 删除记录
  delete: async (table: string, id: string | number) => {
    const query = `DELETE FROM ${table} WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

// Redis操作工具
export const redis = {
  // 设置键值对
  set: async (key: string, value: any, ttl?: number) => {
    const serializedValue = JSON.stringify(value);
    if (ttl) {
      await redisClient.setEx(key, ttl, serializedValue);
    } else {
      await redisClient.set(key, serializedValue);
    }
  },

  // 获取值
  get: async <T = any>(key: string): Promise<T | null> => {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  },

  // 删除键
  del: async (key: string) => {
    return await redisClient.del(key);
  },

  // 检查键是否存在
  exists: async (key: string) => {
    return await redisClient.exists(key);
  },

  // 设置过期时间
  expire: async (key: string, ttl: number) => {
    return await redisClient.expire(key, ttl);
  },

  // 获取剩余过期时间
  ttl: async (key: string) => {
    return await redisClient.ttl(key);
  },

  // 原子递增
  incr: async (key: string) => {
    return await redisClient.incr(key);
  },

  // 原子递减
  decr: async (key: string) => {
    return await redisClient.decr(key);
  },
};

export default {
  pool,
  redisClient,
  initializeDatabase,
  closeDatabase,
  isDatabaseConnected,
  healthCheck,
  db,
  redis,
};
