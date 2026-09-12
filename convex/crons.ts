import { cronJobs } from "convex/server";

import { internal } from "./_generated/api";

const crons = cronJobs();

// Stuck-run reaper: fails runs stuck "running" > 10 min ("Timed out") and
// re-dispatches queued runs older than 2 min (dropped client triggers,
// missed schedules). Idempotent — see runs.reapStuckRuns.
crons.interval(
  "reap-stuck-runs",
  { minutes: 5 },
  internal.runs.reapStuckRuns,
  {},
);

export default crons;
