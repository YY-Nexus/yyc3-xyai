/**
 * @file route.ts
 * @description 勋章系统API端点
 */

import { NextRequest, NextResponse } from 'next/server';
import { badgeService } from '@/lib/services/badgeService';

/**
 * GET /api/badges
 * 获取所有勋章或根据条件筛选
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const series = searchParams.get('series');
    const category = searchParams.get('category');
    const query = searchParams.get('q');
    const id = searchParams.get('id');

    // 获取单个勋章
    if (id) {
      const badge = await badgeService.getBadgeById(id);
      if (!badge) {
        return NextResponse.json(
          { success: false, error: 'Badge not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: badge });
    }

    // 搜索勋章
    if (action === 'search' && query) {
      const badges = await badgeService.searchBadges(query);
      return NextResponse.json({ success: true, data: badges });
    }

    // 按套系筛选
    if (series) {
      const badges = await badgeService.getBadgesBySeries(series as any);
      return NextResponse.json({ success: true, data: badges });
    }

    // 按分类筛选
    if (category) {
      const badges = await badgeService.getBadgesByCategory(category as any);
      return NextResponse.json({ success: true, data: badges });
    }

    // 获取已获得的勋章
    if (action === 'earned') {
      const badges = await badgeService.getEarnedBadges();
      return NextResponse.json({ success: true, data: badges });
    }

    // 获取隐藏勋章
    if (action === 'hidden') {
      const badges = await badgeService.getHiddenBadges();
      return NextResponse.json({ success: true, data: badges });
    }

    // 获取统计数据
    if (action === 'stats') {
      const stats = await badgeService.getBadgeStats();
      return NextResponse.json({ success: true, data: stats });
    }

    // 获取套系组
    if (action === 'groups') {
      const groups = await badgeService.getBadgeGroups();
      return NextResponse.json({ success: true, data: groups });
    }

    // 获取套系进度
    if (action === 'progress' && series) {
      const progress = await badgeService.getSeriesProgress(series as any);
      return NextResponse.json({ success: true, data: progress });
    }

    // 默认：获取所有勋章
    const badges = await badgeService.getAllBadges();
    return NextResponse.json({ success: true, data: badges });
  } catch (error) {
    console.error('Badges API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/badges
 * 解锁勋章
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id } = body;

    if (action === 'unlock' && id) {
      const badge = await badgeService.unlockBadge(id);
      return NextResponse.json({ success: true, data: badge });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Badges POST API error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to process request',
      },
      { status: 500 }
    );
  }
}
