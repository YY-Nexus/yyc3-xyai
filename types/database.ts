import { Pool, PoolClient, QueryResult as PgQueryResult } from 'pg'

export type UUID = string

export type Timestamp = Date | string

export type JsonValue = string | number | boolean | null | JsonObject | JsonArray

export interface JsonObject {
  [key: string]: JsonValue
}

export interface JsonArray extends Array<JsonValue> {}

export type DatabaseType = 'postgresql' | 'redis'

export type QueryParams = (string | number | boolean | null | Date)[]

export type WhereCondition = {
  [key: string]: any
}

export type OrderBy = {
  column: string
  direction: 'ASC' | 'DESC'
}

export type PaginationOptions = {
  page?: number
  limit?: number
  offset?: number
}

export type TransactionCallback<T = any> = (client: PoolClient) => Promise<T>

export type DatabaseError = {
  code: string
  message: string
  detail?: string
  schema?: string
  table?: string
  constraint?: string
}

export interface DatabaseConnection {
  host: string
  port: number
  database: string
  user: string
  password: string
  ssl?: boolean | { rejectUnauthorized: boolean }
  max?: number
  idleTimeoutMillis?: number
  connectionTimeoutMillis?: number
}

export interface RedisConnection {
  host: string
  port: number
  password?: string
  database: number
}

export interface HealthStatus {
  postgres: boolean
  redis: boolean
}

export interface QueryResult<T = any> {
  rows: T[]
  rowCount: number | null
  command: string
  fields: any[]
  oid: number
}

export interface DatabaseOperations {
  query<T = any>(text: string, params?: QueryParams): Promise<QueryResult<T>>
  transaction<T>(callback: TransactionCallback<T>): Promise<T>
  one<T = any>(text: string, params?: QueryParams): Promise<T | undefined>
  many<T = any>(text: string, params?: QueryParams): Promise<T[]>
  insert<T = any>(table: string, data: Record<string, any>): Promise<T>
  update<T = any>(table: string, id: string | number, data: Record<string, any>): Promise<T>
  delete<T = any>(table: string, id: string | number): Promise<T>
}

export interface RedisOperations {
  set<T = any>(key: string, value: T, ttl?: number): Promise<void>
  get<T = any>(key: string): Promise<T | null>
  del(key: string): Promise<number>
  exists(key: string): Promise<number>
  expire(key: string, ttl: number): Promise<boolean>
  ttl(key: string): Promise<number>
  incr(key: string): Promise<number>
  decr(key: string): Promise<number>
  hset(key: string, field: string, value: any): Promise<number>
  hget<T = any>(key: string, field: string): Promise<T | null>
  hgetall<T = any>(key: string): Promise<Record<string, T>>
  hdel(key: string, field: string): Promise<number>
  lpush(key: string, ...values: any[]): Promise<number>
  rpush(key: string, ...values: any[]): Promise<number>
  lpop<T = any>(key: string): Promise<T | null>
  rpop<T = any>(key: string): Promise<T | null>
  lrange<T = any>(key: string, start: number, stop: number): Promise<T[]>
  lrem(key: string, count: number, element: any): Promise<number>
  llen(key: string): Promise<number>
  sadd(key: string, ...members: any[]): Promise<number>
  srem(key: string, ...members: any[]): Promise<number>
  sismember(key: string, member: any): Promise<number>
  smembers<T = any>(key: string): Promise<T[]>
  scard(key: string): Promise<number>
  zadd(key: string, score: number, member: any): Promise<number>
  zrem(key: string, ...members: any[]): Promise<number>
  zscore(key: string, member: any): Promise<number | null>
  zrank(key: string, member: any): Promise<number | null>
  zrange<T = any>(key: string, start: number, stop: number): Promise<T[]>
  zcard(key: string): Promise<number>
}

export type UserRole = 'parent' | 'admin' | 'moderator'

export type Gender = 'male' | 'female'

export type GrowthCategory = 'milestone' | 'daily' | 'achievement' | 'health' | 'education' | 'social'

export type AIRole = 'recorder' | 'guardian' | 'listener' | 'advisor' | 'cultural_mentor'

export type NotificationType = 'milestone' | 'reminder' | 'system' | 'ai_insight' | 'weekly_report'

export type RecommendationType = 'activity' | 'content' | 'milestone' | 'skill'

export type UploadType = 'avatar' | 'growth_media' | 'document' | 'other'

export interface User {
  id: UUID
  email: string
  password_hash: string
  first_name: string
  last_name: string
  phone: string | null
  avatar_url: string | null
  role: UserRole
  is_active: boolean
  email_verified: boolean
  last_login_at: Timestamp | null
  created_at: Timestamp
  updated_at: Timestamp
}

