/**
 * @file 通用类型定义
 * @description 项目中共享的TypeScript类型定义
 * @module types/common
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-29
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

export interface Message {
  id: string | number
  role: 'user' | 'assistant'
  content: string
  avatar?: string
  name?: string
  timestamp: number
}

export type UUID = string

export type Timestamp = number

export type UserRole = 'parent' | 'child' | 'admin'

export interface User {
  id: string
  name: string
  role: UserRole
  avatar?: string
  email?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: ResponseMeta
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
  stack?: string
}

export interface ResponseMeta {
  page?: number
  pageSize?: number
  total?: number
  totalPages?: number
}

export interface MediaFile {
  id: string
  type: 'image' | 'video' | 'audio' | 'document'
  url: string
  thumbnailUrl?: string
  size: number
  mimeType: string
  fileName: string
  uploadedAt: Date
}

export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface DateRange {
  startDate: Date
  endDate: Date
}

export type SortOrder = 'asc' | 'desc'

export type Status = 'active' | 'inactive' | 'pending' | 'deleted'

export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface AuditableEntity extends BaseEntity {
  createdBy?: string
  updatedBy?: string
}

export type Environment = 'development' | 'production' | 'test'

export interface Config {
  env: Environment
  apiUrl: string
  websocketUrl: string
  features: Record<string, boolean>
}

export interface ValidationError {
  field: string
  message: string
  code?: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export function getCurrentTimestamp(): number {
  return Date.now()
}

export function getRandomDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getRandomIndex(length: number): number {
  return Math.floor(Math.random() * length)
}

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null
}

export function isNotNull<T>(value: T | null): value is T {
  return value !== null
}

export function isNotEmpty<T>(value: T | '' | []): value is T {
  return value !== '' && !Array.isArray(value) || (Array.isArray(value) && value.length > 0)
}
