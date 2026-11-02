'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

import { cn } from '@/lib/format';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  duration?: number;
  once?: boolean;
};

export default function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
  duration = 0.7,
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduced ? false : { opacity: 1, y: distance }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, margin: '-70px 0px -70px 0px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
