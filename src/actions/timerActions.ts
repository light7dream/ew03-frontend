export const START_TIMER = 'START_TIMER';
export const STOP_TIMER = 'STOP_TIMER';
export const RESET_TIMER = 'RESET_TIMER';
export const TICK = 'TICK';

export const tick = () => ({
  type: TICK
});

export const startTimer = () => ({
  type: START_TIMER
});

export const stopTimer = () => ({
  type: STOP_TIMER
});

export const resetTimer = () => ({
  type: RESET_TIMER
});
