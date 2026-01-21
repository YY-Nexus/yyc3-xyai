'use client';

import React, { ReactNode, useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation, MotionProps } from 'framer-motion';
import { useResponsiveValue, ResponsiveValue } from '@/lib/responsive-system';
import {
  createVariants,
  COMMON_VARIANTS,
  MICRO_INTERACTIONS,
  DURATIONS,
  EASINGS,
} from '@/lib/animation-system';
import {
  prefersReducedMotion,
  getAnimationConfig,
  getMotionVariants,
} from '@/lib/animation-accessibility';

export interface AnimatedContainerProps {
  children: ReactNode;
  animation?:
    | 'fadeIn'
    | 'slideUp'
    | 'slideLeft'
    | 'scale'
    | 'rotateIn'
    | 'bounceIn'
    | 'none';
  duration?: number | ResponsiveValue<number>;
  delay?: number | ResponsiveValue<number>;
  stagger?: number;
  repeat?: number | boolean;
  trigger?: 'onMount' | 'onScroll' | 'onHover' | 'manual';
  hover?: boolean;
  tap?: boolean;
  viewport?: {
    once?: boolean;
    amount?: 'some' | 'all' | number;
    margin?: string | number;
  };
  className?: string;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  manualControl?: boolean;
  isPlaying?: boolean;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  animation = 'fadeIn',
  duration = DURATIONS.normal,
  delay = 0,
  stagger = 0,
  repeat = 1,
  trigger = 'onMount',
  hover = false,
  tap = false,
  viewport = { once: true, amount: 0.2 },
  className = '',
  onAnimationStart,
  onAnimationComplete,
  manualControl = false,
  isPlaying = true,
}) => {
  const ref = useRef(null);
  const viewOptions: any = {};
  if (viewport?.once !== undefined) {
    viewOptions.once = viewport.once;
  }
  if (viewport?.amount !== undefined) {
    viewOptions.amount = viewport.amount;
  }
  if (viewport?.margin !== undefined) {
    viewOptions.margin = viewport.margin;
  }
  const isInView = useInView(ref, viewOptions);
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  // 响应式值处理
  const resolvedDuration = useResponsiveValue(duration);
  const resolvedDelay = useResponsiveValue(delay);

  // 获取动画变体
  const getAnimationVariants = () => {
    if (animation === 'none') return {};

    const reducedMotion = prefersReducedMotion();
    const variants = getMotionVariants();

    const baseVariants = {
      fadeIn: variants.fadeIn,
      slideUp: variants.slideIn,
      slideLeft: variants.slideIn,
      scale: variants.scale,
      rotateIn: variants.scale,
      bounceIn: variants.bounce,
    };

    return baseVariants[animation] || baseVariants.fadeIn;
  };

  // 配置动画选项
  const getAnimationOptions = (): MotionProps => {
    const variants = getAnimationVariants();
    const config = getAnimationConfig();

    const baseOptions: MotionProps = {
      variants,
      initial: 'hidden',
      animate: shouldAnimate() ? 'visible' : 'hidden',
      exit: 'exit',
      transition: {
        duration: config.enabled ? (resolvedDuration || DURATIONS.normal) : 0,
        delay: config.enabled ? (resolvedDelay || 0) : 0,
        ease: config.enabled ? EASINGS.easeInOut : 'linear',
      },
    };

    if (onAnimationStart !== undefined) {
      baseOptions.onAnimationStart = onAnimationStart as any;
    }
    if (onAnimationComplete !== undefined) {
      baseOptions.onAnimationComplete = onAnimationComplete as any;
    }

    // 添加交互效果（仅在动画启用时）
    if (hover && config.enabled) {
      baseOptions.whileHover = {
        scale: 1.02,
        transition: { duration: DURATIONS.fast },
      };
    }

    if (tap && config.enabled) {
      baseOptions.whileTap = {
        scale: 0.98,
        transition: { duration: DURATIONS.fast },
      };
    }

    // 重复动画（仅在动画启用时）
    if ((repeat === true || (typeof repeat === 'number' && repeat > 1)) && config.enabled) {
      const currentAnimate = baseOptions.animate;
      if (typeof currentAnimate === 'object') {
        baseOptions.animate = {
          ...currentAnimate,
          transition: {
            ...(typeof baseOptions.transition === 'object' ? baseOptions.transition : {}),
            repeat: repeat === true ? Infinity : repeat - 1,
            repeatType: 'reverse' as const,
          },
        };
      }
    }

    return baseOptions;
  };

  // 判断是否应该触发动画
  const shouldAnimate = () => {
    if (manualControl) return isPlaying;

    switch (trigger) {
      case 'onMount':
        return true;
      case 'onScroll':
        return isInView && (!viewport.once || !hasAnimated);
      case 'onHover':
        return false; // 由鼠标事件处理
      case 'manual':
        return isPlaying;
      default:
        return true;
    }
  };

  // 处理动画触发
  useEffect(() => {
    if (trigger === 'onScroll' && isInView && !hasAnimated && !manualControl) {
      controls.start('visible');
      setHasAnimated(true);
    } else if (trigger === 'onMount' && !hasAnimated && !manualControl) {
      controls.start('visible');
      setHasAnimated(true);
    }
  }, [isInView, trigger, hasAnimated, manualControl, controls]);

  // 手动控制动画
  useEffect(() => {
    if (manualControl) {
      if (isPlaying) {
        controls.start('visible');
      } else {
        controls.stop();
      }
    }
  }, [isPlaying, manualControl, controls]);

  // 处理鼠标悬停
  const handleMouseEnter = () => {
    if (trigger === 'onHover') {
      controls.start('visible');
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'onHover') {
      controls.start('hidden');
    }
  };

  const motionProps = getAnimationOptions();

  return (
    <motion.div
      ref={ref}
      className={className}
      {...motionProps}
      animate={controls}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        originX: 0.5,
        originY: 0.5,
      }}
    >
      {children}
    </motion.div>
  );
};

// 便捷的动画组件
export const FadeIn: React.FC<
  Omit<AnimatedContainerProps, 'animation'>
> = props => <AnimatedContainer {...props} animation='fadeIn' />;

export const SlideUp: React.FC<
  Omit<AnimatedContainerProps, 'animation'>
> = props => <AnimatedContainer {...props} animation='slideUp' />;

export const SlideLeft: React.FC<
  Omit<AnimatedContainerProps, 'animation'>
> = props => <AnimatedContainer {...props} animation='slideLeft' />;

export const ScaleIn: React.FC<
  Omit<AnimatedContainerProps, 'animation'>
> = props => <AnimatedContainer {...props} animation='scale' />;

export const BounceIn: React.FC<
  Omit<AnimatedContainerProps, 'animation'>
> = props => <AnimatedContainer {...props} animation='bounceIn' />;

// 列表项动画容器
interface AnimatedListProps {
  children: ReactNode[];
  stagger?: number;
  animation?: AnimatedContainerProps['animation'];
  className?: string;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  stagger = 0.1,
  animation = 'slideUp',
  className = '',
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <AnimatedContainer
          key={index}
          animation={animation}
          delay={index * stagger}
          trigger='onScroll'
        >
          {child}
        </AnimatedContainer>
      ))}
    </div>
  );
};

// 交错动画容器
export const StaggerContainer: React.FC<{
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}> = ({ children, staggerDelay = 0.1, className = '' }) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      } as any,
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};
