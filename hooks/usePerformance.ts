/**
 * @fileoverview YYC³ AI小语智能成长守护系统 - 性能监控钩子
 * @description 提供性能数据缓存、预加载和性能标记等性能优化功能
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-01-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { useEffect, useCallback, useRef } from "react"
import { cacheManager, preloader, perfMarker } from "@/lib/performance"

// 缓存数据Hook
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: { ttl?: number; revalidate?: boolean } = {},
) {
  const { ttl = 5 * 60 * 1000, revalidate = false } = options
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const getData = useCallback(async (): Promise<T> => {
    // 先检查缓存
    const cached = cacheManager.get<T>(key)
    if (cached && !revalidate) {
      return cached
    }

    // 获取新数据
    const data = await fetcherRef.current()
    cacheManager.set(key, data, ttl)
    return data
  }, [key, ttl, revalidate])

  return { getData, invalidate: () => cacheManager.set(key, null, 0) }
}

// 页面预加载Hook
export function usePagePrefetch(paths: string[]) {
  useEffect(() => {
    // 等待主线程空闲时预加载
    if ("requestIdleCallback" in window) {
      const handle = requestIdleCallback(() => {
        paths.forEach((path) => preloader.prefetch(path))
      })
      return () => cancelIdleCallback(handle)
    } else {
      const timer = setTimeout(() => {
        paths.forEach((path) => preloader.prefetch(path))
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [paths])
}

// 性能追踪Hook
export function usePerformanceTracking(componentName: string) {
  const startMark = `${componentName}_render_start`

  useEffect(() => {
    perfMarker.mark(startMark)

    return () => {
      const duration = perfMarker.logTiming(`${componentName}_render`, startMark)
      if (duration && duration > 100) {
        console.warn(`[Perf Warning] ${componentName} render took ${duration.toFixed(2)}ms`)
      }
    }
  }, [componentName, startMark])
}

// 可见性监听Hook
export function useVisibility(callback: (isVisible: boolean) => void, options: IntersectionObserverInit = {}) {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => callback(entry.isIntersecting), {
      threshold: 0.1,
      ...options,
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [callback, options])

  return elementRef
}

// 延迟加载Hook
export function useDeferredRender(delay = 100) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShouldRender(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return shouldRender
}

import { useState } from "react"
