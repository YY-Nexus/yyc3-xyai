'use client';

/**
 * Material-UI 组件使用示例
 *
 * 本文件展示了 Material-UI 的常用组件使用方法，包括：
 * - 按钮组件
 * - 文本框组件
 * - 选择框组件
 * - 卡片组件
 * - 对话框组件
 */

import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

/**
 * Material-UI 按钮示例
 */
export function MaterialUIButtonExample() {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Material-UI 按钮示例</h3>

      {/* 基础按钮 */}
      <div className='flex gap-2'>
        <Button variant='text'>Text Button</Button>
        <Button variant='outlined'>Outlined Button</Button>
        <Button variant='contained'>Contained Button</Button>
      </div>

      {/* 颜色变体 */}
      <div className='flex gap-2'>
        <Button variant='contained' color='primary'>
          Primary
        </Button>
        <Button variant='contained' color='secondary'>
          Secondary
        </Button>
        <Button variant='contained' color='success'>
          Success
        </Button>
        <Button variant='contained' color='error'>
          Error
        </Button>
      </div>

      {/* 尺寸变体 */}
      <div className='flex gap-2 items-center'>
        <Button variant='contained' size='small'>
          Small
        </Button>
        <Button variant='contained' size='medium'>
          Medium
        </Button>
        <Button variant='contained' size='large'>
          Large
        </Button>
      </div>
    </div>
  );
}

/**
 * Material-UI 文本框示例
 */
export function MaterialUITextFieldExample() {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Material-UI 文本框示例</h3>

      {/* 标准文本框 */}
      <TextField
        label='用户名'
        variant='outlined'
        fullWidth
        margin='normal'
        placeholder='请输入用户名'
      />

      {/* 必填文本框 */}
      <TextField
        label='密码'
        variant='outlined'
        type='password'
        fullWidth
        margin='normal'
        required
        placeholder='请输入密码'
      />

      {/* 错误文本框 */}
      <TextField
        label='邮箱'
        variant='outlined'
        type='email'
        fullWidth
        margin='normal'
        error
        helperText='请输入有效的邮箱地址'
        placeholder='请输入邮箱'
      />
    </div>
  );
}

/**
 * Material-UI 选择框示例
 */
export function MaterialUISelectExample() {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Material-UI 选择框示例</h3>

      {/* 标准选择框 */}
      <FormControl fullWidth margin='normal'>
        <InputLabel>选择角色</InputLabel>
        <Select label='选择角色' defaultValue=''>
          <MenuItem value=''>请选择</MenuItem>
          <MenuItem value='xiaoyan'>小燕</MenuItem>
          <MenuItem value='xiaoyu'>小语</MenuItem>
          <MenuItem value='xiaoming'>小明</MenuItem>
          <MenuItem value='xiaohong'>小红</MenuItem>
        </Select>
      </FormControl>

      {/* 必填选择框 */}
      <FormControl fullWidth margin='normal' required>
        <InputLabel>选择年级</InputLabel>
        <Select label='选择年级' defaultValue=''>
          <MenuItem value=''>请选择</MenuItem>
          <MenuItem value='1'>一年级</MenuItem>
          <MenuItem value='2'>二年级</MenuItem>
          <MenuItem value='3'>三年级</MenuItem>
          <MenuItem value='4'>四年级</MenuItem>
          <MenuItem value='5'>五年级</MenuItem>
          <MenuItem value='6'>六年级</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

/**
 * Material-UI 卡片示例
 */
export function MaterialUICardExample() {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Material-UI 卡片示例</h3>

      <Card>
        <CardContent>
          <h4 className='text-lg font-semibold mb-2'>卡片标题</h4>
          <p className='text-gray-600'>
            这是卡片的内容区域。您可以在卡片中放置文本、图片、按钮等组件。
            Material-UI 的卡片组件提供了统一的样式和布局。
          </p>
        </CardContent>
        <CardActions>
          <Button variant='text' color='primary'>
            查看
          </Button>
          <Button variant='text' color='secondary'>
            编辑
          </Button>
          <Button variant='text' color='error'>
            删除
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

/**
 * Material-UI 对话框示例
 */
export function MaterialUIDialogExample() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Material-UI 对话框示例</h3>

      <Button variant='contained' onClick={handleClickOpen}>
        打开对话框
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>对话框标题</DialogTitle>
        <DialogContent>
          <p className='text-gray-600'>
            这是对话框的内容区域。您可以在对话框中放置表单、文本、图片等组件。
            Material-UI 的对话框组件提供了统一的样式和布局。
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleClose} variant='contained' color='primary'>
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

/**
 * Material-UI 综合示例
 */
export function MaterialUIExample() {
  return (
    <div className='p-6 space-y-8 bg-gray-50 rounded-lg'>
      <h2 className='text-2xl font-bold mb-6'>Material-UI 组件示例</h2>

      <MaterialUIButtonExample />
      <hr className='my-6' />
      <MaterialUITextFieldExample />
      <hr className='my-6' />
      <MaterialUISelectExample />
      <hr className='my-6' />
      <MaterialUICardExample />
      <hr className='my-6' />
      <MaterialUIDialogExample />
    </div>
  );
}

// 添加 useState 导入
import { useState } from 'react';
