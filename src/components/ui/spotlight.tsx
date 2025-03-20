'use client';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useSpring, useTransform, SpringOptions } from 'framer-motion';
import { cn } from '@/lib/utils';

type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
  forceVisible?: boolean;
  color?: string;
};

export function Spotlight({
  className,
  size = 200,
  springOptions = { bounce: 0 },
  forceVisible = false,
  color = 'white',
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`);

  // Determine gradient colors based on the color prop
  const getGradientClasses = () => {
    // Check if it's a hex color that's not one of our predefined colors
    if (color.startsWith('#')) {
      // For custom hex colors, we'll use inline styles instead of Tailwind classes
      return ''; // Return empty string for class
    }
    
    switch (color) {
      case 'white':
        return 'from-zinc-50 via-zinc-100 to-zinc-200';
      case '#3b82f6': // blue
        return 'from-blue-300 via-blue-400 to-blue-500';
      case '#8b5cf6': // purple
        return 'from-purple-300 via-purple-400 to-purple-500';
      case '#ec4899': // pink
        return 'from-pink-300 via-pink-400 to-pink-500';
      case '#f97316': // orange
        return 'from-orange-300 via-orange-400 to-orange-500';
      default:
        return 'from-zinc-50 via-zinc-100 to-zinc-200';
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement;
      if (parent) {
        parent.style.position = 'relative';
        parent.style.overflow = 'hidden';
        setParentElement(parent);
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return;
      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    },
    [mouseX, mouseY, parentElement]
  );

  useEffect(() => {
    if (!parentElement) return;

    parentElement.addEventListener('mousemove', handleMouseMove);
    parentElement.addEventListener('mouseenter', () => setIsHovered(true));
    parentElement.addEventListener('mouseleave', () => setIsHovered(false));

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove);
      parentElement.removeEventListener('mouseenter', () => setIsHovered(true));
      parentElement.removeEventListener('mouseleave', () =>
        setIsHovered(false)
      );
    };
  }, [parentElement, handleMouseMove]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)] blur-xl transition-opacity duration-200',
        getGradientClasses(),
        forceVisible || isHovered ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
        // Add custom gradient for hex colors
        ...(color.startsWith('#') && !Object.keys({white: true, '#3b82f6': true, '#8b5cf6': true, '#ec4899': true, '#f97316': true}).includes(color) ? {
          background: `radial-gradient(circle at center, ${color}33, ${color}66, ${color}99, transparent 80%)`,
        } : {})
      }}
    />
  );
} 