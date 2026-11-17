// src/utils/delay.ts
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
