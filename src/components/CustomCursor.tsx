'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Position of the mouse
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics for smooth trailing cursor
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Find closest element with data-cursor attribute
      const interactiveEl = target.closest('[data-cursor]');
      if (interactiveEl) {
        const cursorType = interactiveEl.getAttribute('data-cursor');
        setHoveredType(cursorType);
      } else {
        // Check if it's a standard link or button
        const isStandardInteractive = target.closest('a, button, input[type="submit"], [role="button"]');
        if (isStandardInteractive) {
          setHoveredType('pointer');
        } else {
          setHoveredType(null);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  // Render sizes and styling based on hovered target
  const getVariants = () => {
    switch (hoveredType) {
      case 'explore':
        return {
          width: 80,
          height: 80,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          color: '#050507',
          mixBlendMode: 'normal' as const,
        };
      case 'listen':
        return {
          width: 80,
          height: 80,
          backgroundColor: 'rgba(244, 114, 182, 0.95)', // Pink accent
          color: '#ffffff',
          mixBlendMode: 'normal' as const,
        };
      case 'pointer':
        return {
          width: 45,
          height: 45,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.6)',
          borderWidth: 1.5,
          color: '#ffffff',
          mixBlendMode: 'difference' as const,
        };
      default:
        return {
          width: 20,
          height: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderColor: 'rgba(255, 255, 255, 0.4)',
          borderWidth: 1,
          color: '#ffffff',
          mixBlendMode: 'difference' as const,
        };
    }
  };

  const currentStyles = getVariants();

  return (
    <>
      {/* Outer circular trailing element */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full hidden lg:flex items-center justify-center font-display text-[11px] font-bold tracking-widest uppercase select-none overflow-hidden"
        style={{
          left: cursorX,
          top: cursorY,
          x: '-50%',
          y: '-50%',
          ...currentStyles,
        }}
        animate={{
          scale: 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      >
        {hoveredType === 'explore' && (
          <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}>
            KEŞFET
          </motion.span>
        )}
        {hoveredType === 'listen' && (
          <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}>
            DİNLE
          </motion.span>
        )}
      </motion.div>

      {/* Tiny inner dot following exactly with the mouse coordinates (no delay) */}
      <motion.div
        className="fixed pointer-events-none z-[10000] w-1.5 h-1.5 bg-white rounded-full hidden lg:block"
        style={{
          left: mouseX,
          top: mouseY,
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          scale: hoveredType ? 0.3 : 1,
        }}
      />
    </>
  );
};
