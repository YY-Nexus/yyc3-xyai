// Supabase数据库客户端封装
// 为未来集成Supabase做准备，提供统一的数据访问接口

import type { Child, GrowthRecord, Assessment, Milestone, StorageKey } from "./client"
import type {
  DatabaseClient,
  RealtimeCallback,
  QueryBuilder,
  StorageClient,
  AuthClient,
  RealtimeClient
} from "@/types/database"

// 认证用户类型
interface AuthUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
  role?: string
  created_at?: string
}

// 认证会话类型
interface AuthSession {
  access_token: string
  refresh_token?: string
  expires_at?: number
  user?: AuthUser
}

// Supabase配置类型
interface SupabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

// 查询过滤器类型
interface QueryFilter {
  column: string
  operator: string
  value: string | number | boolean | string[]
}

// 认证选项类型
interface SignUpOptions {
  data?: Record<string, unknown>
  emailRedirectTo?: string
}

// 认证响应类型
interface AuthResponse {
  user: AuthUser
  session: AuthSession
}

// 实时频道类型
interface RealtimeChannel {
  on: (event: string, callback: (...args: unknown[]) => void) => RealtimeChannel
  subscribe: () => RealtimeChannel
  unsubscribe: () => void
  send: (message: Record<string, unknown>) => RealtimeChannel
}

// 查询构建器实现
class MockQueryBuilder<T = unknown> implements QueryBuilder<T> {
  private query: {
    table: string
    columns?: string
    filters: QueryFilter[]
    orderBy?: {column: string, ascending: boolean}
    limitCount?: number
    offsetCount?: number
    rangeFrom?: number
    rangeTo?: number
  } = {
    table: '',
    filters: []
  }

  constructor(table: string) {
    this.query.table = table
  }

  select(columns?: string): QueryBuilder<T> {
    this.query.columns = columns
    return this
  }

  from(table: string): QueryBuilder<T> {
    this.query.table = table
    return this
  }

  where(column: string, operator: string, value: string | number | boolean | string[]): QueryBuilder<T> {
    this.query.filters.push({ column, operator, value })
    return this
  }

  whereIn(column: string, values: string[]): QueryBuilder<T> {
    this.query.filters.push({ column, operator: 'in', value: values })
    return this
  }

  orderBy(column: string, ascending = true): QueryBuilder<T> {
    this.query.orderBy = { column, ascending }
    return this
  }

  limit(count: number): QueryBuilder<T> {
    this.query.limitCount = count
    return this
  }

  offset(count: number): QueryBuilder<T> {
    this.query.offsetCount = count
    return this
  }

  range(from: number, to: number): QueryBuilder<T> {
    this.query.rangeFrom = from
    this.query.rangeTo = to
    return this
  }

  single(): Promise<T | null> {
    return Promise.resolve(null)
  }

  maybeSingle(): Promise<T | null> {
    return Promise.resolve(null)
  }

  execute(): Promise<T[]> {
    return Promise.resolve([])
  }
}

// 存储客户端实现
class MockStorageClient implements StorageClient {
  upload(bucket: string, path: string, file: File): Promise<string> {
    return Promise.resolve(`/storage/${bucket}/${path}`)
  }

  download(bucket: string, path: string): Promise<Blob> {
    return Promise.resolve(new Blob())
  }

  remove(bucket: string, paths: string[]): Promise<void> {
    return Promise.resolve()
  }

  getPublicUrl(bucket: string, path: string): string {
    return `/storage/${bucket}/${path}`
  }

  list(bucket: string, path?: string): Promise<{ name: string; size: number }[]> {
    return Promise.resolve([])
  }
}

// 认证客户端实现
class MockAuthClient implements AuthClient {
  signUp(email: string, password: string, options?: SignUpOptions): Promise<AuthResponse> {
    return Promise.resolve({
      user: { id: crypto.randomUUID(), email },
      session: { access_token: 'mock-token' }
    })
  }

  signIn(email: string, password: string): Promise<AuthResponse> {
    return Promise.resolve({
      user: { id: crypto.randomUUID(), email },
      session: { access_token: 'mock-token' }
    })
  }

  signOut(): Promise<void> {
    return Promise.resolve()
  }

  getCurrentUser(): Promise<AuthUser | null> {
    return Promise.resolve(null)
  }

  getSession(): Promise<AuthSession | null> {
    return Promise.resolve(null)
  }

  updateUser(attributes: Record<string, unknown>): Promise<AuthUser> {
    return Promise.resolve({} as AuthUser)
  }

  resetPasswordForEmail(email: string): Promise<void> {
    return Promise.resolve()
  }

  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void {
    return () => {}
  }
}

