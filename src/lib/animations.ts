import type { Variants, Transition } from 'framer-motion';

// Timing
export const DURATION = { fast: 0.15, normal: 0.25, slow: 0.35 };

// Springs
export const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 500, damping: 30 };
export const SPRING_BOUNCY = { type: 'spring' as const, stiffness: 400, damping: 17 };
export const SPRING_GENTLE = { type: 'spring' as const, stiffness: 300, damping: 25 };

// Tap
export const TAP_SCALE = { scale: 0.97 };
export const TAP_SCALE_SM = { scale: 0.95 };

// Fade-up
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

// Page fade
export const pageFadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Wizard slide (direction-aware)
export const wizardSlideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

// Dialog overlay
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Dialog panel
export const dialogVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 10 },
};

// Bottom sheet
export const bottomSheetVariants: Variants = {
  hidden: { y: '100%' },
  visible: { y: 0 },
  exit: { y: '100%' },
};

// Heart pop
export const heartPopVariants: Variants = {
  idle: { scale: 1 },
  pop: {
    scale: [1, 1.3, 0.9, 1.1, 1],
    transition: { duration: 0.4 },
  },
};

// Tag toggle
export const tagToggleTransition: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 25,
};

// Success check
export const successCheckVariants: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: SPRING_BOUNCY,
  },
};

// Success ring burst
export const successRingVariants: Variants = {
  hidden: { scale: 0.8, opacity: 1 },
  visible: {
    scale: 2.5,
    opacity: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};
