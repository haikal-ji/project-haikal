'use client';

import { motion, useMotionValue, useTransform, animate, type PanInfo } from 'motion/react';
import { useState, useEffect, useRef, useCallback } from 'react';

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  isTopCard: boolean;
  disableDrag?: boolean;
}

function CardRotate({
  children,
  onSendToBack,
  sensitivity,
  isTopCard,
  disableDrag = false,
}: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const isAnimatingRef = useRef(false);

  // Buttery 2D transforms — zero heavy 3D matrix decomposition on mobile GPUs
  const rotateZ = useTransform(x, [-200, 200], [-14, 14]);
  const opacity = useTransform(x, [-260, -150, 0, 150, 260], [0.35, 1, 1, 1, 0.35]);

  // Reset x and y when this card is no longer top
  useEffect(() => {
    if (!isTopCard) {
      x.set(0);
      y.set(0);
      isAnimatingRef.current = false;
    }
  }, [isTopCard, x, y]);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (isAnimatingRef.current) return;

      const isSwipe =
        Math.abs(info.offset.x) > sensitivity ||
        Math.abs(info.velocity.x) > 350 ||
        Math.abs(info.offset.y) > sensitivity * 1.3;

      if (isSwipe) {
        isAnimatingRef.current = true;
        const flyOutX =
          info.offset.x !== 0
            ? Math.sign(info.offset.x) * 350
            : info.velocity.x !== 0
            ? Math.sign(info.velocity.x) * 350
            : 350;

        animate(x, flyOutX, {
          duration: 0.2,
          ease: [0.32, 0.72, 0, 1],
        }).then(() => {
          x.set(0);
          y.set(0);
          isAnimatingRef.current = false;
          onSendToBack();
        });
      } else {
        // Smooth spring snap back to center — NEVER an abrupt teleport
        animate(x, 0, { type: 'spring', stiffness: 380, damping: 26 });
        animate(y, 0, { type: 'spring', stiffness: 380, damping: 26 });
      }
    },
    [onSendToBack, sensitivity, x, y]
  );

  if (disableDrag || !isTopCard) {
    return (
      <div className="absolute inset-0 select-none pointer-events-none" style={{ touchAction: 'auto' }}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing select-none"
      style={{
        x,
        y,
        rotateZ,
        opacity,
        touchAction: 'none', // CRITICAL: prevents mobile browser scroll gesture collision
        willChange: 'transform',
      }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.25}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

export interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  cards?: React.ReactNode[];
  animationConfig?: { stiffness: number; damping: number };
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  mobileClickOnly?: boolean;
  mobileBreakpoint?: number;
  showDots?: boolean;
  showNavButtons?: boolean;
  className?: string;
  onCardChange?: (currentIndex: number) => void;
}

export default function Stack({
  randomRotation = false,
  sensitivity = 90,
  cards = [],
  animationConfig = { stiffness: 300, damping: 24 },
  sendToBackOnClick = true,
  autoplay = false,
  autoplayDelay = 3500,
  pauseOnHover = true,
  mobileClickOnly = false,
  mobileBreakpoint = 768,
  showDots = true,
  showNavButtons = true,
  className = '',
  onCardChange,
}: StackProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < mobileBreakpoint);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, [mobileBreakpoint]);

  const shouldDisableDrag = mobileClickOnly && isMobile;

  const [stack, setStack] = useState<{ id: number; initialIndex: number; content: React.ReactNode }[]>(() =>
    cards.map((content, index) => ({ id: index + 1, initialIndex: index, content }))
  );

  useEffect(() => {
    setStack(cards.map((content, index) => ({ id: index + 1, initialIndex: index, content })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length]);

  const sendToBack = useCallback(
    (id?: number) => {
      setStack((prev) => {
        if (prev.length <= 1) return prev;
        const next = [...prev];
        const targetId = id ?? next[next.length - 1].id;
        const idx = next.findIndex((c) => c.id === targetId);
        if (idx === -1) return prev;
        const [card] = next.splice(idx, 1);
        next.unshift(card);
        return next;
      });
    },
    []
  );

  const bringFromBack = useCallback(() => {
    setStack((prev) => {
      if (prev.length <= 1) return prev;
      const next = [...prev];
      const bottomCard = next.shift();
      if (bottomCard) {
        next.push(bottomCard);
      }
      return next;
    });
  }, []);

  const topCard = stack[stack.length - 1];
  const currentCardIndex = topCard ? topCard.initialIndex : 0;

  useEffect(() => {
    if (onCardChange) {
      onCardChange(currentCardIndex);
    }
  }, [currentCardIndex, onCardChange]);

  // Autoplay loop
  useEffect(() => {
    if (!autoplay || stack.length <= 1 || isPaused || isInteracting) return;
    const interval = setInterval(() => {
      sendToBack();
    }, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, stack.length, isPaused, isInteracting, sendToBack]);

  const handleCardClick = (cardId: number, isTop: boolean) => {
    if (isTop && sendToBackOnClick) {
      sendToBack(cardId);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Card Stack Area */}
      <div
        className={`relative ${className}`}
        style={{ width: 260, height: 330 }}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        onTouchStart={() => setIsInteracting(true)}
        onTouchEnd={() => setTimeout(() => setIsInteracting(false), 3000)}
      >
        {stack.map((card, index) => {
          const isTopCard = index === stack.length - 1;
          const depthFromTop = stack.length - 1 - index;
          const randomRotate = randomRotation ? Math.sin(card.id * 99) * 4 : 0;

          // Only visually display up to 4 cards to keep mobile compositor fast
          if (depthFromTop > 3) return null;

          return (
            <CardRotate
              key={card.id}
              onSendToBack={() => sendToBack(card.id)}
              sensitivity={sensitivity}
              isTopCard={isTopCard}
              disableDrag={shouldDisableDrag}
            >
              <motion.div
                className={`rounded-2xl overflow-hidden w-full h-full shadow-2xl ${
                  isTopCard ? 'cursor-grab active:cursor-grabbing pointer-events-auto' : 'pointer-events-none'
                }`}
                onClick={() => handleCardClick(card.id, isTopCard)}
                animate={{
                  rotateZ: depthFromTop * -3.5 + randomRotate,
                  scale: 1 - depthFromTop * 0.05,
                  y: depthFromTop * 10,
                  transformOrigin: '50% 90%',
                }}
                initial={false}
                transition={{
                  type: 'spring',
                  stiffness: animationConfig.stiffness,
                  damping: animationConfig.damping,
                }}
              >
                {card.content}
              </motion.div>
            </CardRotate>
          );
        })}
      </div>

      {/* Mobile Navigation Controls & Dots */}
      {(showDots || showNavButtons) && cards.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6 select-none">
          {showNavButtons && (
            <button
              type="button"
              onClick={bringFromBack}
              aria-label="Karya sebelumnya"
              className="w-8 h-8 rounded-full border border-text-secondary/20 bg-background/80 hover:bg-thirdary/60 flex items-center justify-center text-text-primary text-xs transition-transform active:scale-90"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {showDots && (
            <div className="flex items-center gap-1.5">
              {cards.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Lihat karya ${i + 1}`}
                  onClick={() => {
                    // Cycle until card i is top
                    const targetCard = stack.find((c) => c.initialIndex === i);
                    if (targetCard && targetCard.id !== topCard?.id) {
                      sendToBack();
                    }
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentCardIndex === i
                      ? 'w-6 bg-text-primary'
                      : 'w-1.5 bg-text-secondary/30 hover:bg-text-secondary/60'
                  }`}
                />
              ))}
            </div>
          )}

          {showNavButtons && (
            <button
              type="button"
              onClick={() => sendToBack()}
              aria-label="Karya berikutnya"
              className="w-8 h-8 rounded-full border border-text-secondary/20 bg-background/80 hover:bg-thirdary/60 flex items-center justify-center text-text-primary text-xs transition-transform active:scale-90"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
