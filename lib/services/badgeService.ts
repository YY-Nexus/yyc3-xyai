/**
 * @file badgeService.ts
 * @description 勋章系统服务 - 处理勋章相关的业务逻辑
 */

import type {
  Badge,
  BadgeSeries,
  BadgeCategory,
  BadgeStats,
  SeriesProgress,
  BadgeService as BadgeServiceInterface,
} from '@/types';
import {
  allBadges,
  badgeGroups,
  earnedBadgeIds,
} from '@/lib/data/badgeMockData';
// badgeStats is available but not currently used in this implementation

class BadgeService implements BadgeServiceInterface {
  private earnedBadges: Set<string> = new Set(earnedBadgeIds);

  /**
   * 获取所有勋章
   */
  async getAllBadges(): Promise<Badge[]> {
    // 模拟API延迟
    await this.delay(300);
    return allBadges.map(badge => this.enrichBadge(badge));
  }

  /**
   * 根据ID获取勋章
   */
  async getBadgeById(id: string): Promise<Badge | null> {
    await this.delay(200);
    const badge = allBadges.find(b => b.id === id);
    return badge ? this.enrichBadge(badge) : null;
  }

  /**
   * 根据套系获取勋章
   */
  async getBadgesBySeries(series: BadgeSeries): Promise<Badge[]> {
    await this.delay(250);
    return allBadges
      .filter(badge => badge.series === series)
      .map(badge => this.enrichBadge(badge));
  }

  /**
   * 根据分类获取勋章
   */
  async getBadgesByCategory(category: BadgeCategory): Promise<Badge[]> {
    await this.delay(250);
    return allBadges
      .filter(badge => badge.category === category)
      .map(badge => this.enrichBadge(badge));
  }

  /**
   * 获取已获得的勋章
   */
  async getEarnedBadges(): Promise<Badge[]> {
    await this.delay(300);
    return allBadges
      .filter(badge => this.earnedBadges.has(badge.id))
      .map(badge => ({
        ...badge,
        earnedDate: '2024-01-15', // 模拟获得日期
        progress: 100,
      }));
  }

  /**
   * 获取隐藏勋章
   */
  async getHiddenBadges(): Promise<Badge[]> {
    await this.delay(200);
    return allBadges
      .filter(badge => badge.isHidden)
      .map(badge => ({
        ...badge,
        title: '???',
        description: badge.hiddenDescription || '???',
        icon: '/badges/hidden/locked.png',
      }));
  }

  /**
   * 解锁勋章
   */
  async unlockBadge(id: string): Promise<Badge> {
    await this.delay(500);

    const badge = allBadges.find(b => b.id === id);
    if (!badge) {
      throw new Error(`Badge ${id} not found`);
    }

    // 检查前置条件
    if (
      badge.prerequisiteBadge &&
      !this.earnedBadges.has(badge.prerequisiteBadge)
    ) {
      throw new Error(
        `Prerequisite badge ${badge.prerequisiteBadge} not earned`
      );
    }

    // 检查解锁条件
    const { canUnlock } = await this.checkUnlockConditions(badge);
    if (!canUnlock) {
      throw new Error('Unlock conditions not met');
    }

    // 解锁勋章
    this.earnedBadges.add(id);

    return {
      ...badge,
      earnedDate: new Date().toISOString(),
      progress: 100,
    };
  }

  /**
   * 检查解锁条件
   */
  async checkUnlockConditions(
    badge: Badge
  ): Promise<{ canUnlock: boolean; progress: number }> {
    await this.delay(200);

    // 如果已经解锁，直接返回
    if (this.earnedBadges.has(badge.id)) {
      return { canUnlock: true, progress: 100 };
    }

    // 模拟进度计算
    const totalConditions = badge.unlockConditions.length;
    const metConditions = Math.floor(Math.random() * totalConditions);
    const progress = Math.floor((metConditions / totalConditions) * 100);

    return {
      canUnlock: progress === 100,
      progress,
    };
  }

  /**
   * 获取勋章统计
   */
  async getBadgeStats(): Promise<BadgeStats> {
    await this.delay(300);

    const earned = await this.getEarnedBadges();

    return {
      total: allBadges.length,
      earned: earned.length,
      bySeries: this.calculateBySeries(earned),
      byCategory: this.calculateByCategory(earned),
      byRarity: this.calculateByRarity(earned),
      byLevel: this.calculateByLevel(earned),
      totalPoints: earned.reduce((sum, b) => sum + b.metadata.points, 0),
      ranking: 156,
      recentBadges: earned.slice(-5).reverse(),
    };
  }

