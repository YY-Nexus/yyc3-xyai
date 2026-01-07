export type Environment = 'development' | 'production' | 'test';

export interface PostgresConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean | { rejectUnauthorized: boolean };
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  database: number;
}

export interface DatabaseConfig {
  postgres: PostgresConfig;
  redis: RedisConfig;
}

export type DatabaseStatus = {
  postgres: boolean;
  redis: boolean;
};

export type QueryResult<T = any> = {
  rows: T[];
  rowCount: number | null;
  command: string;
  fields: any[];
  oid: number;
};

export type QueryParams = any[];

export type TransactionCallback<T = any> = (client: any) => Promise<T>;

export type InsertData = Record<string, any>;

export type UpdateData = Record<string, any>;

export type TableIdentifier = string;

export type RecordId = string | number;

export interface DatabaseOperations {
  query: <T = any>(
    text: string,
    params?: QueryParams
  ) => Promise<QueryResult<T>>;
  transaction: <T = any>(callback: TransactionCallback<T>) => Promise<T>;
  one: <T = any>(text: string, params?: QueryParams) => Promise<T | undefined>;
  many: <T = any>(text: string, params?: QueryParams) => Promise<T[]>;
  insert: (table: TableIdentifier, data: InsertData) => Promise<RecordId>;
  update: <T = any>(
    table: TableIdentifier,
    id: RecordId,
    data: UpdateData
  ) => Promise<T>;
  delete: <T = any>(
    table: TableIdentifier,
    id: RecordId
  ) => Promise<T | undefined>;
}

export interface RedisOperations {
  set: <T = any>(key: string, value: T, ttl?: number) => Promise<void>;
  get: <T = any>(key: string) => Promise<T | null>;
  del: (key: string) => Promise<number>;
  exists: (key: string) => Promise<number>;
  expire: (key: string, ttl: number) => Promise<boolean>;
  ttl: (key: string) => Promise<number>;
  incr: (key: string) => Promise<number>;
  decr: (key: string) => Promise<number>;
  mget: <T = any>(keys: string[]) => Promise<(T | null)[]>;
  mset: (entries: Array<[string, any]>) => Promise<string>;
  hset: <T = any>(key: string, field: string, value: T) => Promise<number>;
  hget: <T = any>(key: string, field: string) => Promise<T | null>;
  hgetall: <T = any>(key: string) => Promise<Record<string, T>>;
  hdel: (key: string, ...fields: string[]) => Promise<number>;
  lpush: <T = any>(key: string, ...values: T[]) => Promise<number>;
  rpush: <T = any>(key: string, ...values: T[]) => Promise<number>;
  lpop: <T = any>(key: string) => Promise<T | null>;
  rpop: <T = any>(key: string) => Promise<T | null>;
  lrange: <T = any>(key: string, start: number, stop: number) => Promise<T[]>;
  llen: (key: string) => Promise<number>;
  sadd: <T = any>(key: string, ...members: T[]) => Promise<number>;
  srem: <key = string>(key: string, ...members: any[]) => Promise<number>;
  smembers: <T = any>(key: string) => Promise<T[]>;
  sismember: (key: string, member: any) => Promise<number>;
  scard: (key: string) => Promise<number>;
  zadd: (key: string, score: number, member: any) => Promise<number>;
  zrem: (key: string, ...members: any[]) => Promise<number>;
  zrange: <T = any>(
    key: string,
    start: number,
    stop: number,
    withScores?: boolean
  ) => Promise<T[]>;
  zrangebyscore: <T = any>(
    key: string,
    min: number,
    max: number
  ) => Promise<T[]>;
  zcard: (key: string) => Promise<number>;
  zscore: (key: string, member: any) => Promise<number | null>;
  zrank: (key: string, member: any) => Promise<number | null>;
  zrevrank: (key: string, member: any) => Promise<number | null>;
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

export interface LogMetadata {
  [key: string]: any;
}

export interface LogContext {
  service: string;
  environment: Environment;
  timestamp?: string;
  requestId?: string;
  userId?: string;
  childId?: string;
}

export interface PerformanceLogMeta extends LogMetadata {
  operation: string;
  duration: string;
}

export interface SecurityLogMeta extends LogMetadata {
  event: string;
  timestamp: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface BusinessLogMeta extends LogMetadata {
  action: string;
  userId?: string;
  timestamp: string;
  childId?: string;
}

export interface APILogMeta extends LogMetadata {
  method: string;
  url: string;
  statusCode: number;
  duration: string;
  userId?: string;
  requestId?: string;
}

export interface DatabaseLogMeta extends LogMetadata {
  operation: string;
  table: string;
  duration: string;
  query?: string;
  userId?: string;
}

export interface CacheLogMeta extends LogMetadata {
  operation: string;
  key: string;
  hit?: boolean;
  ttl?: number;
}

export interface UserActivityLogMeta extends LogMetadata {
  userId: string;
  activity: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SystemLogMeta extends LogMetadata {
  event: string;
  timestamp: string;
  component?: string;
}

export interface ErrorLogMeta extends LogMetadata {
  message: string;
  stack?: string;
  name: string;
  context?: string;
  timestamp: string;
  userId?: string;
  requestId?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  environment: Environment;
  service: string;
  file: {
    enabled: boolean;
    path: string;
    maxSize: number;
    maxFiles: number;
  };
  logFile?: string;
  logDir?: string;
  maxFileSize?: number;
  maxFiles?: number;
  enableConsole?: boolean;
  enableFile?: boolean;
  enableErrorFile?: boolean;
}

export interface Migration {
  id: string;
  name: string;
  version: string;
  description: string;
  up: string;
  down: string;
  executed_at?: Date;
}

export interface MigrationFileInfo {
  filename: string;
  path: string;
  content: string;
}

export interface MigrationInfo {
  id: string;
  name: string;
  version: string;
  description: string;
}

export interface MigrationStatus {
  total: number;
  executed: number;
  pending: number;
  latest: string | null;
  migrations: Array<{
    id: string;
    name: string;
    version: string;
    executed: boolean;
    executed_at?: Date;
  }>;
}

export interface MigratorConfig {
  migrationsPath: string;
  autoRun?: boolean;
  dryRun?: boolean;
  verbose?: boolean;
  resetTables: string[];
}

export interface MigrationResult {
  success: boolean;
  message: string;
  migrationsExecuted: number;
  migrationsRolledBack: number;
  duration: number;
  errors?: Array<{
    migration: string;
    error: string;
  }>;
}

export type MigrationCommand = 'up' | 'down' | 'status' | 'reset' | 'fresh';

export interface MigrationOptions {
  command: MigrationCommand;
  targetVersion?: string;
  force?: boolean;
  dryRun?: boolean;
}

export interface ServerConfig {
  port: number;
  host: string;
  environment: Environment;
  cors: {
    origin: string | string[];
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
  };
  rateLimit: {
    windowMs: number;
    max: number;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
  };
  bodyLimit: string;
  timeout: number;
}

export interface SecurityConfig {
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
    algorithm: string;
  };
  bcrypt: {
    rounds: number;
  };
  session: {
    secret: string;
    resave: boolean;
    saveUninitialized: boolean;
    cookie: {
      secure: boolean;
      httpOnly: boolean;
      maxAge: number;
      sameSite: 'strict' | 'lax' | 'none';
    };
  };
  password: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
}

export interface StorageConfig {
  provider: 'local' | 's3' | 'azure' | 'gcs';
  local?: {
    uploadDir: string;
    baseUrl: string;
    maxFileSize: number;
    allowedMimeTypes: string[];
  };
  s3?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
    acl?: string;
  };
  azure?: {
    accountName: string;
    accountKey: string;
    container: string;
  };
  gcs?: {
    projectId: string;
    keyFilename: string;
    bucket: string;
  };
}

export interface AIConfig {
  provider: 'openai' | 'ollama' | 'anthropic' | 'custom';
  openai?: {
    apiKey: string;
    baseURL?: string;
    organization?: string;
    model: string;
    maxTokens: number;
    temperature: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  };
  ollama?: {
    baseURL: string;
    model: string;
    temperature?: number;
    numPredict?: number;
  };
  anthropic?: {
    apiKey: string;
    baseURL?: string;
    model: string;
    maxTokens: number;
    temperature?: number;
  };
  custom?: {
    baseURL: string;
    apiKey?: string;
    model: string;
    headers?: Record<string, string>;
  };
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  cache: {
    enabled: boolean;
    ttl: number;
  };
}

export interface EmailConfig {
  provider: 'smtp' | 'sendgrid' | 'ses' | 'mailgun';
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  sendgrid?: {
    apiKey: string;
  };
  ses?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  };
  mailgun?: {
    apiKey: string;
    domain: string;
  };
  from: {
    email: string;
    name: string;
  };
  templates: {
    welcome: string;
    verification: string;
    passwordReset: string;
    invitation: string;
  };
}

