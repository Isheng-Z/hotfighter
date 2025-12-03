import { SRSState, Rating } from '../types';

/**
 * Calculates the new state of a card based on the user's rating.
 * Uses a variation of the SM-2 algorithm, optimized for Ebbinghaus curve.
 */
export const calculateNextReview = (current: SRSState, rating: Rating): SRSState => {
  let { interval, repetition, efactor } = current;

  if (rating === Rating.Forgot) {
    // Forgot: Reset strictly to 0. Review tomorrow.
    repetition = 0;
    interval = 1;
  } else {
    // Rating 3 (Hazy) or 5 (Mastered)
    
    // Update E-Factor
    // Standard SM-2 Formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    // If q=3 (Hazy): EF' = EF - 0.14 (Gets harder)
    // If q=5 (Mastered): EF' = EF + 0.1 (Gets easier)
    efactor = efactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
    if (efactor < 1.3) efactor = 1.3;

    repetition += 1;

    // Interval Calculation
    if (repetition === 1) {
      interval = 1;
    } else if (repetition === 2) {
      // SM-2 default is 6. 
      // We change to 3 for a smoother Ebbinghaus curve (1 -> 3 -> 7...)
      // This ensures "Hazy" items are seen again relatively soon.
      interval = 3;
    } else {
      interval = Math.round(interval * efactor);
    }
  }

  // Calculate due date (Now + Interval in days)
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const dueDate = now + (interval * oneDay);

  return {
    interval,
    repetition,
    efactor,
    dueDate
  };
};

export const getInitialSRSState = (): SRSState => ({
  interval: 0,
  repetition: 0,
  efactor: 2.5,
  dueDate: Date.now(),
});