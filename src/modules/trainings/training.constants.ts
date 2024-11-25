export const TRAINING_CONSTRAINTS = {
  MIN_DURATION_MINUTES: 30,
  MAX_DURATION_MINUTES: 180,
  DEFAULT_MAX_PLAYERS: 6,
  MIN_ADVANCE_BOOKING_HOURS: 2,
  MAX_ADVANCE_BOOKING_DAYS: 30,
} as const;

export const TRAINING_PRICING = {
  BASE_PRICE_PER_HOUR: 500,
  PLAYER_SURCHARGE: 50, // příplatek za každého dalšího hráče
  PREMIUM_SURFACE_SURCHARGE: 100, // příplatek za speciální povrchy
} as const;