  /**
   * 获取套系进度
   */
  async getSeriesProgress(series: BadgeSeries): Promise<SeriesProgress> {
    await this.delay(250);

    const group = badgeGroups.find(g => g.id === series);
    if (!group) {
      throw new Error(`Series ${series} not found`);
    }

    const earnedInSeries = await this.getBadgesBySeries(series);
    const earnedBadgesInSeries = earnedInSeries.filter(b =>
      this.earnedBadges.has(b.id)
    );

    const progressPercentage =
      (earnedBadgesInSeries.length / group.badgeCount) * 100;

    return {
      seriesId: series,
      totalBadges: group.badgeCount,
      earnedBadges: earnedBadgesInSeries.length,
      currentLevel: this.getCurrentLevel(progressPercentage),
      progressPercentage,
      milestones: [
        {
          level: 'bronze',
          requiredBadges: 1,
          reward: { type: 'points', value: 100, description: '100积分' },
          unlocked: earnedBadgesInSeries.length >= 1,
        },
        {
          level: 'silver',
          requiredBadges: Math.ceil(group.badgeCount * 0.33),
          reward: { type: 'points', value: 300, description: '300积分' },
          unlocked:
            earnedBadgesInSeries.length >= Math.ceil(group.badgeCount * 0.33),
        },
        {
          level: 'gold',
          requiredBadges: Math.ceil(group.badgeCount * 0.66),
          reward: {
            type: 'title',
            value: `${group.name}大师`,
            description: '专属称号',
          },
          unlocked:
            earnedBadgesInSeries.length >= Math.ceil(group.badgeCount * 0.66),
        },
        {
          level: 'platinum',
          requiredBadges: group.badgeCount,
          reward: {
            type: 'badge',
            value: `${series}_master`,
            description: '大师徽章',
          },
          unlocked: earnedBadgesInSeries.length >= group.badgeCount,
        },
      ],
    };
  }

  /**
   * 搜索勋章
   */
  async searchBadges(query: string): Promise<Badge[]> {
    await this.delay(300);
    void query; // Currently unused, will be used in future implementation

    return allBadges
      .filter(
        badge =>
          badge.title.toLowerCase().includes(query.toLowerCase()) ||
          badge.description.toLowerCase().includes(query.toLowerCase()) ||
          badge.series.includes(query.toLowerCase() as BadgeSeries)
      )
      .map(badge => this.enrichBadge(badge));
  }

  /**
   * 获取勋章套系组
   */
  async getBadgeGroups() {
    await this.delay(200);
    return badgeGroups;
  }

  // ========== 私有辅助方法 ==========

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private enrichBadge(badge: Badge): Badge {
    const isEarned = this.earnedBadges.has(badge.id);

    return {
      ...badge,
      progress: isEarned ? 100 : Math.floor(Math.random() * 80),
      earnedDate: isEarned ? '2024-01-15' : undefined,
    };
  }

  private calculateBySeries(earned: Badge[]): Record<BadgeSeries, number> {
    const result: Partial<Record<BadgeSeries, number>> = {};
    earned.forEach(badge => {
      result[badge.series] = (result[badge.series] || 0) + 1;
    });
    return result as Record<BadgeSeries, number>;
  }

  private calculateByCategory(earned: Badge[]): Record<BadgeCategory, number> {
    const result: Partial<Record<BadgeCategory, number>> = {};
    earned.forEach(badge => {
      result[badge.category] = (result[badge.category] || 0) + 1;
    });
    return result as Record<BadgeCategory, number>;
  }

  private calculateByRarity(earned: Badge[]): Record<string, number> {
    const result: Record<string, number> = {};
    earned.forEach(badge => {
      result[badge.rarity] = (result[badge.rarity] || 0) + 1;
    });
    return result;
  }

  private calculateByLevel(earned: Badge[]): Record<string, number> {
    const result: Record<string, number> = {};
    earned.forEach(badge => {
      result[badge.level] = (result[badge.level] || 0) + 1;
    });
    return result;
  }

  private getCurrentLevel(progress: number): import('@/types').BadgeLevel {
    if (progress >= 100) return 'legend';
    if (progress >= 75) return 'diamond';
    if (progress >= 50) return 'platinum';
    if (progress >= 25) return 'gold';
    return 'silver';
  }
}

// 导出单例实例
export const badgeService = new BadgeService();
