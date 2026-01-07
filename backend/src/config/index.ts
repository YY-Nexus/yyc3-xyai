import { z } from 'zod';
import type { Config, Environment } from './types';

const EnvironmentSchema = z.enum(['development', 'production', 'test']);

const PostgresConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().default(5432),
  database: z.string().default('yyc3_ai_xiaoyu'),
  user: z.string().default('postgres'),
  password: z.string().default(''),
  ssl: z
    .union([z.boolean(), z.object({ rejectUnauthorized: z.boolean() })])
    .default(false),
  max: z.coerce.number().default(20),
  idleTimeoutMillis: z.coerce.number().default(30000),
  connectionTimeoutMillis: z.coerce.number().default(2000),
});

const RedisConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().default(6379),
  password: z.string().optional(),
  database: z.coerce.number().default(0),
});

const DatabaseConfigSchema = z.object({
  postgres: PostgresConfigSchema,
  redis: RedisConfigSchema,
});

const SecurityConfigSchema = z.object({
  jwt: z.object({
    secret: z.string().min(32),
    expiresIn: z.string().default('7d'),
    refreshExpiresIn: z.string().default('30d'),
    algorithm: z.string().default('HS256'),
  }),
  bcrypt: z.object({
    rounds: z.coerce.number().min(4).max(12).default(10),
  }),
  session: z.object({
    secret: z.string().min(32),
    resave: z.boolean().default(false),
    saveUninitialized: z.boolean().default(false),
    cookie: z.object({
      secure: z.boolean().default(false),
      httpOnly: z.boolean().default(true),
      maxAge: z.coerce.number().default(604800000),
      sameSite: z.enum(['strict', 'lax', 'none']).default('lax'),
    }),
  }),
  password: z.object({
    minLength: z.coerce.number().min(6).default(8),
    requireUppercase: z.boolean().default(true),
    requireLowercase: z.boolean().default(true),
    requireNumbers: z.boolean().default(true),
    requireSpecialChars: z.boolean().default(false),
  }),
});

