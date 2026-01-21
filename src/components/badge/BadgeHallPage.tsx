import React, { useState, useEffect, useMemo } from 'react';
import { Badge, BadgeFilter, BadgeSeries, BadgeCategory, BadgeRarity, BadgeLevel, BadgeGroup } from '../../types/badge';
import BadgeService from '../../services/badgeService';
import BadgeCard from './BadgeCard';
import BadgeDetailModal from './BadgeDetailModal';
import BadgeGroupCard from './BadgeGroupCard';
import './BadgeHallPage.css';

const BadgeHallPage: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [badgeGroups, setBadgeGroups] = useState<BadgeGroup[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [filter, setFilter] = useState<BadgeFilter>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'groups'>('grid');
  const [sortBy, setSortBy] = useState<'rarity' | 'level' | 'date' | 'points'>('rarity');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [pointRange, setPointRange] = useState<{ min: number | undefined; max: number | undefined }>({ min: undefined, max: undefined });
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const badgeService = BadgeService.getInstance();

  useEffect(() => {
    const allBadges = badgeService.getAllBadges();
    const groups = badgeService.getBadgeGroups();
    setBadges(allBadges);
    setBadgeGroups(groups);
  }, []);

  const filteredBadges = useMemo(() => {
    setIsLoading(true);
    
    try {
      const combinedFilter: BadgeFilter = {
        ...filter,
        search: debouncedSearchQuery,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        minPoints: pointRange.min,
        maxPoints: pointRange.max,
      };
      
      const result = badgeService.getBadgesByFilter(combinedFilter);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [badges, filter, debouncedSearchQuery, selectedTags, pointRange]);

  const sortedBadges = useMemo(() => {
    const sorted = [...filteredBadges];
    
    switch (sortBy) {
      case 'rarity':
        const rarityOrder = ['mythical', 'legendary', 'epic', 'rare', 'common'];
        return sorted.sort((a, b) => 
          rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
        );
      case 'level':
        const levelOrder = ['legend', 'diamond', 'platinum', 'gold', 'silver', 'bronze'];
        return sorted.sort((a, b) => 
          levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level)
        );
      case 'points':
        return sorted.sort((a, b) => b.metadata.points - a.metadata.points);
      case 'date':
        return sorted.sort((a, b) => 
          new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
        );
      default:
        return sorted;
    }
  }, [filteredBadges, sortBy]);

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
  };

  const handleModalClose = () => {
    setSelectedBadge(null);
  };

  const handleFilterChange = (newFilter: Partial<BadgeFilter>) => {
    setFilter({ ...filter, ...newFilter });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (sort: 'rarity' | 'level' | 'date' | 'points') => {
    setSortBy(sort);
  };

  const handleViewModeChange = (mode: 'grid' | 'list' | 'groups') => {
    setViewMode(mode);
  };

  const handleGroupClick = (group: BadgeGroup) => {
    setFilter({ series: group.badges[0] as BadgeSeries });
    setViewMode('grid');
  };

  const stats = badgeService.getBadgeStats();

  const renderGridView = () => (
    <div className="badge-grid">
      {sortedBadges.map(badge => (
        <BadgeCard
          key={badge.id}
          badge={badge}
          onClick={handleBadgeClick}
          showProgress={true}
          lazy={true}
        />
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="badge-list">
      {sortedBadges.map(badge => (
        <div key={badge.id} className="badge-list-item" onClick={() => handleBadgeClick(badge)}>
          <div className="badge-list-icon">
            <img src={badge.icon} alt={badge.title} />
          </div>
          <div className="badge-list-info">
            <h4 className="badge-list-title">{badge.title}</h4>
            <p className="badge-list-description">{badge.description}</p>
            <div className="badge-list-meta">
              <span className="badge-list-rarity">{badge.rarity}</span>
              <span className="badge-list-points">{badge.metadata.points}点</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGroupsView = () => (
    <div className="badge-groups">
      {badgeGroups.map(group => (
        <BadgeGroupCard
          key={group.id}
          group={group}
          onClick={handleGroupClick}
        />
      ))}
    </div>
  );

  return (
    <div className="badge-hall-page">
      <header className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">勋章殿堂</h1>
            <p className="page-subtitle">收集勋章，见证你的成长历程</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-value">{stats.earned}</span>
              <span className="stat-label">已获得</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">总勋章</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.totalPoints}</span>
              <span className="stat-label">成就点</span>
            </div>
          </div>
        </div>
      </header>

      <div className="controls-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="搜索勋章..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
          <div className="search-icon">🔍</div>
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label className="filter-label">视图模式</label>
            <div className="view-mode-buttons">
              <button
                className={`view-mode-button ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('grid')}
              >
                网格
              </button>
              <button
                className={`view-mode-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('list')}
              >
                列表
              </button>
              <button
                className={`view-mode-button ${viewMode === 'groups' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('groups')}
              >
                套系
              </button>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">排序方式</label>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as any)}
            >
              <option value="rarity">稀有度</option>
              <option value="level">等级</option>
              <option value="points">成就点</option>
              <option value="date">获得时间</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">状态筛选</label>
            <div className="status-buttons">
              <button
                className={`status-button ${!filter.status || filter.status === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange({ status: 'all' })}
              >
                全部
              </button>
              <button
                className={`status-button ${filter.status === 'earned' ? 'active' : ''}`}
                onClick={() => handleFilterChange({ status: 'earned' })}
              >
                已获得
              </button>
              <button
                className={`status-button ${filter.status === 'unearned' ? 'active' : ''}`}
                onClick={() => handleFilterChange({ status: 'unearned' })}
              >
                未获得
              </button>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">套系筛选</label>
            <select
              className="filter-select"
              value={filter.series || 'all'}
              onChange={(e) => handleFilterChange({ series: e.target.value as any })}
            >
              <option value="all">全部套系</option>
              <option value="growth">成长勋章</option>
              <option value="creative">创意勋章</option>
              <option value="hidden">隐藏勋章</option>
              <option value="dynasty">朝代勋章</option>
              <option value="celebrities">名人勋章</option>
              <option value="technology">科技勋章</option>
              <option value="dream">筑梦勋章</option>
              <option value="culture">文化勋章</option>
              <option value="learning">学习勋章</option>
              <option value="social">社交勋章</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">稀有度</label>
            <select
              className="filter-select"
              value={filter.rarity || 'all'}
              onChange={(e) => handleFilterChange({ rarity: e.target.value as any })}
            >
              <option value="all">全部稀有度</option>
              <option value="common">普通</option>
              <option value="rare">稀有</option>
              <option value="epic">史诗</option>
              <option value="legendary">传说</option>
              <option value="mythical">神话</option>
            </select>
          </div>

          {(filter.series || filter.category || filter.rarity || filter.level || filter.status) && (
            <button
              className="clear-filters-button"
              onClick={() => setFilter({})}
            >
              清除筛选
            </button>
          )}
        </div>
      </div>

      <div className="content-section">
        {filteredBadges.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏆</div>
            <h3 className="empty-title">没有找到勋章</h3>
            <p className="empty-description">
              {searchQuery ? `没有找到与"${searchQuery}"相关的勋章` : '没有符合条件的勋章'}
            </p>
            <button
              className="clear-search-button"
              onClick={() => {
                setSearchQuery('');
                setFilter({});
              }}
            >
              清除搜索和筛选
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' && renderGridView()}
            {viewMode === 'list' && renderListView()}
            {viewMode === 'groups' && renderGroupsView()}
          </>
        )}
      </div>

      {selectedBadge && (
        <BadgeDetailModal
          badge={selectedBadge}
          isOpen={!!selectedBadge}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default BadgeHallPage;
