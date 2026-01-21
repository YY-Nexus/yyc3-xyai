import { Badge, BadgeFilter, BadgeStats, BadgeUserProgress, BadgeUnlockEvent, BadgeSeries, BadgeCategory, BadgeRarity, BadgeLevel } from '../types/badge';
import { allBadges, badgeGroups, mockUserProgress } from '../data/badgeMockData';

export class BadgeService {
  private static instance: BadgeService;
  private badges: Map<string, Badge> = new Map();
  private userProgress: BadgeUserProgress;
  private unlockHistory: BadgeUnlockEvent[] = [];

  private constructor() {
    this.initializeBadges();
    this.userProgress = mockUserProgress;
    this.loadUserProgress();
  }

  static getInstance(): BadgeService {
    if (!BadgeService.instance) {
      BadgeService.instance = new BadgeService();
    }
    return BadgeService.instance;
  }

  private initializeBadges(): void {
    allBadges.forEach(badge => {
      this.badges.set(badge.id, badge);
    });
  }

  private loadUserProgress(): void {
    const stored = localStorage.getItem('badgeUserProgress');
    if (stored) {
      this.userProgress = JSON.parse(stored);
    }
  }

  private saveUserProgress(): void {
    localStorage.setItem('badgeUserProgress', JSON.stringify(this.userProgress));
  }

  public getAllBadges(): Badge[] {
    return Array.from(this.badges.values());
  }

  public getBadgeById(id: string): Badge | undefined {
    return this.badges.get(id);
  }

  public getBadgesByFilter(filter: BadgeFilter): Badge[] {
    let badges = this.getAllBadges();
    const earnedIds = this.userProgress.earnedBadges;
    
    // Apply filters sequentially
    if (filter.series) {
      badges = badges.filter(b => b.series === filter.series);
    }

    if (filter.category) {
      badges = badges.filter(b => b.category === filter.category);
    }

    if (filter.rarity) {
      badges = badges.filter(b => b.rarity === filter.rarity);
    }

    if (filter.level) {
      badges = badges.filter(b => b.level === filter.level);
    }

    if (filter.status) {
      if (filter.status === 'earned') {
        badges = badges.filter(b => earnedIds.includes(b.id));
      } else if (filter.status === 'unearned') {
        badges = badges.filter(b => !earnedIds.includes(b.id));
      }
    }

    if (filter.tags && filter.tags.length > 0) {
      const tagSet = new Set(filter.tags.map(tag => tag.toLowerCase()));
      badges = badges.filter(b => {
        const badgeTags = (b.metadata.tags || []).map(tag => tag.toLowerCase());
        return badgeTags.some(tag => tagSet.has(tag));
      });
    }

    if (filter.minPoints !== undefined || filter.maxPoints !== undefined) {
      badges = badges.filter(b => {
        const points = b.metadata.points;
        return (!filter.minPoints || points >= filter.minPoints) &&
               (!filter.maxPoints || points <= filter.maxPoints);
      });
    }

    if (filter.earnedDateStart || filter.earnedDateEnd) {
      badges = badges.filter(b => {
        if (!earnedIds.includes(b.id)) return false;
        
        const earnedDate = new Date(b.metadata.earnedDate || 0);
        return (!filter.earnedDateStart || earnedDate >= filter.earnedDateStart) &&
               (!filter.earnedDateEnd || earnedDate <= filter.earnedDateEnd);
      });
    }

    if (filter.search) {
      badges = this.searchBadges(filter.search, { fuzzy: true, fields: ['title', 'description', 'tags'] });
    }

    return badges;
  }

  public getBadgeStats(): BadgeStats {
    const earnedIds = this.userProgress.earnedBadges;
    const earnedBadges = earnedIds.map(id => this.badges.get(id)).filter(Boolean) as Badge[];

    const stats: BadgeStats = {
      total: this.badges.size,
      earned: earnedIds.length,
      bySeries: {} as Record<BadgeSeries, number>,
      byCategory: {} as Record<BadgeCategory, number>,
      byRarity: {} as Record<BadgeRarity, number>,
      byLevel: {} as Record<BadgeLevel, number>,
      totalPoints: this.userProgress.totalPoints,
      recentBadges: earnedBadges.slice(-5)
    };

    earnedBadges.forEach(badge => {
      stats.bySeries[badge.series] = (stats.bySeries[badge.series] || 0) + 1;
      stats.byCategory[badge.category] = (stats.byCategory[badge.category] || 0) + 1;
      stats.byRarity[badge.rarity] = (stats.byRarity[badge.rarity] || 0) + 1;
      stats.byLevel[badge.level] = (stats.byLevel[badge.level] || 0) + 1;
    });

    return stats;
  }

  public getBadgeProgress(badgeId: string): number {
    return this.userProgress.badgeProgress[badgeId] || 0;
  }

  public isBadgeEarned(badgeId: string): boolean {
    return this.userProgress.earnedBadges.includes(badgeId);
  }

