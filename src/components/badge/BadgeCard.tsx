import React, { useState, useEffect } from 'react';
import { Badge, BadgeRarity } from '../../types/badge';
import BadgeService from '../../services/badgeService';
import './BadgeCard.css';

interface BadgeCardProps {
  badge: Badge;
  onClick?: (badge: Badge) => void;
  showProgress?: boolean;
  lazy?: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  onClick,
  showProgress = true,
  lazy = true
}) => {
  const [isLoaded, setIsLoaded] = useState(!lazy);
  const [isEarned, setIsEarned] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

  const badgeService = BadgeService.getInstance();

  useEffect(() => {
    const earned = badgeService.isBadgeEarned(badge.id);
    setIsEarned(earned);
    setProgress(badgeService.getBadgeProgress(badge.id));
  }, [badge.id]);

  const getRarityColor = (rarity: BadgeRarity): string => {
    const colors = {
      common: '#9CA3AF',
      rare: '#3B82F6',
      epic: '#8B5CF6',
      legendary: '#F59E0B',
      mythical: '#EC4899'
    };
    return colors[rarity] || '#9CA3AF';
  };

  const getRarityLabel = (rarity: BadgeRarity): string => {
    const labels = {
      common: '普通',
      rare: '稀有',
      epic: '史诗',
      legendary: '传说',
      mythical: '神话'
    };
    return labels[rarity] || '普通';
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(badge);
    }
  };

  const handleUnlock = async () => {
    try {
      const unlockedBadge = await badgeService.unlockBadge(badge.id);
      if (unlockedBadge) {
        setShowUnlockAnimation(true);
        setIsEarned(true);
        setProgress(100);
        
        setTimeout(() => {
          setShowUnlockAnimation(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to unlock badge:', error);
    }
  };

  const canUnlock = progress >= 100 && !isEarned;

  return (
    <div
      className={`badge-card ${isEarned ? 'earned' : 'unearned'} ${isHovered ? 'hovered' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--rarity-color': getRarityColor(badge.rarity)
      }}
    >
      {showUnlockAnimation && (
        <div className="unlock-animation">
          <div className="unlock-particles">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  '--delay': `${i * 0.05}s`,
                  '--angle': `${i * 18}deg`
                }}
              />
            ))}
          </div>
          <div className="unlock-text">勋章解锁！</div>
        </div>
      )}

      <div className="badge-card-header">
        <div className="badge-rarity" style={{ color: getRarityColor(badge.rarity) }}>
          {getRarityLabel(badge.rarity)}
        </div>
        {badge.metadata.specialEffect && (
          <div className="badge-special">✨</div>
        )}
      </div>

      <div className="badge-card-body">
        <div className="badge-icon-container">
          {!isLoaded && lazy && (
            <div className="badge-skeleton">
              <div className="skeleton-shimmer" />
            </div>
          )}
          <img
            src={badge.icon}
            alt={badge.title}
            className={`badge-icon ${isEarned ? 'earned' : ''} ${badge.metadata.sparkleEffect ? 'sparkle' : ''}`}
            onLoad={handleImageLoad}
            loading={lazy ? 'lazy' : 'eager'}
            style={{ opacity: isLoaded ? 1 : 0 }}
          />
          {badge.metadata.glowColor && isEarned && (
            <div
              className="badge-glow"
              style={{ backgroundColor: badge.metadata.glowColor }}
            />
          )}
        </div>

        <div className="badge-info">
          <h3 className="badge-title">{badge.title}</h3>
          <p className="badge-description">{badge.description}</p>
        </div>
      </div>

      {showProgress && !isEarned && (
        <div className="badge-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
                backgroundColor: getRarityColor(badge.rarity)
              }}
            />
          </div>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      )}

      {canUnlock && (
        <button
          className="unlock-button"
          onClick={(e) => {
            e.stopPropagation();
            handleUnlock();
          }}
        >
          解锁勋章
        </button>
      )}

      {isEarned && badge.earnedDate && (
        <div className="badge-earned-date">
          获得于: {new Date(badge.earnedDate).toLocaleDateString('zh-CN')}
        </div>
      )}

      {badge.isHidden && !isEarned && (
        <div className="badge-hidden">
          <div className="hidden-icon">?</div>
          <p className="hidden-description">{badge.hiddenDescription}</p>
        </div>
      )}
    </div>
  );
};

export default BadgeCard;
