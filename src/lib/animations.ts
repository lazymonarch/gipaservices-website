import type { Transition, Variants } from "framer-motion";

export const REVEAL_DURATION = 0.6;
export const REVEAL_EASE: [number, number, number, number] = [
  0.25, 0.8, 0.25, 1,
];

export const revealViewport = { once: true, amount: 0.2 } as const;

function revealTransition(delay = 0): Transition {
  return {
    duration: REVEAL_DURATION,
    ease: REVEAL_EASE,
    delay,
  };
}

export const revealVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: revealTransition(delay),
  }),
};

export const leftReveal: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: revealTransition(delay),
  }),
};

export const rightReveal: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: revealTransition(delay),
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const cardStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
