/**
 * 动画可访问性配置
 * 根据用户偏好调整动画效果
 */

/**
 * 检查用户是否偏好减少动画
 * @returns 是否应该减少动画
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * 获取动画配置
 * @returns 动画配置对象
 */
export function getAnimationConfig() {
  const reducedMotion = prefersReducedMotion();

  return {
    // 是否启用动画
    enabled: !reducedMotion,

    // 动画持续时间（毫秒）
    duration: reducedMotion ? 0 : {
      fast: 150,
      normal: 300,
      slow: 500,
    },

    // 动画缓动函数
    easing: reducedMotion ? 'linear' : {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },

    // 是否启用特定动画类型
    animations: reducedMotion ? {
      fadeIn: false,
      slideIn: false,
      scale: false,
      bounce: false,
      rotate: false,
      shake: false,
      pulse: false,
      float: false,
    } : {
      fadeIn: true,
      slideIn: true,
      scale: true,
      bounce: true,
      rotate: true,
      shake: true,
      pulse: true,
      float: true,
    },

    // 过渡效果
    transitions: reducedMotion ? {
      enabled: false,
      duration: 0,
    } : {
      enabled: true,
      duration: 200,
    },
  };
}

/**
 * 监听动画偏好变化
 * @param callback 偏好变化时的回调函数
 * @returns 清理函数
 */
export function watchReducedMotionPreference(
  callback: (prefersReduced: boolean) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const handler = (event: MediaQueryListEvent) => {
    callback(event.matches);
  };

  mediaQuery.addEventListener('change', handler);

  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}

/**
 * 获取安全的动画属性
 * @param animationType 动画类型
 * @returns 动画属性对象
 */
export function getSafeAnimationProps(animationType: keyof ReturnType<typeof getAnimationConfig>['animations']) {
  const config = getAnimationConfig();

  if (!config.animations[animationType]) {
    return {
      animate: undefined,
      transition: { duration: 0 },
      whileHover: undefined,
      whileTap: undefined,
    };
  }

  return {
    animate: true,
    transition: {
      duration: config.duration.normal / 1000,
      ease: config.easing.default,
    },
  };
}

/**
 * Framer Motion 变体配置
 */
export const motionVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  },

  slideIn: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  },

  scale: {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  },

  bounce: {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 17,
      },
    },
  },
};

/**
 * 获取减少动画的变体
 */
export function getReducedMotionVariants() {
  return {
    fadeIn: {
      hidden: { opacity: 1 },
      visible: { opacity: 1 },
    },
    slideIn: {
      hidden: { opacity: 1, y: 0 },
      visible: { opacity: 1, y: 0 },
    },
    scale: {
      hidden: { scale: 1, opacity: 1 },
      visible: { scale: 1, opacity: 1 },
    },
    bounce: {
      hidden: { scale: 1 },
      visible: { scale: 1 },
    },
  };
}

/**
 * 根据用户偏好获取变体
 */
export function getMotionVariants() {
  const reducedMotion = prefersReducedMotion();
  return reducedMotion ? getReducedMotionVariants() : motionVariants;
}
