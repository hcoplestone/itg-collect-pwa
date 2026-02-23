import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { wizardSlideVariants, DURATION } from '@/lib/animations';

export function WizardStepTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const direction = (location.state as any)?.direction ?? 1;

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={location.pathname}
        custom={direction}
        variants={wizardSlideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: DURATION.normal, ease: 'easeInOut' }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