// 实时客户端实现
class MockRealtimeClient implements RealtimeClient {
  private channels = new Map<string, RealtimeChannel>()

  channel(channelName: string): RealtimeChannel {
    let channel = this.channels.get(channelName)
    if (!channel) {
      const newChannel: RealtimeChannel = {
        on: (event, callback) => {
          const existingChannel = this.channels.get(channelName)
          if (existingChannel) {
            return existingChannel.on(event, callback)
          }
          return newChannel
        },
        subscribe: () => {
          const existingChannel = this.channels.get(channelName)
          if (existingChannel) {
            return existingChannel.subscribe()
          }
          return newChannel
        },
        unsubscribe: () => {},
        send: (message) => {
          const existingChannel = this.channels.get(channelName)
          if (existingChannel) {
            return existingChannel.send(message)
          }
          return newChannel
        }
      }
      channel = newChannel
      this.channels.set(channelName, channel)
    }
    return channel
  }

  async connect(): Promise<void> {
    return Promise.resolve()
  }

  disconnect(): void {
    this.channels.clear()
  }
}

// 模拟Supabase客户端（开发环境）
class MockSupabaseClient implements DatabaseClient {
  private storage = new Map<string, unknown[]>()
  private currentUser: AuthUser | null = null
  private currentSession: AuthSession | null = null
  private authListeners: ((session: AuthSession | null) => void)[] = []
  private realtimeListeners: Map<string, RealtimeCallback<unknown>[]> = new Map()

  // 服务实例
  public readonly storage: StorageClient = new MockStorageClient()
  public readonly auth: AuthClient = new MockAuthClient()
  public readonly realtime: RealtimeClient = new MockRealtimeClient()

  constructor() {
    // 从localStorage恢复会话
    if (typeof window !== "undefined") {
      const savedSession = localStorage.getItem("yyc3_auth_session")
      if (savedSession) {
        try {
          const parsedSession = JSON.parse(savedSession) as Partial<AuthSession>
          if (parsedSession.access_token) {
            this.currentSession = parsedSession as AuthSession
            this.currentUser = parsedSession.user || null
          }
        } catch {
          // 忽略解析错误
        }
      }
    }
  }

  // 基础查询方法
  findMany<T>(table: string, filter?: (item: T) => boolean): Promise<T[]> {
    const collection = this.getCollection<T>(table)
    return Promise.resolve(filter ? collection.filter(filter) : collection)
  }

  findOne<T extends { id: string }>(table: string, id: string): Promise<T | null> {
    const collection = this.getCollection<T>(table)
    return Promise.resolve(collection.find((item) => item.id === id) || null)
  }

  findFirst<T>(table: string, filter: (item: T) => boolean): Promise<T | null> {
    const collection = this.getCollection<T>(table)
    return Promise.resolve(collection.find(filter) || null)
  }

