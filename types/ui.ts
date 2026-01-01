/**
 * @file UI组件类型定义
 * @description 项目中所有UI组件的Props和状态类型定义
 * @module types/ui
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import type { ReactNode, CSSProperties } from 'react'

export type Variant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'

export type Size = 'sm' | 'md' | 'lg' | 'xl' | 'icon'

export type ColorScheme = 'light' | 'dark' | 'system'

export type Orientation = 'horizontal' | 'vertical'

export type Align = 'start' | 'center' | 'end' | 'stretch'

export type Justify = 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'

export type Direction = 'row' | 'row-reverse' | 'column' | 'column-reverse'

export type Wrap = 'nowrap' | 'wrap' | 'wrap-reverse'

export interface BaseComponentProps {
  id?: string
  className?: string
  style?: CSSProperties
  'data-testid'?: string
}

export interface ButtonProps extends BaseComponentProps {
  variant?: Variant
  size?: Size
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  onClick?: () => void
  children?: ReactNode
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  error?: string
  helperText?: string
  label?: string
  size?: Size
  fullWidth?: boolean
  onChange?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  group?: string
}

export interface SelectProps extends BaseComponentProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  helperText?: string
  label?: string
  size?: Size
  fullWidth?: boolean
  searchable?: boolean
  onChange?: (value: string) => void
}

export interface CheckboxProps extends BaseComponentProps {
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  indeterminate?: boolean
  label?: string
  error?: string
  helperText?: string
  onChange?: (checked: boolean) => void
}

export interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

export interface RadioGroupProps extends BaseComponentProps {
  name: string
  options: RadioOption[]
  value?: string
  defaultValue?: string
  disabled?: boolean
  orientation?: Orientation
  label?: string
  error?: string
  helperText?: string
  onChange?: (value: string) => void
}

export interface SwitchProps extends BaseComponentProps {
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  label?: string
  description?: string
  onChange?: (checked: boolean) => void
}

export interface SliderProps extends BaseComponentProps {
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  marks?: Array<{ value: number; label: string }>
  label?: string
  onChange?: (value: number[]) => void
}

export interface DialogProps extends BaseComponentProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  children?: ReactNode
}

export interface ModalProps extends DialogProps {
  footer?: ReactNode
  actions?: Array<{
    label: string
    variant?: Variant
    onClick: () => void
    disabled?: boolean
  }>
}

export interface AlertProps extends BaseComponentProps {
  variant?: 'default' | 'destructive' | 'warning' | 'success' | 'info'
  title?: string
  description?: string
  showIcon?: boolean
  dismissible?: boolean
  onClose?: () => void
}

export interface ToastProps extends BaseComponentProps {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  title?: string
  description?: string
  duration?: number
  showCloseButton?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export interface TooltipProps extends BaseComponentProps {
  content: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delay?: number
  disabled?: boolean
  children?: ReactNode
}

export interface PopoverProps extends BaseComponentProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  content: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  trigger?: ReactNode
}

export interface DropdownMenuItem {
  label: string
  value?: string
  icon?: ReactNode
  disabled?: boolean
  onClick?: () => void
  children?: DropdownMenuItem[]
}

export interface DropdownMenuProps extends BaseComponentProps {
  items: DropdownMenuItem[]
  trigger: ReactNode
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom'
}

export interface TabsProps extends BaseComponentProps {
  defaultValue?: string
  value?: string
  orientation?: Orientation
  onValueChange?: (value: string) => void
  children?: ReactNode
}

export interface TabProps extends BaseComponentProps {
  value: string
  label: string
  icon?: ReactNode
  disabled?: boolean
}

export interface AccordionProps extends BaseComponentProps {
  defaultValue?: string[]
  value?: string[]
  collapsible?: boolean
  onValueChange?: (value: string[]) => void
  children?: ReactNode
}

export interface AccordionItemProps extends BaseComponentProps {
  value: string
  title: string
  description?: string
  icon?: ReactNode
  disabled?: boolean
  children?: ReactNode
}

export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'outlined' | 'elevated'
  hoverable?: boolean
  clickable?: boolean
  onClick?: () => void
  children?: ReactNode
}

export interface AvatarProps extends BaseComponentProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
}

export interface BadgeProps extends BaseComponentProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
  dot?: boolean
  count?: number
  max?: number
  showZero?: boolean
  children?: ReactNode
}

export interface ProgressProps extends BaseComponentProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
  label?: string
}

export interface SkeletonProps extends BaseComponentProps {
  variant?: 'text' | 'rectangular' | 'circular'
  width?: number | string
  height?: number | string
  animation?: 'pulse' | 'wave' | 'none'
}

export interface TableProps<T = unknown> extends BaseComponentProps {
  data: T[]
  columns: TableColumn<T>[]
  selectable?: boolean
  sortable?: boolean
  pagination?: boolean
  pageSize?: number
  loading?: boolean
  onRowClick?: (row: T) => void
  onSelectionChange?: (selected: T[]) => void
}

export interface TableColumn<T = unknown> {
  key: keyof T | string
  title: string
  width?: number | string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  render?: (value: unknown, row: T) => ReactNode
}

export interface FormFieldProps extends BaseComponentProps {
  name: string
  label?: string
  description?: string
  required?: boolean
  error?: string
  children?: ReactNode
}

export interface FormProps extends BaseComponentProps {
  onSubmit?: (data: Record<string, unknown>) => void
  onReset?: () => void
  disabled?: boolean
  children?: ReactNode
}

export interface DatePickerProps extends BaseComponentProps {
  value?: Date
  defaultValue?: Date
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  format?: string
  onChange?: (date: Date | undefined) => void
}

export interface TimePickerProps extends BaseComponentProps {
  value?: Date
  defaultValue?: Date
  placeholder?: string
  disabled?: boolean
  format?: string
  onChange?: (time: Date | undefined) => void
}

export interface UploadProps extends BaseComponentProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxCount?: number
  disabled?: boolean
  listType?: 'text' | 'picture' | 'picture-card'
  onChange?: (files: File[]) => void
  onPreview?: (file: File) => void
  onRemove?: (file: File) => void
}

export interface FileItem {
  id: string
  name: string
  size: number
  type: string
  url?: string
  status: 'uploading' | 'done' | 'error'
  percent?: number
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'bars'
  color?: string
  fullscreen?: boolean
  text?: string
}

export interface EmptyProps extends BaseComponentProps {
  image?: ReactNode
  description?: string
  action?: ReactNode
}

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: ReactNode
}

export interface BreadcrumbProps extends BaseComponentProps {
  items: BreadcrumbItem[]
  separator?: ReactNode
}

export interface PaginationProps extends BaseComponentProps {
  current: number
  total: number
  pageSize?: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: (total: number, range: [number, number]) => ReactNode
  onChange?: (page: number, pageSize: number) => void
}

export interface DrawerProps extends BaseComponentProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  placement?: 'top' | 'right' | 'bottom' | 'left'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  children?: ReactNode
}

export interface MenuProps extends BaseComponentProps {
  items: MenuItem[]
  selectedKeys?: string[]
  defaultSelectedKeys?: string[]
  mode?: 'vertical' | 'horizontal'
  inlineCollapsed?: boolean
  onClick?: (item: MenuItem) => void
}

export interface MenuItem {
  key: string
  label: string
  icon?: ReactNode
  disabled?: boolean
  children?: MenuItem[]
}

export interface StepProps {
  title: string
  description?: string
  icon?: ReactNode
  status?: 'wait' | 'process' | 'finish' | 'error'
}

export interface StepperProps extends BaseComponentProps {
  current: number
  steps: StepProps[]
  direction?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  onChange?: (current: number) => void
}

export interface ChipProps extends BaseComponentProps {
  label: string
  variant?: 'default' | 'outlined' | 'filled'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  avatar?: ReactNode
  icon?: ReactNode
  onDelete?: () => void
  onClick?: () => void
}

export interface DividerProps extends BaseComponentProps {
  orientation?: 'horizontal' | 'vertical'
  text?: string
  dashed?: boolean
}

export interface CollapseProps extends BaseComponentProps {
  items: CollapseItem[]
  defaultActiveKey?: string[]
  activeKey?: string[]
  accordion?: boolean
  onChange?: (activeKeys: string[]) => void
}

export interface CollapseItem {
  key: string
  label: string
  children?: ReactNode
  disabled?: boolean
  extra?: ReactNode
}

export interface ListProps<T = unknown> extends BaseComponentProps {
  data: T[]
  renderItem?: (item: T, index: number) => ReactNode
  loading?: boolean
  bordered?: boolean
  split?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export interface ListItemProps extends BaseComponentProps {
  actions?: ReactNode[]
  extra?: ReactNode
  children?: ReactNode
}

export interface TreeProps extends BaseComponentProps {
  data: TreeNode[]
  selectedKeys?: string[]
  defaultSelectedKeys?: string[]
  expandedKeys?: string[]
  defaultExpandedKeys?: string[]
  checkable?: boolean
  checkedKeys?: string[]
  defaultCheckedKeys?: string[]
  onSelect?: (selectedKeys: string[]) => void
  onCheck?: (checkedKeys: string[]) => void
  onExpand?: (expandedKeys: string[]) => void
}

export interface TreeNode {
  key: string
  title: string
  icon?: ReactNode
  children?: TreeNode[]
  disabled?: boolean
}

export interface Theme {
  colors: {
    primary: string
    secondary: string
    success: string
    warning: string
    danger: string
    info: string
    background: string
    foreground: string
    border: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
    }
    fontWeight: {
      normal: number
      medium: number
      bold: number
    }
  }
}

export interface ResponsiveValue<T> {
  base?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
}

export interface AnimationProps {
  duration?: number
  delay?: number
  easing?: string
  repeat?: number | 'infinite'
  direction?: 'normal' | 'reverse' | 'alternate'
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both'
}

export interface TransitionProps {
  enter?: AnimationProps
  exit?: AnimationProps
}
