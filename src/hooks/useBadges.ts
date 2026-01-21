import { useState, useEffect, useCallback } from 'react';
import { Badge, BadgeFilter, BadgeStats, BadgeUserProgress, BadgeUnlockEvent } from '../types/badge';
import BadgeService from '../services/badgeService';

export const useBadges = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const badgeService = BadgeService.getInstance();

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allBadges = badgeService.getAllBadges();
      setBadges(allBadges);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load badges'));
    } finally {
      setIsLoading(false);
    }
  }, [badgeService]);

  const getBadgeById = useCallback((id: string): Badge | undefined => {
    return badgeService.getBadgeById(id);
  }, [badgeService]);

  const getBadgesByFilter = useCallback((filter: BadgeFilter): Badge[] => {
    return badgeService.getBadgesByFilter(filter);
  }, [badgeService]);

  const getBadgeStats = useCallback((): BadgeStats => {
    return badgeService.getBadgeStats();
  }, [badgeService]);

  const getBadgeProgress = useCallback((badgeId: string): number => {
    return badgeService.getBadgeProgress(badgeId);
  }, [badgeService]);

  const isBadgeEarned = useCallback((badgeId: string): boolean => {
    return badgeService.isBadgeEarned(badgeId);
  }, [badgeService]);

  const unlockBadge = useCallback(async (badgeId: string): Promise<Badge | null> => {
    try {
      const unlockedBadge = await badgeService.unlockBadge(badgeId);
      if (unlockedBadge) {
        setBadges(badgeService.getAllBadges());
      }
      return unlockedBadge;
    } catch (err) {
      throw err;
    }
  }, [badgeService]);

  const updateBadgeProgress = useCallback((badgeId: string, progress: number): void => {
    badgeService.updateBadgeProgress(badgeId, progress);
  }, [badgeService]);

  const getUnlockHistory = useCallback((): BadgeUnlockEvent[] => {
    return badgeService.getUnlockHistory();
  }, [badgeService]);

  const searchBadges = useCallback((query: string): Badge[] => {
    return badgeService.searchBadges(query);
  }, [badgeService]);

  const getEarnedBadges = useCallback((): Badge[] => {
    return badgeService.getEarnedBadges();
  }, [badgeService]);

  const getUnearnedBadges = useCallback((): Badge[] => {
    return badgeService.getUnearnedBadges();
  }, [badgeService]);

  const getBadgeGroups = useCallback(() => {
    return badgeService.getBadgeGroups();
  }, [badgeService]);

  const getUserProgress = useCallback((): BadgeUserProgress => {
    return badgeService.exportUserProgress() as any;
  }, [badgeService]);

  const exportUserProgress = useCallback((): string => {
    return badgeService.exportUserProgress();
  }, [badgeService]);

  const importUserProgress = useCallback((data: string): void => {
    badgeService.importUserProgress(data);
    setBadges(badgeService.getAllBadges());
  }, [badgeService]);

  const resetUserProgress = useCallback((): void => {
    badgeService.resetUserProgress();
    setBadges(badgeService.getAllBadges());
  }, [badgeService]);

  return {
    badges,
    selectedBadge,
    isLoading,
    error,
    setSelectedBadge,
    loadBadges,
    getBadgeById,
    getBadgesByFilter,
    getBadgeStats,
    getBadgeProgress,
    isBadgeEarned,
    unlockBadge,
    updateBadgeProgress,
    getUnlockHistory,
    searchBadges,
    getEarnedBadges,
    getUnearnedBadges,
    getBadgeGroups,
    getUserProgress,
    exportUserProgress,
    importUserProgress,
    resetUserProgress
  };
};

export default useBadges;