export interface CreateUser {
  email: string
  password_hash: string
  first_name: string
  last_name: string
  phone?: string
  avatar_url?: string
  role?: UserRole
}

export interface UpdateUser {
  first_name?: string
  last_name?: string
  phone?: string
  avatar_url?: string
  is_active?: boolean
  email_verified?: boolean
}

export interface Child {
  id: UUID
  user_id: UUID
  name: string
  nickname: string | null
  gender: Gender
  birth_date: Date
  avatar_url: string | null
  current_stage: string | null
  is_active: boolean
  created_at: Timestamp
  updated_at: Timestamp
}

export interface CreateChild {
  user_id: UUID
  name: string
  nickname?: string
  gender: Gender
  birth_date: Date
  avatar_url?: string
  current_stage?: string
}

export interface UpdateChild {
  name?: string
  nickname?: string
  avatar_url?: string
  current_stage?: string
  is_active?: boolean
}

export interface GrowthRecord {
  id: UUID
  child_id: UUID
  title: string
  description: string | null
  category: GrowthCategory
  media_urls: string[]
  tags: string[]
  location: string | null
  is_public: boolean
  created_at: Timestamp
  updated_at: Timestamp
}

export interface CreateGrowthRecord {
  child_id: UUID
  title: string
  description?: string
  category: GrowthCategory
  media_urls?: string[]
  tags?: string[]
  location?: string
  is_public?: boolean
}

export interface UpdateGrowthRecord {
  title?: string
  description?: string
  category?: GrowthCategory
  media_urls?: string[]
  tags?: string[]
  location?: string
  is_public?: boolean
}

export interface AIConversation {
  id: UUID
  child_id: UUID
  session_id: string
  user_message: string
  ai_response: string
  ai_role: AIRole
  emotion: string | null
  context: JsonObject | null
  created_at: Timestamp
}

export interface CreateAIConversation {
  child_id: UUID
  session_id: string
  user_message: string
  ai_response: string
  ai_role: AIRole
  emotion?: string
  context?: JsonObject
}

export interface AIRoleConfig {
  id: UUID
  name: string
  description: string | null
  personality: string
  capabilities: string[]
  prompt_template: string
  is_active: boolean
  created_at: Timestamp
  updated_at: Timestamp
}

export interface CreateAIRole {
  name: string
  description?: string
  personality: string
  capabilities: string[]
  prompt_template: string
}

export interface UpdateAIRole {
  name?: string
  description?: string
  personality?: string
  capabilities?: string[]
  prompt_template?: string
  is_active?: boolean
}

export interface Notification {
  id: UUID
  user_id: UUID
  type: NotificationType
  title: string
  message: string
  data: JsonObject | null
  is_read: boolean
  created_at: Timestamp
  read_at: Timestamp | null
}

export interface CreateNotification {
  user_id: UUID
  type: NotificationType
  title: string
  message: string
  data?: JsonObject
}

export interface UpdateNotification {
  is_read?: boolean
  read_at?: Timestamp
}

export interface Recommendation {
  id: UUID
  child_id: UUID
  type: RecommendationType
  title: string
  description: string
  content_url: string | null
  age_range: {
    min: number
    max: number
  }
  categories: string[]
  confidence_score: number
  created_at: Timestamp
}

export interface CreateRecommendation {
  child_id: UUID
  type: RecommendationType
  title: string
  description: string
  content_url?: string
  age_range: {
    min: number
    max: number
  }
  categories?: string[]
  confidence_score: number
}

export interface SystemConfig {
  key: string
  value: JsonValue
  description: string | null
  created_at: Timestamp
  updated_at: Timestamp
}

export interface CreateSystemConfig {
  key: string
  value: JsonValue
  description?: string
}

export interface UpdateSystemConfig {
  value: JsonValue
  description?: string
}

export interface FileUpload {
  id: UUID
  user_id: UUID
  original_name: string
  filename: string
  file_path: string
  file_size: number
  mime_type: string
  upload_type: UploadType
  created_at: Timestamp
}

export interface CreateFileUpload {
  user_id: UUID
  original_name: string
  filename: string
  file_path: string
  file_size: number
  mime_type: string
  upload_type: UploadType
}

export interface UserSession {
  id: UUID
  user_id: UUID
  token_hash: string
  device_info: JsonObject | null
  ip_address: string | null
  expires_at: Timestamp
  created_at: Timestamp
}

export interface CreateUserSession {
  user_id: UUID
  token_hash: string
  device_info?: JsonObject
  ip_address?: string
  expires_at: Timestamp
}

