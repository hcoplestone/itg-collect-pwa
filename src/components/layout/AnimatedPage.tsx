import { motion } from 'framer-motion';
import { pageFadeVariants, DURATION } from '@/lib/animations';

export function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageFadeVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: DURATION.normal }}
      className="contents"
    >
      {children}
    </motion.div>
  );
}
