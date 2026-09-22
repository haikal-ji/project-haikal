'use client';

import React, { useRef, useEffect, useState, type CSSProperties } from 'react';
import { gsap } from 'gsap';

export interface PixelTransitionProps {
  firstContent: React.ReactNode | string;
  secondContent: React.ReactNode | string;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
  aspectRatio?: string;
}

const PixelTransition: React.FC<PixelTransitionProps> = ({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = 'currentColor',
  animationStepDuration = 0.3,
  once = false,
  aspectRatio = '100%',
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pixelGridRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);

  const [isActive, setIsActive] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    setIsTouchDevice(
      typeof window !== 'undefined' &&
        ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches)
    );
  }, []);

  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;

    pixelGridEl.innerHTML = '';

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixelated-image-card__pixel', 'absolute');
        pixel.style.display = 'none';
        pixel.style.backgroundColor = pixelColor;
        pixel.style.pointerEvents = 'none';

        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;

        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  const animatePixels = (activate: boolean): void => {
    setIsActive(activate);

    const pixelGridEl = pixelGridRef.current;
    const activeEl = activeRef.current;
    if (!pixelGridEl || !activeEl) return;

    const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>('.pixelated-image-card__pixel');
    if (!pixels.length) return;

    gsap.killTweensOf(pixels);
    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
    }

    gsap.set(pixels, { display: 'none' });

    const totalPixels = pixels.length;
    const staggerDuration = animationStepDuration / totalPixels;

    gsap.to(pixels, {
      display: 'block',
      duration: 0,
      stagger: {
        each: staggerDuration,
        from: 'random'
      }
    });

    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      activeEl.style.display = activate ? 'block' : 'none';
      activeEl.style.pointerEvents = activate ? 'none' : '';
    });

    gsap.to(pixels, {
      display: 'none',
      duration: 0,
      delay: animationStepDuration,
      stagger: {
        each: staggerDuration,
        from: 'random'
      }
    });
  };

  const handleEnter = (): void => {
    if (isTouchDevice) return;
    if (!isActive) animatePixels(true);
  };
  const handleLeave = (): void => {
    if (isTouchDevice) return;
    if (isActive && !once) animatePixels(false);
  };
  const handleClick = (): void => {
    if (!isActive) animatePixels(true);
    else if (isActive && !once) animatePixels(false);
  };

  return (
    <div
      ref={containerRef}
      className={`
        relative
        overflow-hidden
        cursor-pointer
        select-none
        [touch-action:manipulation]
        [isolation:isolate]
        [mask-image:-webkit-radial-gradient(white,black)]
        ${className || 'bg-[#222] text-white rounded-[15px] border-2 border-white w-[300px] max-w-full'}
      `}
      style={style}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      onFocus={handleEnter}
      onBlur={handleLeave}
      tabIndex={0}
      role="button"
      aria-label="Pixel transition image"
    >
      <div style={{ paddingTop: aspectRatio }} />

      <div className="absolute inset-0 w-full h-full z-[1]" aria-hidden={isActive}>
        {firstContent}
      </div>

      <div
        ref={activeRef}
        className="absolute inset-0 w-full h-full z-[2]"
        style={{ display: 'none' }}
        aria-hidden={!isActive}
      >
        {secondContent}
      </div>

      <div ref={pixelGridRef} className="absolute inset-0 w-full h-full pointer-events-none z-[10]" />
    </div>
  );
};

export default PixelTransition;