export interface AuditLog {
  id: UUID
  user_id: UUID | null
  action: string
  resource_type: string
  resource_id: UUID | null
  old_values: JsonObject | null
  new_values: JsonObject | null
  ip_address: string | null
  user_agent: string | null
  created_at: Timestamp
}

export interface CreateAuditLog {
  user_id?: UUID
  action: string
  resource_type: string
  resource_id?: UUID
  old_values?: JsonObject
  new_values?: JsonObject
  ip_address?: string
  user_agent?: string
}

export interface UserStats {
  id: UUID
  email: string
  first_name: string
  last_name: string
  role: UserRole
  created_at: Timestamp
  last_login_at: Timestamp | null
  children_count: number
  growth_records_count: number
  ai_conversations_count: number
  unread_notifications_count: number
}

export interface ChildStats {
  id: UUID
  user_id: UUID
  name: string
  nickname: string | null
  gender: Gender
  birth_date: Date
  current_stage: string | null
  created_at: Timestamp
  age_in_days: number
  age_in_years: number
  age_years: number
  age_months: number
  total_records: number
  milestone_records: number
  total_conversations: number
  last_activity: Timestamp
}

export interface DailyStats {
  date: Date
  active_users: number
  active_children: number
  total_ai_conversations: number
  active_sessions: number
  milestones_recorded: number
  daily_records: number
}

export interface Migration {
  id: string
  name: string
  version: string
  description: string
  up: string
  down: string
  executed_at?: Timestamp
}

export interface MigrationStatus {
  total: number
  executed: number
  pending: number
  latest: string | null
}

export interface QueryBuilder {
  select(columns: string | string[]): QueryBuilder
  from(table: string): QueryBuilder
  join(table: string, condition: string): QueryBuilder
  leftJoin(table: string, condition: string): QueryBuilder
  where(condition: string | WhereCondition): QueryBuilder
  andWhere(condition: string | WhereCondition): QueryBuilder
  orWhere(condition: string | WhereCondition): QueryBuilder
  orderBy(column: string, direction?: 'ASC' | 'DESC'): QueryBuilder
  groupBy(column: string): QueryBuilder
  limit(limit: number): QueryBuilder
  offset(offset: number): QueryBuilder
  build(): { text: string; params: QueryParams }
}

export interface Repository<T> {
  findById(id: UUID): Promise<T | null>
  findOne(conditions: WhereCondition): Promise<T | null>
  findMany(conditions?: WhereCondition, options?: PaginationOptions & { orderBy?: OrderBy[] }): Promise<T[]>
  create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T>
  update(id: UUID, data: Partial<Omit<T, 'id' | 'created_at'>>): Promise<T>
  delete(id: UUID): Promise<boolean>
  count(conditions?: WhereCondition): Promise<number>
  exists(conditions: WhereCondition): Promise<boolean>
}

export type CacheKey = string

export type CacheValue = string | number | boolean | JsonObject | JsonArray

export interface CacheOptions {
  ttl?: number
  nx?: boolean
  xx?: boolean
}

export interface DatabaseConfig {
  postgres: DatabaseConnection
  redis: RedisConnection
  pool?: {
    min?: number
    max?: number
  }
  migrations?: {
    path: string
    tableName?: string
  }
}

export interface ConnectionPool {
  totalCount: number
  idleCount: number
  waitingCount: number
}

export interface DatabaseMetrics {
  pool: ConnectionPool
  queryCount: number
  errorCount: number
  avgQueryTime: number
  slowQueries: number
}

export type QueryLog = {
  text: string
  params?: QueryParams
  duration: number
  timestamp: Timestamp
  error?: DatabaseError
}

export interface DatabaseLogger {
  logQuery(query: QueryLog): void
  logError(error: DatabaseError): void
  logConnection(event: 'connect' | 'disconnect' | 'error'): void
}

export interface TransactionOptions {
  isolationLevel?: 'READ UNCOMMITTED' | 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE'
  readOnly?: boolean
  deferrable?: boolean
}

export interface Savepoint {
  name: string
  release(): Promise<void>
  rollback(): Promise<void>
}

export interface Transaction extends DatabaseOperations {
  client: PoolClient
  commit(): Promise<void>
  rollback(): Promise<void>
  createSavepoint(name?: string): Promise<Savepoint>
}

export type IndexType = 'btree' | 'hash' | 'gist' | 'gin' | 'spgist' | 'brin'

export interface IndexDefinition {
  name: string
  table: string
  columns: string[]
  unique?: boolean
  type?: IndexType
  where?: string
  concurrently?: boolean
}

