import React, { useState, useEffect } from 'react';
import { Badge, BadgeRarity } from '../../types/badge';
import BadgeService from '../../services/badgeService';
import './BadgeDetailModal.css';

interface BadgeDetailModalProps {
  badge: Badge;
  isOpen: boolean;
  onClose: () => void;
}

const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
  badge,
  isOpen,
  onClose
}) => {
  const [progress, setProgress] = useState(0);
  const [isEarned, setIsEarned] = useState(false);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const badgeService = BadgeService.getInstance();

  useEffect(() => {
    if (isOpen) {
      const earned = badgeService.isBadgeEarned(badge.id);
      setIsEarned(earned);
      setProgress(badgeService.getBadgeProgress(badge.id));
    }
  }, [badge.id, isOpen]);

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

  const getLevelLabel = (level: string): string => {
    const labels = {
      bronze: '青铜',
      silver: '白银',
      gold: '黄金',
      platinum: '白金',
      diamond: '钻石',
      legend: '传说'
    };
    return labels[level] || level;
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

  const handleShare = () => {
    setShowShareModal(true);
  };

  const canUnlock = progress >= 100 && !isEarned;

  if (!isOpen) return null;

  return (
    <>
      <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>

          {showUnlockAnimation && (
            <div className="unlock-animation-overlay">
              <div className="unlock-badge-icon">
                <img src={badge.icon} alt={badge.title} />
              </div>
              <div className="unlock-text-container">
                <h2 className="unlock-title">恭喜！</h2>
                <p className="unlock-subtitle">你解锁了{badge.title}勋章</p>
              </div>
              <div className="unlock-particles">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="particle"
                    style={{
                      '--delay': `${i * 0.03}s`,
                      '--angle': `${i * 12}deg`,
                      '--distance': `${100 + Math.random() * 100}px`
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="modal-header">
            <div className="badge-icon-large">
              <img
                src={badge.icon}
                alt={badge.title}
                className={isEarned ? 'earned' : ''}
              />
              {badge.metadata.glowColor && isEarned && (
                <div
                  className="badge-glow-large"
                  style={{ backgroundColor: badge.metadata.glowColor }}
                />
              )}
            </div>
            <div className="badge-meta">
              <div className="badge-rarity-badge" style={{ color: getRarityColor(badge.rarity) }}>
                {getRarityLabel(badge.rarity)}
              </div>
              <div className="badge-level-badge">
                {getLevelLabel(badge.level)}
              </div>
              {badge.metadata.specialEffect && (
                <div className="badge-special-badge">✨ 特殊</div>
              )}
            </div>
          </div>

          <div className="modal-body">
            <h2 className="badge-title-large">{badge.title}</h2>
            <p className="badge-description-large">{badge.description}</p>

            <div className="badge-stats">
              <div className="stat-item">
                <span className="stat-label">成就点数</span>
                <span className="stat-value">{badge.metadata.points}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">稀有度</span>
                <span className="stat-value" style={{ color: getRarityColor(badge.rarity) }}>
                  {getRarityLabel(badge.rarity)}
                </span>
              </div>
              {badge.prerequisiteBadge && (
                <div className="stat-item">
                  <span className="stat-label">前置勋章</span>
                  <span className="stat-value">
                    {badgeService.getBadgeById(badge.prerequisiteBadge)?.title || '未知'}
                  </span>
                </div>
              )}
              {badge.nextBadge && (
                <div className="stat-item">
                  <span className="stat-label">下一级勋章</span>
                  <span className="stat-value">
                    {badgeService.getBadgeById(badge.nextBadge)?.title || '未知'}
                  </span>
                </div>
              )}
            </div>

            <div className="badge-conditions">
              <h3 className="conditions-title">解锁条件</h3>
              <div className="conditions-list">
                {badge.unlockConditions.map((condition, index) => (
                  <div key={index} className="condition-item">
                    <div className="condition-header">
                      <span className="condition-type">{condition.description}</span>
                      <span className={`condition-status ${progress >= 100 ? 'completed' : 'incomplete'}`}>
                        {progress >= 100 ? '✓' : '○'}
                      </span>
                    </div>
                    <div className="condition-progress">
                      <div className="progress-bar-large">
                        <div
                          className="progress-fill-large"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: getRarityColor(badge.rarity)
                          }}
                        />
                      </div>
                      <span className="progress-text-large">{Math.round(progress)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isEarned && badge.earnedDate && (
              <div className="badge-earned-info">
                <div className="earned-icon">🏆</div>
                <div className="earned-details">
                  <p className="earned-date">
                    获得时间：{new Date(badge.earnedDate).toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )}

            {badge.isHidden && !isEarned && (
              <div className="badge-hidden-info">
                <div className="hidden-icon-large">?</div>
                <p className="hidden-description-large">{badge.hiddenDescription}</p>
              </div>
            )}
          </div>

          <div className="modal-footer">
            {canUnlock && (
              <button className="unlock-button-large" onClick={handleUnlock}>
                解锁勋章
              </button>
            )}
            {isEarned && badge.shareContent && (
              <button className="share-button" onClick={handleShare}>
                分享成就
              </button>
            )}
            {badge.prerequisiteBadge && !badgeService.isBadgeEarned(badge.prerequisiteBadge) && (
              <div className="locked-message">
                需要先解锁前置勋章
              </div>
            )}
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="share-title">分享成就</h3>
            <div className="share-preview">
              <img src={badge.shareContent?.image || badge.icon} alt="分享图片" />
              <p className="share-description">
                {badge.shareContent?.description || `我刚刚解锁了${badge.title}勋章！`}
              </p>
            </div>
            <div className="share-actions">
              <button className="share-action-button" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(badge.shareContent?.description || `我刚刚解锁了${badge.title}勋章！`)}`)}>
                分享到 Twitter
              </button>
              <button className="share-action-button" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}>
                分享到 Facebook
              </button>
              <button className="share-action-button secondary" onClick={() => setShowShareModal(false)}>
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BadgeDetailModal;