  public async unlockBadge(badgeId: string): Promise<Badge | null> {
    const badge = this.badges.get(badgeId);
    if (!badge) {
      throw new Error(`Badge not found: ${badgeId}`);
    }

    if (this.isBadgeEarned(badgeId)) {
      return null;
    }

    const canUnlock = await this.checkUnlockConditions(badge);
    if (!canUnlock) {
      throw new Error('Unlock conditions not met');
    }

    this.userProgress.earnedBadges.push(badgeId);
    this.userProgress.badgeProgress[badgeId] = 100;
    this.userProgress.totalPoints += badge.metadata.points;

    const unlockEvent: BadgeUnlockEvent = {
      badgeId,
      userId: this.userProgress.userId,
      timestamp: Date.now(),
      conditionsMet: badge.unlockConditions
    };

    this.unlockHistory.push(unlockEvent);
    this.saveUserProgress();

    return badge;
  }

  private async checkUnlockConditions(badge: Badge): Promise<boolean> {
    const progress = this.getBadgeProgress(badgeId);

    for (const condition of badge.unlockConditions) {
      const current = await this.getConditionValue(condition.type);
      if (current < condition.value) {
        return false;
      }
    }

    return true;
  }

  private async getConditionValue(type: string): Promise<number> {
    switch (type) {
      case 'total_hours':
        return 45;
      case 'consecutive_days':
        return 5;
      case 'completed_courses':
        return 8;
      case 'creations':
        return 2;
      case 'interactions':
        return 10;
      case 'score':
        return 85;
      case 'perfect_score':
        return 2;
      case 'streak':
        return 15;
      case 'cultural_sites_visited':
        return 3;
      default:
        return 0;
    }
  }

  public updateBadgeProgress(badgeId: string, progress: number): void {
    this.userProgress.badgeProgress[badgeId] = progress;
    this.saveUserProgress();
  }

  public getUnlockHistory(): BadgeUnlockEvent[] {
    return this.unlockHistory;
  }

  public getBadgeGroups() {
    return badgeGroups.map(group => ({
      ...group,
      earnedCount: group.badges.filter(id => this.isBadgeEarned(id)).length,
      progress: group.badges.filter(id => this.isBadgeEarned(id)).length / group.badgeCount
    }));
  }

  public searchBadges(query: string, options: { fuzzy?: boolean; fields?: ('title' | 'description' | 'tags')[] } = {}): Badge[] {
    if (!query.trim()) return this.getAllBadges();
    
    const searchLower = query.toLowerCase();
    const fields = options.fields || ['title', 'description', 'tags'];
    
    return this.getAllBadges().filter(badge => {
      const badgeData = {
        title: badge.title.toLowerCase(),
        description: badge.description.toLowerCase(),
        tags: (badge.metadata.tags || []).map(tag => tag.toLowerCase())
      };
      
      return fields.some(field => {
        if (field === 'tags') {
          return badgeData.tags.some(tag => options.fuzzy 
            ? this.fuzzyMatch(tag, searchLower) 
            : tag.includes(searchLower)
          );
        } else {
          const fieldValue = badgeData[field as keyof typeof badgeData] as string;
          return options.fuzzy 
            ? this.fuzzyMatch(fieldValue, searchLower) 
            : fieldValue.includes(searchLower);
        }
      });
    });
  }

  private fuzzyMatch(str: string, pattern: string): boolean {
    let i = 0;
    let j = 0;
    
    while (i < str.length && j < pattern.length) {
      if (str[i] === pattern[j]) {
        j++;
      }
      i++;
    }
    
    return j === pattern.length;
  }

  public getEarnedBadges(): Badge[] {
    const earnedIds = this.userProgress.earnedBadges;
    return earnedIds.map(id => this.badges.get(id)).filter(Boolean) as Badge[];
  }

  public getUnearnedBadges(): Badge[] {
    const earnedIds = this.userProgress.earnedBadges;
    return this.getAllBadges().filter(b => !earnedIds.includes(b.id));
  }

  public getBadgesBySeries(series: BadgeSeries): Badge[] {
    return this.getAllBadges().filter(b => b.series === series);
  }

  public getBadgesByCategory(category: BadgeCategory): Badge[] {
    return this.getAllBadges().filter(b => b.category === category);
  }

  public getBadgesByRarity(rarity: BadgeRarity): Badge[] {
    return this.getAllBadges().filter(b => b.rarity === rarity);
  }

  public getBadgesByLevel(level: BadgeLevel): Badge[] {
    return this.getAllBadges().filter(b => b.level === level);
  }

  public resetUserProgress(): void {
    this.userProgress = {
      userId: this.userProgress.userId,
      earnedBadges: [],
      badgeProgress: {},
      totalPoints: 0,
      lastUpdated: new Date().toISOString()
    };
    this.unlockHistory = [];
    this.saveUserProgress();
  }

  public exportUserProgress(): string {
    return JSON.stringify(this.userProgress, null, 2);
  }

  public importUserProgress(data: string): void {
    try {
      const progress = JSON.parse(data);
      this.userProgress = progress;
      this.saveUserProgress();
    } catch (error) {
      throw new Error('Invalid user progress data');
    }
  }
}

export default BadgeService;