const ServerConfigSchema = z.object({
  port: z.coerce.number().default(3000),
  host: z.string().default('0.0.0.0'),
  environment: EnvironmentSchema,
  cors: z.object({
    origin: z.union([z.string(), z.array(z.string())]).default('*'),
    credentials: z.boolean().default(true),
    methods: z
      .array(z.string())
      .default(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']),
    allowedHeaders: z
      .array(z.string())
      .default(['Content-Type', 'Authorization']),
  }),
  rateLimit: z.object({
    windowMs: z.coerce.number().default(900000),
    max: z.coerce.number().default(100),
    skipSuccessfulRequests: z.boolean().default(false),
    skipFailedRequests: z.boolean().default(false),
  }),
  bodyLimit: z.string().default('10mb'),
  timeout: z.coerce.number().default(30000),
});

const StorageConfigSchema = z.object({
  provider: z.enum(['local', 's3', 'azure', 'gcs']).default('local'),
  local: z
    .object({
      uploadDir: z.string().default('./uploads'),
      baseUrl: z.string().default('/uploads'),
      maxFileSize: z.coerce.number().default(10485760),
      allowedMimeTypes: z
        .array(z.string())
        .default([
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'video/mp4',
          'video/webm',
          'audio/mpeg',
          'audio/wav',
        ]),
    })
    .optional(),
  s3: z
    .object({
      accessKeyId: z.string(),
      secretAccessKey: z.string(),
      region: z.string(),
      bucket: z.string(),
      acl: z.string().optional(),
    })
    .optional(),
  azure: z
    .object({
      accountName: z.string(),
      accountKey: z.string(),
      container: z.string(),
    })
    .optional(),
  gcs: z
    .object({
      projectId: z.string(),
      keyFilename: z.string(),
      bucket: z.string(),
    })
    .optional(),
});

const AIConfigSchema = z.object({
  provider: z
    .enum(['openai', 'ollama', 'anthropic', 'custom'])
    .default('openai'),
  openai: z
    .object({
      apiKey: z.string(),
      baseURL: z.string().url().optional(),
      organization: z.string().optional(),
      model: z.string().default('gpt-4'),
      maxTokens: z.coerce.number().default(2000),
      temperature: z.coerce.number().min(0).max(2).default(0.7),
      topP: z.coerce.number().min(0).max(1).optional(),
      frequencyPenalty: z.coerce.number().min(-2).max(2).optional(),
      presencePenalty: z.coerce.number().min(-2).max(2).optional(),
    })
    .optional(),
  ollama: z
    .object({
      baseURL: z.string().url().default('http://localhost:11434'),
      model: z.string().default('llama2'),
      temperature: z.coerce.number().min(0).max(2).optional(),
      numPredict: z.coerce.number().optional(),
    })
    .optional(),
  anthropic: z
    .object({
      apiKey: z.string(),
      baseURL: z.string().url().optional(),
      model: z.string().default('claude-3-opus-20240229'),
      maxTokens: z.coerce.number().default(4096),
      temperature: z.coerce.number().min(0).max(1).optional(),
    })
    .optional(),
  custom: z
    .object({
      baseURL: z.string().url(),
      apiKey: z.string().optional(),
      model: z.string(),
      headers: z.record(z.string()).optional(),
    })
    .optional(),
  rateLimit: z.object({
    requestsPerMinute: z.coerce.number().default(60),
    requestsPerHour: z.coerce.number().default(1000),
    requestsPerDay: z.coerce.number().default(10000),
  }),
  cache: z.object({
    enabled: z.boolean().default(true),
    ttl: z.coerce.number().default(3600),
  }),
});

const EmailConfigSchema = z.object({
  provider: z.enum(['smtp', 'sendgrid', 'ses', 'mailgun']).default('smtp'),
  smtp: z
    .object({
      host: z.string(),
      port: z.coerce.number(),
      secure: z.boolean().default(true),
      auth: z.object({
        user: z.string(),
        pass: z.string(),
      }),
    })
    .optional(),
  sendgrid: z
    .object({
      apiKey: z.string(),
    })
    .optional(),
  ses: z
    .object({
      accessKeyId: z.string(),
      secretAccessKey: z.string(),
      region: z.string(),
    })
    .optional(),
  mailgun: z
    .object({
      apiKey: z.string(),
      domain: z.string(),
    })
    .optional(),
  from: z.object({
    email: z.string().email(),
    name: z.string(),
  }),
  templates: z.object({
    welcome: z.string(),
    verification: z.string(),
    passwordReset: z.string(),
    invitation: z.string(),
  }),
});

const NotificationConfigSchema = z.object({
  channels: z
    .array(z.enum(['email', 'push', 'sms', 'inApp']))
    .default(['email', 'inApp']),
  email: EmailConfigSchema,
  push: z
    .object({
      vapidPublicKey: z.string(),
      vapidPrivateKey: z.string(),
      subject: z.string(),
    })
    .optional(),
  sms: z
    .object({
      provider: z.enum(['twilio', 'nexmo', 'aws-sns']),
      apiKey: z.string(),
      apiSecret: z.string(),
      fromNumber: z.string(),
    })
    .optional(),
});

const AppConfigSchema = z.object({
  name: z.string().default('YYC³ AI Xiaoyu'),
  version: z.string().default('1.0.0'),
  description: z.string().default('AI-powered child growth companion system'),
  url: z.string().url().default('http://localhost:3000'),
  supportEmail: z.string().email().default('support@yyc3.com'),
  timezone: z.string().default('Asia/Shanghai'),
  locale: z.string().default('zh-CN'),
  features: z.object({
    registration: z.boolean().default(true),
    emailVerification: z.boolean().default(true),
    socialLogin: z.boolean().default(false),
    multiChild: z.boolean().default(true),
    aiAssistant: z.boolean().default(true),
    growthTracking: z.boolean().default(true),
    recommendations: z.boolean().default(true),
    analytics: z.boolean().default(true),
  }),
});

const MonitoringConfigSchema = z.object({
  enabled: z.boolean().default(false),
  provider: z
    .enum(['prometheus', 'datadog', 'newrelic', 'custom'])
    .default('custom'),
  prometheus: z
    .object({
      port: z.coerce.number().default(9090),
      path: z.string().default('/metrics'),
    })
    .optional(),
  datadog: z
    .object({
      apiKey: z.string(),
      site: z.string().default('datadoghq.com'),
    })
    .optional(),
  newrelic: z
    .object({
      licenseKey: z.string(),
      appName: z.string(),
    })
    .optional(),
  metrics: z.object({
    responseTime: z.boolean().default(true),
    errorRate: z.boolean().default(true),
    requestCount: z.boolean().default(true),
    databaseQueries: z.boolean().default(false),
    cacheHits: z.boolean().default(false),
  }),
  alerts: z.object({
    enabled: z.boolean().default(true),
    errorThreshold: z.coerce.number().default(0.05),
    responseTimeThreshold: z.coerce.number().default(1000),
  }),
});

const LoggerConfigSchema = z.object({
  level: z
    .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
    .default('info'),
  environment: EnvironmentSchema,
  service: z.string().default('yyc3-ai-xiaoyu-backend'),
  file: z.object({
    enabled: z.boolean().default(true),
    path: z.string().default('./logs/combined.log'),
    maxSize: z.coerce.number().default(5242880),
    maxFiles: z.coerce.number().default(5),
  }),
  logFile: z.string().optional(),
  logDir: z.string().default('./logs'),
  maxFileSize: z.coerce.number().default(5242880),
  maxFiles: z.coerce.number().default(5),
  enableConsole: z.boolean().default(true),
  enableFile: z.boolean().default(true),
  enableErrorFile: z.boolean().default(true),
});

const MigratorConfigSchema = z.object({
  migrationsPath: z.string().default('./migrations'),
  autoRun: z.boolean().default(false),
  dryRun: z.boolean().default(false),
  verbose: z.boolean().default(false),
  resetTables: z.array(z.string()).default([]),
});

const ConfigSchema = z.object({
  environment: EnvironmentSchema,
  app: AppConfigSchema,
  server: ServerConfigSchema,
  database: DatabaseConfigSchema,
  security: SecurityConfigSchema,
  storage: StorageConfigSchema,
  ai: AIConfigSchema,
  notification: NotificationConfigSchema,
  logger: LoggerConfigSchema,
  monitoring: MonitoringConfigSchema,
  migrator: MigratorConfigSchema,
});

export function loadConfig(): Config {
  const env = (process.env.NODE_ENV as Environment) || 'development';

  const config = ConfigSchema.parse({
    environment: env,
    app: {
      name: process.env['APP_NAME'],
      version: process.env['APP_VERSION'],
      description: process.env['APP_DESCRIPTION'],
      url: process.env['APP_URL'],
      supportEmail: process.env['SUPPORT_EMAIL'],
      timezone: process.env['TIMEZONE'],
      locale: process.env['LOCALE'],
      features: {
        registration: process.env['FEATURE_REGISTRATION'] === 'true',
        emailVerification: process.env['FEATURE_EMAIL_VERIFICATION'] === 'true',
        socialLogin: process.env['FEATURE_SOCIAL_LOGIN'] === 'true',
        multiChild: process.env['FEATURE_MULTI_CHILD'] === 'true',
        aiAssistant: process.env['FEATURE_AI_ASSISTANT'] === 'true',
        growthTracking: process.env['FEATURE_GROWTH_TRACKING'] === 'true',
        recommendations: process.env['FEATURE_RECOMMENDATIONS'] === 'true',
        analytics: process.env['FEATURE_ANALYTICS'] === 'true',
      },
    },
    server: {
      port: process.env['PORT'],
      host: process.env['HOST'],
      environment: env,
      cors: {
        origin: process.env['CORS_ORIGIN']?.split(',') || '*',
        credentials: process.env['CORS_CREDENTIALS'] === 'true',
        methods: process.env['CORS_METHODS']?.split(',') || [
          'GET',
          'POST',
          'PUT',
          'DELETE',
          'PATCH',
          'OPTIONS',
        ],
        allowedHeaders: process.env['CORS_ALLOWED_HEADERS']?.split(',') || [
          'Content-Type',
          'Authorization',
        ],
      },
      rateLimit: {
        windowMs: process.env['RATE_LIMIT_WINDOW_MS']
          ? parseInt(process.env['RATE_LIMIT_WINDOW_MS'])
          : undefined,
        max: process.env['RATE_LIMIT_MAX']
          ? parseInt(process.env['RATE_LIMIT_MAX'])
          : undefined,
        skipSuccessfulRequests:
          process.env['RATE_LIMIT_SKIP_SUCCESSFUL'] === 'true',
        skipFailedRequests: process.env['RATE_LIMIT_SKIP_FAILED'] === 'true',
      },
      bodyLimit: process.env['BODY_LIMIT'],
      timeout: process.env['TIMEOUT']
        ? parseInt(process.env['TIMEOUT'])
        : undefined,
    },
    database: {
      postgres: {
        host: process.env['DB_HOST'],
        port: process.env['DB_PORT'],
        database: process.env['DB_NAME'],
        user: process.env['DB_USER'],
        password: process.env['DB_PASSWORD'],
        ssl:
          process.env['DB_SSL'] === 'true'
            ? { rejectUnauthorized: false }
            : false,
        max: process.env['DB_MAX']
          ? parseInt(process.env['DB_MAX'])
          : undefined,
        idleTimeoutMillis: process.env['DB_IDLE_TIMEOUT']
          ? parseInt(process.env['DB_IDLE_TIMEOUT'])
          : undefined,
        connectionTimeoutMillis: process.env['DB_CONNECTION_TIMEOUT']
          ? parseInt(process.env['DB_CONNECTION_TIMEOUT'])
          : undefined,
      },
      redis: {
        host: process.env['REDIS_HOST'],
        port: process.env['REDIS_PORT'],
        password: process.env['REDIS_PASSWORD'],
        database: process.env['REDIS_DB']
          ? parseInt(process.env['REDIS_DB'])
          : undefined,
      },
    },
    security: {
      jwt: {
        secret: process.env['JWT_SECRET'],
        expiresIn: process.env['JWT_EXPIRES_IN'],
        refreshExpiresIn: process.env['JWT_REFRESH_EXPIRES_IN'],
        algorithm: process.env['JWT_ALGORITHM'],
      },
      bcrypt: {
        rounds: process.env['BCRYPT_ROUNDS']
          ? parseInt(process.env['BCRYPT_ROUNDS'])
          : undefined,
      },
      session: {
        secret: process.env['SESSION_SECRET'],
        resave: process.env['SESSION_RESAVE'] === 'true',
        saveUninitialized: process.env['SESSION_SAVE_UNINITIALIZED'] === 'true',
        cookie: {
          secure: process.env['SESSION_COOKIE_SECURE'] === 'true',
          httpOnly: process.env['SESSION_COOKIE_HTTPONLY'] !== 'false',
          maxAge: process.env['SESSION_COOKIE_MAX_AGE']
            ? parseInt(process.env['SESSION_COOKIE_MAX_AGE'])
            : undefined,
          sameSite:
            (process.env['SESSION_COOKIE_SAME_SITE'] as
              | 'strict'
              | 'lax'
              | 'none') || 'lax',
        },
      },
      password: {
        minLength: process.env['PASSWORD_MIN_LENGTH']
          ? parseInt(process.env['PASSWORD_MIN_LENGTH'])
          : undefined,
        requireUppercase: process.env['PASSWORD_REQUIRE_UPPERCASE'] === 'true',
        requireLowercase: process.env['PASSWORD_REQUIRE_LOWERCASE'] === 'true',
        requireNumbers: process.env['PASSWORD_REQUIRE_NUMBERS'] === 'true',
        requireSpecialChars:
          process.env['PASSWORD_REQUIRE_SPECIAL_CHARS'] === 'true',
      },
    },
    storage: {
      provider:
        (process.env['STORAGE_PROVIDER'] as 'local' | 's3' | 'azure' | 'gcs') ||
        'local',
      local:
        process.env['STORAGE_PROVIDER'] === 'local'
          ? {
              uploadDir: process.env['STORAGE_UPLOAD_DIR'],
              baseUrl: process.env['STORAGE_BASE_URL'],
              maxFileSize: process.env['STORAGE_MAX_FILE_SIZE']
                ? parseInt(process.env['STORAGE_MAX_FILE_SIZE'])
                : undefined,
              allowedMimeTypes:
                process.env['STORAGE_ALLOWED_MIME_TYPES']?.split(','),
            }
          : undefined,
      s3:
        process.env['STORAGE_PROVIDER'] === 's3'
          ? {
              accessKeyId: process.env['S3_ACCESS_KEY_ID'],
              secretAccessKey: process.env['S3_SECRET_ACCESS_KEY'],
              region: process.env['S3_REGION'],
              bucket: process.env['S3_BUCKET'],
              acl: process.env['S3_ACL'],
            }
          : undefined,
      azure:
        process.env['STORAGE_PROVIDER'] === 'azure'
          ? {
              accountName: process.env['AZURE_ACCOUNT_NAME'],
              accountKey: process.env['AZURE_ACCOUNT_KEY'],
              container: process.env['AZURE_CONTAINER'],
            }
          : undefined,
      gcs:
        process.env['STORAGE_PROVIDER'] === 'gcs'
          ? {
              projectId: process.env['GCS_PROJECT_ID'],
              keyFilename: process.env['GCS_KEY_FILENAME'],
              bucket: process.env['GCS_BUCKET'],
            }
          : undefined,
    },
    ai: {
      provider:
        (process.env['AI_PROVIDER'] as
          | 'openai'
          | 'ollama'
          | 'anthropic'
          | 'custom') || 'openai',
      openai:
        process.env['AI_PROVIDER'] === 'openai'
          ? {
              apiKey: process.env['OPENAI_API_KEY'],
              baseURL: process.env['OPENAI_BASE_URL'],
              organization: process.env['OPENAI_ORGANIZATION'],
              model: process.env['OPENAI_MODEL'],
              maxTokens: process.env['OPENAI_MAX_TOKENS']
                ? parseInt(process.env['OPENAI_MAX_TOKENS'])
                : undefined,
              temperature: process.env['OPENAI_TEMPERATURE']
                ? parseFloat(process.env['OPENAI_TEMPERATURE'])
                : undefined,
              topP: process.env['OPENAI_TOP_P']
                ? parseFloat(process.env['OPENAI_TOP_P'])
                : undefined,
              frequencyPenalty: process.env['OPENAI_FREQUENCY_PENALTY']
                ? parseFloat(process.env['OPENAI_FREQUENCY_PENALTY'])
                : undefined,
              presencePenalty: process.env['OPENAI_PRESENCE_PENALTY']
                ? parseFloat(process.env['OPENAI_PRESENCE_PENALTY'])
                : undefined,
            }
          : undefined,
      ollama:
        process.env['AI_PROVIDER'] === 'ollama'
          ? {
              baseURL: process.env['OLLAMA_BASE_URL'],
              model: process.env['OLLAMA_MODEL'],
              temperature: process.env['OLLAMA_TEMPERATURE']
                ? parseFloat(process.env['OLLAMA_TEMPERATURE'])
                : undefined,
              numPredict: process.env['OLLAMA_NUM_PREDICT']
                ? parseInt(process.env['OLLAMA_NUM_PREDICT'])
                : undefined,
            }
          : undefined,
      anthropic:
        process.env['AI_PROVIDER'] === 'anthropic'
          ? {
              apiKey: process.env['ANTHROPIC_API_KEY'],
              baseURL: process.env['ANTHROPIC_BASE_URL'],
              model: process.env['ANTHROPIC_MODEL'],
              maxTokens: process.env['ANTHROPIC_MAX_TOKENS']
                ? parseInt(process.env['ANTHROPIC_MAX_TOKENS'])
                : undefined,
              temperature: process.env['ANTHROPIC_TEMPERATURE']
                ? parseFloat(process.env['ANTHROPIC_TEMPERATURE'])
                : undefined,
            }
          : undefined,
      custom:
        process.env['AI_PROVIDER'] === 'custom'
          ? {
              baseURL: process.env['CUSTOM_AI_BASE_URL'],
              apiKey: process.env['CUSTOM_AI_API_KEY'],
              model: process.env['CUSTOM_AI_MODEL'],
              headers: process.env['CUSTOM_AI_HEADERS']
                ? JSON.parse(process.env['CUSTOM_AI_HEADERS'])
                : undefined,
            }
          : undefined,
      rateLimit: {
        requestsPerMinute: process.env['AI_RATE_LIMIT_PER_MINUTE']
          ? parseInt(process.env['AI_RATE_LIMIT_PER_MINUTE'])
          : undefined,
        requestsPerHour: process.env['AI_RATE_LIMIT_PER_HOUR']
          ? parseInt(process.env['AI_RATE_LIMIT_PER_HOUR'])
          : undefined,
        requestsPerDay: process.env['AI_RATE_LIMIT_PER_DAY']
          ? parseInt(process.env['AI_RATE_LIMIT_PER_DAY'])
          : undefined,
      },
      cache: {
        enabled: process.env['AI_CACHE_ENABLED'] !== 'false',
        ttl: process.env['AI_CACHE_TTL']
          ? parseInt(process.env['AI_CACHE_TTL'])
          : undefined,
      },
    },
    notification: {
      channels: (process.env['NOTIFICATION_CHANNELS']?.split(',') as Array<
        'email' | 'push' | 'sms' | 'inApp'
      >) || ['email', 'inApp'],
      email: {
        provider:
          (process.env['EMAIL_PROVIDER'] as
            | 'smtp'
            | 'sendgrid'
            | 'ses'
            | 'mailgun') || 'smtp',
        smtp:
          process.env['EMAIL_PROVIDER'] === 'smtp'
            ? {
                host: process.env['SMTP_HOST'],
                port: process.env['SMTP_PORT']
                  ? parseInt(process.env['SMTP_PORT'])
                  : undefined,
                secure: process.env['SMTP_SECURE'] !== 'false',
                auth: {
                  user: process.env['SMTP_USER'],
                  pass: process.env['SMTP_PASS'],
                },
              }
            : undefined,
        sendgrid:
          process.env['EMAIL_PROVIDER'] === 'sendgrid'
            ? {
                apiKey: process.env['SENDGRID_API_KEY'],
              }
            : undefined,
        ses:
          process.env['EMAIL_PROVIDER'] === 'ses'
            ? {
                accessKeyId: process.env['SES_ACCESS_KEY_ID'],
                secretAccessKey: process.env['SES_SECRET_ACCESS_KEY'],
                region: process.env['SES_REGION'],
              }
            : undefined,
        mailgun:
          process.env['EMAIL_PROVIDER'] === 'mailgun'
            ? {
                apiKey: process.env['MAILGUN_API_KEY'],
                domain: process.env['MAILGUN_DOMAIN'],
              }
            : undefined,
        from: {
          email: process.env['EMAIL_FROM'],
          name: process.env['EMAIL_FROM_NAME'],
        },
        templates: {
          welcome: process.env['EMAIL_TEMPLATE_WELCOME'],
          verification: process.env['EMAIL_TEMPLATE_VERIFICATION'],
          passwordReset: process.env['EMAIL_TEMPLATE_PASSWORD_RESET'],
          invitation: process.env['EMAIL_TEMPLATE_INVITATION'],
        },
      },
      push: process.env['NOTIFICATION_CHANNELS']?.includes('push')
        ? {
            vapidPublicKey: process.env['VAPID_PUBLIC_KEY'],
            vapidPrivateKey: process.env['VAPID_PRIVATE_KEY'],
            subject: process.env['VAPID_SUBJECT'],
          }
        : undefined,
      sms: process.env['NOTIFICATION_CHANNELS']?.includes('sms')
        ? {
            provider: process.env['SMS_PROVIDER'] as
              | 'twilio'
              | 'nexmo'
              | 'aws-sns',
            apiKey: process.env['SMS_API_KEY'],
            apiSecret: process.env['SMS_API_SECRET'],
            fromNumber: process.env['SMS_FROM_NUMBER'],
          }
        : undefined,
    },
    logger: {
      level: process.env['LOG_LEVEL'] as any,
      environment: env,
      service: process.env['LOGGER_SERVICE'],
      file: {
        enabled: process.env['LOG_FILE_ENABLED'] !== 'false',
        path: process.env['LOG_FILE_PATH'] || './logs/combined.log',
        maxSize: process.env['LOG_FILE_MAX_SIZE']
          ? parseInt(process.env['LOG_FILE_MAX_SIZE'])
          : 5242880,
        maxFiles: process.env['LOG_FILE_MAX_FILES']
          ? parseInt(process.env['LOG_FILE_MAX_FILES'])
          : 5,
      },
      logFile: process.env['LOG_FILE'],
      logDir: process.env['LOG_DIR'],
      maxFileSize: process.env['LOG_MAX_FILE_SIZE']
        ? parseInt(process.env['LOG_MAX_FILE_SIZE'])
        : undefined,
      maxFiles: process.env['LOG_MAX_FILES']
        ? parseInt(process.env['LOG_MAX_FILES'])
        : undefined,
      enableConsole: process.env['LOG_ENABLE_CONSOLE'] !== 'false',
      enableFile: process.env['LOG_ENABLE_FILE'] !== 'false',
      enableErrorFile: process.env['LOG_ENABLE_ERROR_FILE'] !== 'false',
    },
    migrator: {
      migrationsPath: process.env['MIGRATIONS_PATH'] || './migrations',
      autoRun: process.env['MIGRATIONS_AUTO_RUN'] === 'true',
      dryRun: process.env['MIGRATIONS_DRY_RUN'] === 'true',
      verbose: process.env['MIGRATIONS_VERBOSE'] === 'true',
      resetTables: process.env['MIGRATIONS_RESET_TABLES']?.split(',') || [],
    },
    monitoring: {
      enabled: process.env['MONITORING_ENABLED'] === 'true',
      provider:
        (process.env['MONITORING_PROVIDER'] as
          | 'prometheus'
          | 'datadog'
          | 'newrelic'
          | 'custom') || 'custom',
      prometheus:
        process.env['MONITORING_PROVIDER'] === 'prometheus'
          ? {
              port: process.env['PROMETHEUS_PORT']
                ? parseInt(process.env['PROMETHEUS_PORT'])
                : undefined,
              path: process.env['PROMETHEUS_PATH'],
            }
          : undefined,
      datadog:
        process.env['MONITORING_PROVIDER'] === 'datadog'
          ? {
              apiKey: process.env['DATADOG_API_KEY'],
              site: process.env['DATADOG_SITE'],
            }
          : undefined,
      newrelic:
        process.env['MONITORING_PROVIDER'] === 'newrelic'
          ? {
              licenseKey: process.env['NEWRELIC_LICENSE_KEY'],
              appName: process.env['NEWRELIC_APP_NAME'],
            }
          : undefined,
      metrics: {
        responseTime: process.env['METRICS_RESPONSE_TIME'] !== 'false',
        errorRate: process.env['METRICS_ERROR_RATE'] !== 'false',
        requestCount: process.env['METRICS_REQUEST_COUNT'] !== 'false',
        databaseQueries: process.env['METRICS_DATABASE_QUERIES'] === 'true',
        cacheHits: process.env['METRICS_CACHE_HITS'] === 'true',
      },
      alerts: {
        enabled: process.env['ALERTS_ENABLED'] !== 'false',
        errorThreshold: process.env['ALERTS_ERROR_THRESHOLD']
          ? parseFloat(process.env['ALERTS_ERROR_THRESHOLD'])
          : undefined,
        responseTimeThreshold: process.env['ALERTS_RESPONSE_TIME_THRESHOLD']
          ? parseInt(process.env['ALERTS_RESPONSE_TIME_THRESHOLD'])
          : undefined,
      },
    },
  });

  return config;
}

let cachedConfig: Config | null = null;

export function getConfig(): Config {
  if (!cachedConfig) {
    cachedConfig = loadConfig();
  }
  return cachedConfig;
}

export function reloadConfig(): Config {
  cachedConfig = null;
  return getConfig();
}

export function validateConfig(config: unknown): Config {
  return ConfigSchema.parse(config);
}

export default getConfig;
