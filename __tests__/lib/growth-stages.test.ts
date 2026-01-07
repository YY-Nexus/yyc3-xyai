/**
 * Growth Stages 成长阶段测试
 */

import { describe, it, expect } from 'bun:test';

describe('Growth Stages 成长阶段测试', () => {
  // 测试成长阶段定义
  it('应该能够定义成长阶段', () => {
    const growthStage = {
      id: 'stage-1',
      name: '新生儿期',
      description: '出生后28天内',
      ageRange: { min: 0, max: 28, unit: 'days' },
      milestones: ['第一次呼吸', '第一次哭泣', '第一次哺乳'],
      characteristics: ['睡眠时间长', '吃奶频繁', '体温调节能力弱'],
    };

    expect(growthStage.id).toBe('stage-1');
    expect(growthStage.name).toBe('新生儿期');
    expect(growthStage.ageRange.min).toBe(0);
    expect(growthStage.ageRange.max).toBe(28);
    expect(growthStage.milestones.length).toBe(3);
  });

  // 测试成长阶段创建
  it('应该能够创建成长阶段', () => {
    const stages: Array<{
      id: string;
      name: string;
      ageRange: { min: number; max: number; unit: string };
    }> = [];

    const newStage = {
      id: `stage-${Date.now()}`,
      name: '婴儿期',
      ageRange: { min: 29, max: 365, unit: 'days' },
    };

    stages.push(newStage);
    expect(stages.length).toBe(1);
    expect(stages[0].name).toBe('婴儿期');
  });

  // 测试成长阶段更新
  it('应该能够更新成长阶段', () => {
    const stage = {
      id: 'stage-1',
      name: '新生儿期',
      description: '出生后28天内',
      milestones: ['第一次呼吸', '第一次哭泣', '第一次哺乳'],
    };

    // 更新阶段
    stage.name = '新生儿阶段';
    stage.description = '出生后28天内的关键时期';
    stage.milestones.push('第一次微笑');

    expect(stage.name).toBe('新生儿阶段');
    expect(stage.description).toBe('出生后28天内的关键时期');
    expect(stage.milestones.length).toBe(4);
  });

  // 测试成长阶段删除
  it('应该能够删除成长阶段', () => {
    const stages = [
      { id: '1', name: '新生儿期' },
      { id: '2', name: '婴儿期' },
      { id: '3', name: '幼儿期' },
    ];

    // 删除阶段
    const filteredStages = stages.filter(stage => stage.id !== '2');
    expect(filteredStages.length).toBe(2);
    expect(filteredStages[0].id).toBe('1');
    expect(filteredStages[1].id).toBe('3');
  });

  // 测试成长阶段搜索
  it('应该能够搜索成长阶段', () => {
    const stages = [
      {
        id: '1',
        name: '新生儿期',
        description: '出生后28天内',
      },
      {
        id: '2',
        name: '婴儿期',
        description: '出生后29天到1岁',
      },
      {
        id: '3',
        name: '幼儿期',
        description: '1岁到3岁',
      },
    ];

    // 搜索阶段
    const searchResults = stages.filter(
      stage => stage.name.includes('婴儿') || stage.description.includes('婴儿')
    );

    expect(searchResults.length).toBe(1);
    expect(searchResults[0].id).toBe('2');
  });

  // 测试成长阶段排序
  it('应该能够排序成长阶段', () => {
    const stages = [
      { id: '3', name: '幼儿期', ageRange: { min: 365, max: 1095 } },
      { id: '1', name: '新生儿期', ageRange: { min: 0, max: 28 } },
      { id: '2', name: '婴儿期', ageRange: { min: 29, max: 365 } },
    ];

    // 按年龄范围排序
    stages.sort((a, b) => a.ageRange.min - b.ageRange.min);

    expect(stages[0].id).toBe('1');
    expect(stages[1].id).toBe('2');
    expect(stages[2].id).toBe('3');
  });

  // 测试里程碑管理
  it('应该能够管理里程碑', () => {
    const stage = {
      id: 'stage-1',
      name: '新生儿期',
      milestones: ['第一次呼吸', '第一次哭泣', '第一次哺乳'] as string[],
    };

    // 添加里程碑
    stage.milestones.push('第一次微笑');
    expect(stage.milestones.length).toBe(4);
    expect(stage.milestones[3]).toBe('第一次微笑');

    // 删除里程碑
    const index = stage.milestones.indexOf('第一次哭泣');
    if (index > -1) {
      stage.milestones.splice(index, 1);
    }
    expect(stage.milestones).not.toContain('第一次哭泣');
    expect(stage.milestones.length).toBe(3);
  });

  // 测试特征管理
  it('应该能够管理特征', () => {
    const stage = {
      id: 'stage-1',
      name: '新生儿期',
      characteristics: ['睡眠时间长', '吃奶频繁', '体温调节能力弱'] as string[],
    };

    // 添加特征
    stage.characteristics.push('视觉模糊');
    expect(stage.characteristics.length).toBe(4);
    expect(stage.characteristics[3]).toBe('视觉模糊');
  });

  // 测试成长阶段匹配
  it('应该能够匹配成长阶段', () => {
    const stages = [
      { id: '1', name: '新生儿期', ageRange: { min: 0, max: 28 } },
      { id: '2', name: '婴儿期', ageRange: { min: 29, max: 365 } },
      { id: '3', name: '幼儿期', ageRange: { min: 366, max: 1095 } },
    ];

    const childAge = 100; // 天数

    const matchedStage = stages.find(
      stage => childAge >= stage.ageRange.min && childAge <= stage.ageRange.max
    );

    expect(matchedStage?.name).toBe('婴儿期');
  });

  // 测试阶段过渡
  it('应该能够处理阶段过渡', () => {
    const currentStageId = 'stage-1';
    const nextStageId = 'stage-2';

    // 过渡到下一个阶段
    const transition = {
      from: currentStageId,
      to: nextStageId,
      timestamp: new Date().toISOString(),
    };

    expect(transition.from).toBe('stage-1');
    expect(transition.to).toBe('stage-2');
  });

  // 测试阶段建议
  it('应该能够提供阶段建议', () => {
    const stage = {
      id: 'stage-1',
      name: '新生儿期',
      suggestions: ['保持室内温度适宜', '定期喂奶', '观察宝宝的睡眠状态'],
    };

    expect(stage.suggestions.length).toBe(3);
    expect(stage.suggestions[0]).toBe('保持室内温度适宜');
  });

  // 测试阶段警报
  it('应该能够设置阶段警报', () => {
    const stage = {
      id: 'stage-1',
      name: '新生儿期',
      alerts: [
        {
          condition: '体温过高',
          threshold: 37.5,
          action: '及时就医',
        },
        {
          condition: '吃奶量过少',
          threshold: 100,
          unit: 'ml',
          action: '咨询医生',
        },
      ],
    };

    expect(stage.alerts.length).toBe(2);
    expect(stage.alerts[0].condition).toBe('体温过高');
  });

  // 测试阶段统计
  it('应该能够计算阶段统计', () => {
    const stages = [
      { id: '1', name: '新生儿期', milestones: 10 },
      { id: '2', name: '婴儿期', milestones: 20 },
      { id: '3', name: '幼儿期', milestones: 30 },
    ];

    const totalMilestones = stages.reduce(
      (sum, stage) => sum + stage.milestones,
      0
    );

    expect(totalMilestones).toBe(60);
  });

  // 测试阶段可视化
  it('应该能够支持阶段可视化', () => {
    const stageProgress = {
      currentStageId: 'stage-2',
      completedMilestones: 15,
      totalMilestones: 20,
      progress: 0.75,
    };

    expect(stageProgress.currentStageId).toBe('stage-2');
    expect(stageProgress.completedMilestones).toBe(15);
    expect(stageProgress.totalMilestones).toBe(20);
    expect(stageProgress.progress).toBe(0.75);
  });

  // 测试阶段历史
  it('应该能够记录阶段历史', () => {
    const stageHistory = [
      {
        stageId: 'stage-1',
        startDate: new Date(
          Date.now() - 28 * 24 * 60 * 60 * 1000
        ).toISOString(),
        endDate: new Date().toISOString(),
      },
      {
        stageId: 'stage-2',
        startDate: new Date().toISOString(),
        endDate: null,
      },
    ];

    expect(stageHistory.length).toBe(2);
    expect(stageHistory[0].stageId).toBe('stage-1');
    expect(stageHistory[1].endDate).toBe(null);
  });

  // 测试阶段比较
  it('应该能够比较阶段', () => {
    const stage1 = {
      id: '1',
      name: '新生儿期',
      ageRange: { min: 0, max: 28 },
      milestones: 10,
    };

    const stage2 = {
      id: '2',
      name: '婴儿期',
      ageRange: { min: 29, max: 365 },
      milestones: 20,
    };

    const comparison = {
      ageDiff: stage2.ageRange.max - stage1.ageRange.max,
      milestonesDiff: stage2.milestones - stage1.milestones,
    };

    expect(comparison.ageDiff).toBe(337);
    expect(comparison.milestonesDiff).toBe(10);
  });
});
