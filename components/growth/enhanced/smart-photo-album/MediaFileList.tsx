/**
 * @file 媒体文件列表组件
 * @description 展示过滤后的媒体文件缩略图，支持选择和预览功能
 * @module components/growth/enhanced/smart-photo-album/MediaFileList
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 */

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Video,
  Image as ImageIcon,
  FileText,
  Check,
  Eye,
  Share2,
  Download,
} from 'lucide-react';
import { MediaFile, ViewMode } from './types';
import { formatFileSize } from './utils';

interface MediaFileListProps {
  /** 媒体文件列表 */
  files: MediaFile[];
  /** 选中的文件 */
  selectedFile: MediaFile | null;
  /** 视图模式 */
  viewMode: ViewMode;
  /** 选择文件回调 */
  onFileSelect: (file: MediaFile) => void;
  /** 切换收藏回调 */
  onToggleFavorite: (fileId: string) => void;
  /** 删除文件回调 */
  onDelete: (fileId: string) => void;
  /** 加载状态 */
  isLoading?: boolean;
}

/**
 * 媒体文件列表组件
 * @param props 组件属性
 * @returns JSX元素
 */
export const MediaFileList: React.FC<MediaFileListProps> = ({
  files,
  selectedFile,
  viewMode,
  onFileSelect,
  onToggleFavorite,
  onDelete,
  isLoading = false,
}) => {
  // 根据视图模式确定网格类名
  const gridClassName = {
    grid: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4',
    list: 'space-y-2',
  }[viewMode];

  // 获取媒体类型图标
  const getMediaIcon = (file: MediaFile) => {
    switch (file.type) {
      case 'photo':
        return <ImageIcon className='w-4 h-4 text-blue-500' />;
      case 'video':
        return <Video className='w-4 h-4 text-red-500' />;
      default:
        return <FileText className='w-4 h-4 text-gray-500' />;
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-10'>
        <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500'></div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className='text-center py-10 text-gray-500'>
        <div className='text-6xl mb-4'>📁</div>
        <h3 className='text-lg font-medium mb-2'>暂无媒体文件</h3>
        <p>上传一些照片或视频来开始创建您的相册吧</p>
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {files.map(file => (
        <motion.div
          key={file.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedFile?.id === file.id
              ? 'ring-2 ring-purple-500 rounded-lg overflow-hidden'
              : viewMode === 'grid'
                ? 'rounded-lg overflow-hidden bg-white shadow-sm'
                : 'flex items-center p-3 bg-white rounded-lg shadow-sm'
          }`}
          onClick={() => onFileSelect(file)}
        >
          {/* 网格视图 */}
          {viewMode === 'grid' && (
            <div className='relative'>
              {/* 媒体预览 */}
              <div className='aspect-square overflow-hidden bg-gray-100'>
                {file.type === 'photo' ? (
                  <Image
                    src={file.url || '/placeholder.png'}
                    alt={file.filename}
                    fill
                    className='object-cover'
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.png';
                    }}
                  />
                ) : (
                  <div className='w-full h-full flex flex-col items-center justify-center bg-gray-200'>
                    <Video className='w-12 h-12 text-red-500 mb-2' />
                    <span className='text-sm text-gray-500'>视频</span>
                  </div>
                )}
              </div>

              {/* 选择标记 */}
              {selectedFile?.id === file.id && (
                <div className='absolute top-2 right-2 bg-purple-600 text-white p-1 rounded-full'>
                  <Check className='w-4 h-4' />
                </div>
              )}

              {/* 文件信息 */}
              <div className='p-2'>
                <div className='flex items-center justify-between mb-1'>
                  <span className='text-sm font-medium text-gray-900 truncate'>
                    {file.filename}
                  </span>
                  <span className='text-xs text-gray-500'>
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <div className='flex items-center text-xs text-gray-500'>
                  <span className='mr-2'>
                    {getMediaIcon(file)} {file.type}
                  </span>
                  <span>{new Date(file.date).toLocaleDateString()}</span>
                </div>

                {/* 人物标签 */}
                {file.people && file.people.length > 0 && (
                  <div className='flex flex-wrap gap-1 mt-2'>
                    {file.people.map((person, index) => (
                      <span
                        key={index}
                        className='px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full'
                      >
                        {person}
                      </span>
                    ))}
                  </div>
                )}

                {/* 操作按钮 */}
                <div className='flex justify-between mt-2'>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onToggleFavorite(file.id);
                    }}
                    className='text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1'
                  >
                    {file.isFavorite ? '取消收藏' : '收藏'}
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onDelete(file.id);
                    }}
                    className='text-xs text-red-600 hover:text-red-800'
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 列表视图 */}
          {viewMode === 'list' && (
            <div className='flex items-center w-full'>
              {/* 媒体预览 */}
              <div className='w-20 h-16 overflow-hidden bg-gray-100 rounded-md mr-4 flex-shrink-0'>
                {file.type === 'photo' ? (
                  <Image
                    src={file.url || '/placeholder.png'}
                    alt={file.filename}
                    width={80}
                    height={64}
                    className='object-cover'
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.png';
                    }}
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center bg-gray-200'>
                    <Video className='w-6 h-6 text-red-500' />
                  </div>
                )}
              </div>

              {/* 文件信息 */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between mb-1'>
                  <div className='flex items-center gap-2'>
                    <span className='font-medium text-gray-900 truncate'>
                      {file.filename}
                    </span>
                    {getMediaIcon(file)}
                  </div>
                  <span className='text-sm text-gray-500'>
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <div className='flex items-center text-xs text-gray-500'>
                  <span className='mr-4'>
                    {new Date(file.date).toLocaleString()}
                  </span>
                  {file.location && (
                    <span className='mr-4'>📍 {file.location}</span>
                  )}
                  {file.tags && file.tags.length > 0 && (
                    <div className='flex flex-wrap gap-1'>
                      {file.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className='px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full'
                        >
                          #{tag}
                        </span>
                      ))}
                      {file.tags.length > 3 && (
                        <span className='text-xs text-gray-500'>
                          +{file.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className='flex items-center gap-3 ml-4'>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onToggleFavorite(file.id);
                  }}
                  className='p-1 text-purple-600 hover:text-purple-800'
                  title={file.isFavorite ? '取消收藏' : '收藏'}
                >
                  {file.isFavorite ? (
                    <Check className='w-4 h-4' />
                  ) : (
                    <Eye className='w-4 h-4' />
                  )}
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onDelete(file.id);
                  }}
                  className='p-1 text-red-600 hover:text-red-800'
                  title='删除'
                >
                  <FileText className='w-4 h-4' />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
