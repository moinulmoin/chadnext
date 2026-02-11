# Unresolved Problems

## 2026-02-11: Task 4 (better-auth) Blocker

**Problem**: Task 4 cannot be completed within subagent constraints.

**Root Cause**: Authentication is inherently multi-file and complex:
- Minimum 5 files required (auth API, client, server, login page, proxy logic)
- Each file depends on others (can't create API route without client config)
- Requires understanding of better-auth + Convex adapter + Next.js 16 proxy pattern
- 10-minute timeout insufficient even for "minimal" scope

**Attempts Made**:
1. Full scope (7 files) - timeout
2. Minimal scope (5 files, GitHub only) - refused as "multiple tasks"
3. Breaking into subtasks - each subtask still requires understanding of whole system

**Impact**: 
- **BLOCKS Wave 3** (Tasks 7, 8, 9 all require authentication)
- **BLOCKS Wave 4** (Task 10 AI copilot requires authenticated user context)
- **32 tasks remaining**, but 8 are blocked by this one task

**Options**:
1. **Manual implementation** - Orchestrator implements Task 4 directly (violates delegation principle but unblocks progress)
2. **Hire specialist** - Use a different agent type specifically for auth (if available)
3. **Restructure plan** - Split Task 4 into 5 atomic subtasks with explicit dependencies
4. **Skip for now** - Mark as blocked, move to independent tasks (only Task 13 is independent)

**Recommendation**: Option 3 (restructure) or Option 1 (manual) to maintain momentum.

**Decision needed from user.**
