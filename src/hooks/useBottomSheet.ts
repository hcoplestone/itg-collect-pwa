import { useCallback, useEffect, useRef, useState } from 'react';

interface BottomSheetConfig {
  closedHeight: number;
  openFraction: number;
  dragThreshold: number;
}

interface BottomSheetReturn {
  sheetY: number;
  isDragging: boolean;
  isOpen: boolean;
  openY: number;
  closedY: number;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useBottomSheet(config: BottomSheetConfig): BottomSheetReturn {
  const { closedHeight, openFraction, dragThreshold } = config;

  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );
  const openY = viewportHeight * (1 - openFraction);
  const closedY = viewportHeight - closedHeight;

  const [sheetY, setSheetY] = useState(closedY);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const dragStartY = useRef(0);
  const dragStartSheetY = useRef(0);
  const lastMoveY = useRef(0);
  const lastMoveTime = useRef(0);
  const velocity = useRef(0);
  const hasDragged = useRef(false);

  // Keep closedY in sync when viewport changes (but not during drag)
  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Sync sheetY when viewport resizes (only when not dragging)
  useEffect(() => {
    if (!isDragging) {
      setSheetY(isOpen ? openY : closedY);
    }
  }, [viewportHeight, isDragging, isOpen, openY, closedY]);

  const snapTo = useCallback(
    (target: 'open' | 'closed') => {
      const y = target === 'open' ? openY : closedY;
      setSheetY(y);
      setIsOpen(target === 'open');
    },
    [openY, closedY]
  );

  const open = useCallback(() => snapTo('open'), [snapTo]);
  const close = useCallback(() => snapTo('closed'), [snapTo]);
  const toggle = useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragStartY.current = e.clientY;
      dragStartSheetY.current = sheetY;
      lastMoveY.current = e.clientY;
      lastMoveTime.current = Date.now();
      velocity.current = 0;
      hasDragged.current = false;
      setIsDragging(true);
    },
    [sheetY]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;

      const deltaY = e.clientY - dragStartY.current;
      const newY = Math.min(closedY, Math.max(openY, dragStartSheetY.current + deltaY));

      if (Math.abs(e.clientY - dragStartY.current) > 5) {
        hasDragged.current = true;
      }

      // Track velocity
      const now = Date.now();
      const dt = now - lastMoveTime.current;
      if (dt > 0) {
        velocity.current = (e.clientY - lastMoveY.current) / dt; // px/ms, positive = downward
      }
      lastMoveY.current = e.clientY;
      lastMoveTime.current = now;

      setSheetY(newY);
    },
    [isDragging, openY, closedY]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      setIsDragging(false);

      // If user didn't drag meaningfully, treat as tap → toggle
      if (!hasDragged.current) {
        toggle();
        return;
      }

      const VELOCITY_THRESHOLD = 0.4; // px/ms

      // Velocity-based snap
      if (Math.abs(velocity.current) > VELOCITY_THRESHOLD) {
        if (velocity.current < 0) {
          snapTo('open');
        } else {
          snapTo('closed');
        }
        return;
      }

      // Position-based snap
      const midpoint = (openY + closedY) / 2;
      if (sheetY < midpoint) {
        snapTo('open');
      } else {
        snapTo('closed');
      }
    },
    [isDragging, sheetY, openY, closedY, snapTo, toggle]
  );

  return {
    sheetY,
    isDragging,
    isOpen,
    openY,
    closedY,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    open,
    close,
    toggle,
  };
}
