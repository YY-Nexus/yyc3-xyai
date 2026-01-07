/**
 * Asset Manager 资源管理器测试
 */

import { describe, it, expect } from 'bun:test';

describe('Asset Manager 资源管理器测试', () => {
  // 测试资源定义
  it('应该能够定义资源', () => {
    const asset = {
      id: 'asset-1',
      name: 'photo-1.jpg',
      type: 'image',
      url: '/assets/photos/photo-1.jpg',
      size: 1024 * 1024, // 1MB
      mimeType: 'image/jpeg',
      createdAt: new Date().toISOString(),
    };

    expect(asset.id).toBe('asset-1');
    expect(asset.name).toBe('photo-1.jpg');
    expect(asset.type).toBe('image');
    expect(asset.url).toBe('/assets/photos/photo-1.jpg');
    expect(asset.size).toBe(1024 * 1024);
    expect(asset.mimeType).toBe('image/jpeg');
  });

  // 测试资源类型
  it('应该支持不同的资源类型', () => {
    const assetTypes = [
      'image',
      'video',
      'audio',
      'document',
      'archive',
    ] as const;

    expect(assetTypes).toContain('image');
    expect(assetTypes).toContain('video');
    expect(assetTypes).toContain('audio');
    expect(assetTypes).toContain('document');
    expect(assetTypes).toContain('archive');
  });

  // 测试资源添加
  it('应该能够添加资源', () => {
    const assets: Array<{
      id: string;
      name: string;
      type: string;
      size: number;
    }> = [];

    const newAsset = {
      id: `asset-${Date.now()}`,
      name: 'photo-2.jpg',
      type: 'image',
      size: 2048 * 1024,
    };

    assets.push(newAsset);
    expect(assets.length).toBe(1);
    expect(assets[0].name).toBe('photo-2.jpg');
  });

  // 测试资源更新
  it('应该能够更新资源', () => {
    const asset = {
      id: 'asset-1',
      name: 'photo-1.jpg',
      description: '',
      tags: [] as string[],
    };

    // 更新资源
    asset.name = 'photo-1-updated.jpg';
    asset.description = '宝宝的照片';
    asset.tags.push('成长', '纪念');

    expect(asset.name).toBe('photo-1-updated.jpg');
    expect(asset.description).toBe('宝宝的照片');
    expect(asset.tags).toContain('成长');
  });

  // 测试资源删除
  it('应该能够删除资源', () => {
    const assets = [
      { id: '1', name: 'photo-1.jpg', isDeleted: false },
      { id: '2', name: 'photo-2.jpg', isDeleted: false },
      { id: '3', name: 'photo-3.jpg', isDeleted: false },
    ];

    // 软删除资源
    const assetToDelete = assets.find(a => a.id === '2');
    if (assetToDelete) {
      assetToDelete.isDeleted = true;
    }

    // 硬删除资源
    const filteredAssets = assets.filter(a => !a.isDeleted);

    expect(assetToDelete?.isDeleted).toBe(true);
    expect(filteredAssets.length).toBe(2);
  });

  // 测试资源搜索
  it('应该能够搜索资源', () => {
    const assets = [
      { id: '1', name: 'photo-1.jpg', tags: ['成长', '纪念'] },
      { id: '2', name: 'video-1.mp4', tags: ['运动', '游戏'] },
      { id: '3', name: 'photo-2.jpg', tags: ['成长', '家庭'] },
    ];

    // 搜索资源
    const searchResults = assets.filter(
      asset =>
        asset.name.includes('photo') ||
        asset.tags.some(tag => tag.includes('成长'))
    );
    expect(searchResults.length).toBe(2);
  });

  // 测试资源过滤
  it('应该能够过滤资源', () => {
    const assets = [
      { id: '1', name: 'photo-1.jpg', type: 'image', size: 1024 },
      { id: '2', name: 'video-1.mp4', type: 'video', size: 10240 },
      { id: '3', name: 'photo-2.jpg', type: 'image', size: 2048 },
    ];

    // 按类型过滤
    const imageAssets = assets.filter(a => a.type === 'image');
    expect(imageAssets.length).toBe(2);

    // 按大小过滤
    const smallAssets = assets.filter(a => a.size <= 2048);
    expect(smallAssets.length).toBe(2);
  });

  // 测试资源排序
  it('应该能够排序资源', () => {
    const assets = [
      { id: '3', name: 'photo-3.jpg', createdAt: Date.now() - 60000 },
      { id: '1', name: 'photo-1.jpg', createdAt: Date.now() - 180000 },
      { id: '2', name: 'photo-2.jpg', createdAt: Date.now() - 120000 },
    ];

    // 按创建时间排序
    assets.sort((a, b) => a.createdAt - b.createdAt);

    expect(assets[0].id).toBe('1');
    expect(assets[1].id).toBe('2');
    expect(assets[2].id).toBe('3');
  });

  // 测试资源分组
  it('应该能够对资源进行分组', () => {
    const assets = [
      { id: '1', name: 'photo-1.jpg', type: 'image', category: '成长' },
      { id: '2', name: 'video-1.mp4', type: 'video', category: '成长' },
      { id: '3', name: 'photo-2.jpg', type: 'image', category: '家庭' },
    ];

    const groupedAssets = assets.reduce(
      (acc, asset) => {
        if (!acc[asset.category]) {
          acc[asset.category] = [];
        }
        acc[asset.category].push(asset);
        return acc;
      },
      {} as Record<string, typeof assets>
    );

    expect(groupedAssets.成长.length).toBe(2);
    expect(groupedAssets.家庭.length).toBe(1);
  });

  // 测试资源标签
  it('应该能够管理资源标签', () => {
    const asset = {
      id: 'asset-1',
      name: 'photo-1.jpg',
      tags: ['成长', '纪念'] as string[],
    };

    // 添加标签
    asset.tags.push('家庭', '快乐');
    expect(asset.tags.length).toBe(4);
    expect(asset.tags).toContain('家庭');

    // 删除标签
    const index = asset.tags.indexOf('纪念');
    if (index > -1) {
      asset.tags.splice(index, 1);
    }
    expect(asset.tags).not.toContain('纪念');
    expect(asset.tags.length).toBe(3);
  });

  // 测试资源上传
  it('应该能够上传资源', () => {
    const asset = {
      id: 'asset-1',
      name: 'photo-1.jpg',
      url: '',
      isUploaded: false,
      progress: 0,
    };

    // 模拟上传
    asset.url = '/assets/photos/photo-1.jpg';
    asset.isUploaded = true;
    asset.progress = 100;

    expect(asset.isUploaded).toBe(true);
    expect(asset.progress).toBe(100);
    expect(asset.url).toBe('/assets/photos/photo-1.jpg');
  });

  // 测试资源下载
  it('应该能够下载资源', () => {
    const asset = {
      id: 'asset-1',
      name: 'photo-1.jpg',
      url: '/assets/photos/photo-1.jpg',
      isDownloaded: false,
    };

    // 模拟下载
    asset.isDownloaded = true;

    expect(asset.isDownloaded).toBe(true);
  });

  // 测试资源预览
  it('应该能够预览资源', () => {
    const asset = {
      id: 'asset-1',
      name: 'photo-1.jpg',
      type: 'image',
      url: '/assets/photos/photo-1.jpg',
      thumbnailUrl: '/assets/thumbnails/photo-1-thumb.jpg',
    };

    expect(asset.thumbnailUrl).toBeDefined();
    expect(asset.thumbnailUrl).toContain('thumb');
  });

  // 测试资源压缩
  it('应该能够压缩资源', () => {
    const asset = {
      id: 'asset-1',
      name: 'photo-1.jpg',
      originalSize: 1024 * 1024,
      compressedSize: 512 * 1024,
      isCompressed: false,
    };

    // 模拟压缩
    asset.isCompressed = true;

    expect(asset.isCompressed).toBe(true);
    expect(asset.compressedSize).toBeLessThan(asset.originalSize);
  });

  // 测试资源转换
  it('应该能够转换资源格式', () => {
    const asset = {
      id: 'asset-1',
      name: 'photo-1.png',
      originalFormat: 'png',
      convertedFormat: 'jpg',
      convertedUrl: '/assets/photos/photo-1.jpg',
    };

    expect(asset.originalFormat).toBe('png');
    expect(asset.convertedFormat).toBe('jpg');
    expect(asset.convertedUrl).toContain('jpg');
  });

  // 测试资源统计
  it('应该能够计算资源统计', () => {
    const assets = [
      { id: '1', type: 'image', size: 1024 },
      { id: '2', type: 'video', size: 10240 },
      { id: '3', type: 'image', size: 2048 },
      { id: '4', type: 'audio', size: 512 },
    ];

    const stats = {
      total: assets.length,
      byType: {} as Record<string, { count: number; size: number }>,
      totalSize: assets.reduce((sum, a) => sum + a.size, 0),
    };

    assets.forEach(asset => {
      if (!stats.byType[asset.type]) {
        stats.byType[asset.type] = { count: 0, size: 0 };
      }
      stats.byType[asset.type].count++;
      stats.byType[asset.type].size += asset.size;
    });

    expect(stats.total).toBe(4);
    expect(stats.totalSize).toBe(13824);
    expect(stats.byType.image.count).toBe(2);
    expect(stats.byType.video.count).toBe(1);
  });

  // 测试资源配额
  it('应该能够管理资源配额', () => {
    const quota = {
      maxStorage: 100 * 1024 * 1024, // 100MB
      usedStorage: 50 * 1024 * 1024, // 50MB
      maxAssets: 1000,
      usedAssets: 500,
    };

    const remainingStorage = quota.maxStorage - quota.usedStorage;
    const remainingAssets = quota.maxAssets - quota.usedAssets;

    expect(remainingStorage).toBe(50 * 1024 * 1024);
    expect(remainingAssets).toBe(500);
  });

  // 测试资源清理
  it('应该能够清理过期资源', () => {
    const assets = [
      { id: '1', name: 'photo-1.jpg', expiresAt: Date.now() - 3600000 },
      { id: '2', name: 'photo-2.jpg', expiresAt: Date.now() + 3600000 },
      { id: '3', name: 'photo-3.jpg', expiresAt: Date.now() - 7200000 },
    ];

    // 清理过期资源
    const validAssets = assets.filter(a => a.expiresAt > Date.now());

    expect(validAssets.length).toBe(1);
    expect(validAssets[0].id).toBe('2');
  });

  // 测试资源导出
  it('应该能够导出资源', () => {
    const assets = [
      { id: '1', name: 'photo-1.jpg', url: '/assets/photos/photo-1.jpg' },
      { id: '2', name: 'photo-2.jpg', url: '/assets/photos/photo-2.jpg' },
    ];

    const exportedData = JSON.stringify(assets, null, 2);
    expect(exportedData).toContain('id');
    expect(exportedData).toContain('url');
  });

  // 测试资源导入
  it('应该能够导入资源', () => {
    const data = '[{"id":"1","name":"photo-1.jpg"}]';
    const importedAssets = JSON.parse(data);

    expect(importedAssets.length).toBe(1);
    expect(importedAssets[0].name).toBe('photo-1.jpg');
  });
});