export interface NotificationConfig {
  channels: Array<'email' | 'push' | 'sms' | 'inApp'>;
  email: EmailConfig;
  push?: {
    vapidPublicKey: string;
    vapidPrivateKey: string;
    subject: string;
  };
  sms?: {
    provider: 'twilio' | 'nexmo' | 'aws-sns';
    apiKey: string;
    apiSecret: string;
    fromNumber: string;
  };
}

export interface AppConfig {
  name: string;
  version: string;
  description: string;
  url: string;
  supportEmail: string;
  timezone: string;
  locale: string;
  features: {
    registration: boolean;
    emailVerification: boolean;
    socialLogin: boolean;
    multiChild: boolean;
    aiAssistant: boolean;
    growthTracking: boolean;
    recommendations: boolean;
    analytics: boolean;
  };
}

export interface MonitoringConfig {
  enabled: boolean;
  provider: 'prometheus' | 'datadog' | 'newrelic' | 'custom';
  prometheus?: {
    port: number;
    path: string;
  };
  datadog?: {
    apiKey: string;
    site: string;
  };
  newrelic?: {
    licenseKey: string;
    appName: string;
  };
  metrics: {
    responseTime: boolean;
    errorRate: boolean;
    requestCount: boolean;
    databaseQueries: boolean;
    cacheHits: boolean;
  };
  alerts: {
    enabled: boolean;
    errorThreshold: number;
    responseTimeThreshold: number;
  };
}

export interface Config {
  environment: Environment;
  app: AppConfig;
  server: ServerConfig;
  database: DatabaseConfig;
  security: SecurityConfig;
  storage: StorageConfig;
  ai: AIConfig;
  notification: NotificationConfig;
  logger: LoggerConfig;
  monitoring: MonitoringConfig;
  migrator: MigratorConfig;
}

export type ConfigKey = keyof Config;

export type ConfigValue = Config[ConfigKey];

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
