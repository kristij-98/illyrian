export const motionTokens = {
  durations: {
    xfast: 0.12,
    fast: 0.18,
    base: 0.28,
    slow: 0.55,
    xslow: 0.75
  },
  easing: {
    easeOutSoft: [0.16, 1, 0.3, 1] as const,
    easeInOutSoft: [0.65, 0, 0.35, 1] as const
  },
  distances: {
    sm: 10,
    md: 14
  },
  stagger: {
    row: 0.08,
    list: 0.06
  }
};
