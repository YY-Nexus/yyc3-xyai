import React from 'react';
import { BadgeGroup } from '../../types/badge';
import BadgeService from '../../services/badgeService';
import './BadgeGroupCard.css';

interface BadgeGroupCardProps {
  group: BadgeGroup;
  onClick?: (group: BadgeGroup) => void;
}

const BadgeGroupCard: React.FC<BadgeGroupCardProps> = ({
  group,
  onClick
}) => {
  const badgeService = BadgeService.getInstance();
  const groupProgress = badgeService.getBadgeGroups().find(g => g.id === group.id);

  const handleClick = () => {
    onClick?.(group);
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 1) return '#4ade80';
    if (progress >= 0.75) return '#22c55e';
    if (progress >= 0.5) return '#f59e0b';
    return '#9ca3af';
  };

  return (
    <div
      className={`badge-group-card ${group.isLocked ? 'locked' : ''}`}
      onClick={handleClick}
    >
      <div className="group-header">
        <div className="group-icon">
          <img src={group.icon} alt={group.name} />
          {group.completionBadge && badgeService.isBadgeEarned(group.completionBadge) && (
            <div className="completion-badge">
              <img src={badgeService.getBadgeById(group.completionBadge)?.icon} alt="完成" />
            </div>
          )}
        </div>
        <div className="group-info">
          <h3 className="group-name">{group.name}</h3>
          <p className="group-description">{group.description}</p>
        </div>
      </div>

      <div className="group-progress">
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{
              width: `${(groupProgress?.progress || 0) * 100}%`,
              backgroundColor: getProgressColor(groupProgress?.progress || 0)
            }}
          />
        </div>
        <div className="progress-stats">
          <span className="earned-count">{groupProgress?.earnedCount || 0}</span>
          <span className="separator">/</span>
          <span className="total-count">{group.badgeCount}</span>
        </div>
      </div>

      {group.isLocked && (
        <div className="locked-overlay">
          <div className="locked-icon">🔒</div>
          <p className="locked-text">{group.unlockRequirement || '需要解锁此套系'}</p>
        </div>
      )}

      {groupProgress?.progress >= 1 && (
        <div className="completed-badge">
          <span>✓</span>
          <span>套系完成</span>
        </div>
      )}
    </div>
  );
};

export default BadgeGroupCard;
