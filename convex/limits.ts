/**
 * Free plan daily run quota, enforced server-side in convex/runs.ts.
 * Pro = unlimited runs (plan read from the Polar component via
 * billing.getUserPlanInternal).
 */
export const FREE_RUNS_PER_DAY = 10;