export type ForeignKeyAction = 'NO ACTION' | 'RESTRICT' | 'CASCADE' | 'SET NULL' | 'SET DEFAULT'

export interface ForeignKeyDefinition {
  name: string
  table: string
  columns: string[]
  references: {
    table: string
    columns: string[]
  }
  onUpdate?: ForeignKeyAction
  onDelete?: ForeignKeyAction
}

export type TriggerTiming = 'BEFORE' | 'AFTER' | 'INSTEAD OF'

export type TriggerEvent = 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE'

export interface TriggerDefinition {
  name: string
  table: string
  timing: TriggerTiming
  events: TriggerEvent[]
  function: string
  when?: string
}

export interface ColumnDefinition {
  name: string
  type: string
  nullable?: boolean
  default?: any
  primary?: boolean
  unique?: boolean
  check?: string
  references?: {
    table: string
    column: string
  }
}

export interface TableDefinition {
  name: string
  columns: ColumnDefinition[]
  indexes?: IndexDefinition[]
  foreignKeys?: ForeignKeyDefinition[]
  triggers?: TriggerDefinition[]
}

export interface SchemaDiff {
  added: TableDefinition[]
  modified: {
    table: string
    changes: ColumnDefinition[]
  }[]
  removed: string[]
}

export type DataType =
  | 'smallint'
  | 'integer'
  | 'bigint'
  | 'decimal'
  | 'numeric'
  | 'real'
  | 'double precision'
  | 'smallserial'
  | 'serial'
  | 'bigserial'
  | 'character varying'
  | 'varchar'
  | 'character'
  | 'char'
  | 'text'
  | 'bytea'
  | 'timestamp'
  | 'timestamp with time zone'
  | 'timestamp without time zone'
  | 'date'
  | 'time'
  | 'time with time zone'
  | 'time without time zone'
  | 'boolean'
  | 'uuid'
  | 'json'
  | 'jsonb'
  | 'xml'
  | 'cidr'
  | 'inet'
  | 'macaddr'
  | 'macaddr8'
  | 'point'
  | 'line'
  | 'lseg'
  | 'box'
  | 'path'
  | 'polygon'
  | 'circle'

export interface ColumnConstraint {
  type: 'NOT NULL' | 'UNIQUE' | 'PRIMARY KEY' | 'CHECK' | 'FOREIGN KEY' | 'EXCLUDE'
  name?: string
  expression?: string
  references?: {
    table: string
    column: string
  }
}

export interface TableConstraint {
  name?: string
  type: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE' | 'CHECK' | 'EXCLUDE'
  columns: string[]
  expression?: string
  references?: {
    table: string
    columns: string[]
  }
}

export type DatabaseSchema = Record<string, TableDefinition>

export interface DatabaseClient {
  from<T = unknown>(table: string): QueryBuilder<T>
  table<T = unknown>(table: string): QueryBuilder<T>
  rpc<T>(functionName: string, params?: Record<string, unknown>): Promise<T>
}

export type RealtimeCallback = (...args: unknown[]) => void

export interface StorageClient {
  from(bucket: string): {
    upload(path: string, file: File): Promise<{ data: { path: string }; error: null }>
    download(path: string): Promise<{ data: Blob; error: null }>
    list(prefix?: string): Promise<{ data: { path: string }[]; error: null }>
    remove(paths: string[]): Promise<{ data: unknown; error: null }>
    getPublicUrl(path: string): { data: { publicUrl: string } }
  }
}

export interface AuthClient {
  signUp(email: string, password: string, options?: { data?: Record<string, unknown> }): Promise<{ user: AuthUser; session: AuthSession }>
  signIn(email: string, password: string): Promise<{ user: AuthUser; session: AuthSession }>
  signOut(): Promise<{ error: null }>
  getCurrentUser(): Promise<AuthUser | null>
  getSession(): Promise<AuthSession | null>
  onAuthStateChange(callback: (event: string, session: AuthSession | null) => void): { data: { subscription: { unsubscribe: () => void } } }
}

export interface RealtimeClient {
  channel(channelName: string): RealtimeChannel
  connect(): void
  disconnect(): void
}

export interface RealtimeChannel {
  on(event: string, callback: RealtimeCallback): RealtimeChannel
  subscribe(): RealtimeChannel
  unsubscribe(): void
  send(message: Record<string, unknown>): RealtimeChannel
}

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
  role?: string
  created_at?: string
}

export interface AuthSession {
  access_token: string
  refresh_token?: string
  expires_at?: number
  user?: AuthUser
}

export type DatabaseSchema = Record<string, TableDefinition>
