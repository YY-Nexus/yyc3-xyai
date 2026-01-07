/**
 * @file YYC³ 国际化Hook
 * @description 提供类型安全的国际化翻译功能，支持多语言切换和便捷翻译方法
 * @module hooks
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-28
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { useTranslations, useLocale } from 'next-intl';
import { useMemo } from 'react';

// 类型化的翻译键
type TranslationKey =
  | 'common.loading'
  | 'common.error'
  | 'common.success'
  | 'common.cancel'
  | 'common.confirm'
  | 'common.save'
  | 'common.edit'
  | 'common.delete'
  | 'common.retry'
  | 'common.refresh'
  | 'navigation.home'
  | 'navigation.homework'
  | 'navigation.growth'
  | 'navigation.courses'
  | 'navigation.books'
  | 'navigation.profile'
  | 'navigation.settings'
  | 'home.greeting'
  | 'home.learningAssistant'
  | 'home.tagline'
  | 'home.todayPlan'
  | 'home.startHomework'
  | 'home.homeworkCenter'
  | 'home.homeworkSubtitle'
  | 'growth.title'
  | 'growth.subtitle'
  | 'courses.title'
  | 'courses.subtitle'
  | 'homework.title'
  | 'homework.subtitle'
  | 'books.title'
  | 'books.subtitle'
  | 'ai.assistant'
  | 'ai.companion'
  | 'emotion.title'
  | 'performance.title'
  | 'errors.networkError'
  | 'errors.pageError'
  | 'settings.title'
  | 'language.switch';

export function useTypedTranslation() {
  const t = useTranslations();
  const locale = useLocale();

  const typedT = useMemo(() => {
    return (key: TranslationKey, values?: Record<string, string | number>) => {
      return t(key, values);
    };
  }, [t]);

  return {
    t: typedT,
    locale,
    // 便捷方法
    tc: (key: string) => t(`common.${key}`),
    tn: (key: string) => t(`navigation.${key}`),
    th: (key: string) => t(`home.${key}`),
    tg: (key: string) => t(`growth.${key}`),
    tcr: (key: string) => t(`courses.${key}`),
    thw: (key: string) => t(`homework.${key}`),
    tb: (key: string) => t(`books.${key}`),
    tai: (key: string) => t(`ai.${key}`),
    te: (key: string) => t(`emotion.${key}`),
    tp: (key: string) => t(`performance.${key}`),
    ter: (key: string) => t(`errors.${key}`),
    ts: (key: string) => t(`settings.${key}`),
    tl: (key: string) => t(`language.${key}`),
  };
}

export default useTypedTranslation;