  // 数据修改方法
  create<T extends { id?: string; created_at?: string }>(
    table: string,
    data: Omit<T, 'id' | 'created_at'>
  ): Promise<T> {
    const collection = this.getCollection<T>(table)
    const newItem = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    } as T
    collection.push(newItem)
    this.setCollection(table, collection)
    return Promise.resolve(newItem)
  }

  createMany<T extends { id?: string; created_at?: string }>(
    table: string,
    dataArray: Omit<T, 'id' | 'created_at'>[]
  ): Promise<T[]> {
    const collection = this.getCollection<T>(table)
    const newItems = dataArray.map((data) => ({
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    })) as T[]
    collection.push(...newItems)
    this.setCollection(table, collection)
    return Promise.resolve(newItems)
  }

  update<T extends { id: string; updated_at?: string }>(
    table: string,
    id: string,
    data: Partial<Omit<T, 'id'>>
  ): Promise<T | null> {
    const collection = this.getCollection<T>(table)
    const index = collection.findIndex((item) => item.id === id)
    if (index === -1) return Promise.resolve(null)

    collection[index] = {
      ...collection[index],
      ...data,
      updated_at: new Date().toISOString(),
    }
    this.setCollection(table, collection)
    return Promise.resolve(collection[index])
  }

  async upsert<T extends { id: string; created_at?: string; updated_at?: string }>(
    table: string,
    id: string,
    data: Omit<T, 'id' | 'created_at' | 'updated_at'>
  ): Promise<T> {
    const existing = await this.findOne<T>(table, id)
    if (existing) {
      return (await this.update<T>(table, id, data as Partial<Omit<T, 'id'>>)) as T
    }
    return this.create<T>(table, { ...data, id } as Omit<T, 'id' | 'created_at'>)
  }

  delete(table: string, id: string): Promise<boolean> {
    const collection = this.getCollection<{ id: string }>(table)
    const filtered = collection.filter((item) => item.id !== id)
    if (filtered.length === collection.length) return Promise.resolve(false)
    this.setCollection(table, filtered)
    return Promise.resolve(true)
  }

  deleteMany(table: string, ids: string[]): Promise<number> {
    const collection = this.getCollection<{ id: string }>(table)
    const filtered = collection.filter((item) => !ids.includes(item.id))
    const deletedCount = collection.length - filtered.length
    this.setCollection(table, filtered)
    return Promise.resolve(deletedCount)
  }

  // 聚合和统计方法
  count(table: string, filter?: (item: unknown) => boolean): Promise<number> {
    const collection = this.getCollection<unknown>(table)
    return Promise.resolve(filter ? collection.filter(filter).length : collection.length)
  }

  aggregate(table: string, aggregator: (items: unknown[]) => unknown): Promise<unknown> {
    const collection = this.getCollection<unknown>(table)
    return Promise.resolve(aggregator(collection))
  }

  paginate<T>(
    table: string,
    options: {
      page: number
      pageSize: number
      filter?: (item: T) => boolean
      sort?: (a: T, b: T) => number
    }
  ): Promise<{ data: T[]; total: number; totalPages: number }> {
    let collection = this.getCollection<T>(table)

    if (options.filter) {
      collection = collection.filter(options.filter)
    }

    if (options.sort) {
      collection = collection.sort(options.sort)
    }

    const total = collection.length
    const totalPages = Math.ceil(total / options.pageSize)
    const start = (options.page - 1) * options.pageSize
    const data = collection.slice(start, start + options.pageSize)

    return Promise.resolve({ data, total, totalPages })
  }

  // 查询构建器
  from<T = unknown>(table: string): QueryBuilder<T> {
    return new MockQueryBuilder<T>(table)
  }

  // RPC 调用
  rpc<T>(functionName: string, params?: Record<string, unknown>): Promise<T> {
    return Promise.resolve({} as T)
  }

  // 私有方法
  private getCollection<T>(table: string): T[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(`yyc3_${table}`)
    return data ? (JSON.parse(data) as T[]) : []
  }

  private setCollection(table: string, data: unknown[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(`yyc3_${table}`, JSON.stringify(data))
  }

  // 初始化模拟数据
  seedMockData(): Promise<void> {
    if (typeof window === "undefined") return Promise.resolve()

    const hasData = localStorage.getItem("yyc3_initialized")
    if (hasData) return Promise.resolve()

    // 创建模拟用户
    const mockUser = {
      id: "user-001",
      email: "parent@example.com",
      name: "张女士",
      avatar_url: "/placeholder.svg?height=100&width=100",
      role: "parent",
      created_at: new Date().toISOString(),
    }
    localStorage.setItem("yyc3_users", JSON.stringify([mockUser]))

    // 创建模拟儿童档案
    const mockChild: Child = {
      id: "child-001",
      user_id: "user-001",
      name: "小语",
      nickname: "小语",
      birth_date: "2018-09-15",
      gender: "female",
      avatar_url: "/placeholder.svg?height=100&width=100",
      current_stage: "6-9岁学术奠基期",
      created_at: new Date().toISOString(),
    }
    localStorage.setItem("yyc3_children", JSON.stringify([mockChild]))

    localStorage.setItem("yyc3_initialized", "true")
    return Promise.resolve()
  }

  // 清除所有数据
  clearAll(): Promise<void> {
    if (typeof window === "undefined") return Promise.resolve()
    const keys: StorageKey[] = [
      "users",
      "children",
      "growth_records",
      "growth_assessments",
      "ai_conversations",
      "homework_tasks",
      "courses",
      "milestones",
      "stage_transitions",
    ]
    keys.forEach((key) => {
      localStorage.removeItem(`yyc3_${key}`)
    })
    localStorage.removeItem("yyc3_initialized")
    return Promise.resolve()
  }

  // 导出所有数据
  exportData(): Promise<Record<string, unknown[]>> {
    const keys: StorageKey[] = [
      "users",
      "children",
      "growth_records",
      "growth_assessments",
      "ai_conversations",
      "homework_tasks",
      "courses",
      "milestones",
    ]
    const data: Record<string, unknown[]> = {}
    keys.forEach((key) => {
      data[key] = this.getCollection(key)
    })
    return Promise.resolve(data)
  }

  // 导入数据
  importData(data: Record<string, unknown[]>): Promise<void> {
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        this.setCollection(key, value)
      }
    })
    return Promise.resolve()
  }
}

// 导出客户端实例
export const supabase = new MockSupabaseClient()

// 导出类型
export type { AuthUser, AuthSession, RealtimeCallback }
export { MockSupabaseClient }
