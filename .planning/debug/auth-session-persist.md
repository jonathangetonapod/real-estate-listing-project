---
status: diagnosed
trigger: "User appears signed out on page refresh - shows 'Good morning, Agent' instead of name, sometimes redirected to /login. Console shows lock timeout warning."
created: 2026-03-29T20:00:00-05:00
updated: 2026-03-29T20:00:00-05:00
---

## Current Focus

hypothesis: Multiple interacting issues cause session flash on refresh
test: Code analysis and trace of initialization sequence
expecting: Identify race conditions and lock contention
next_action: Report diagnosis

## Symptoms

expected: On page refresh at /app, user stays logged in, greeting shows "Good morning, Jonathan"
actual: Briefly shows "Good morning, Agent", sometimes redirects to /login entirely
errors: "@supabase/gotrue-js: Lock "lock:sb-qtoptwgmqulrumyojtjv-auth-token" was not released within 5000ms"
reproduction: Log in via Google OAuth, navigate to /app, refresh page
started: After recent auth changes (commit a7f27b4)

## Eliminated

- hypothesis: persistSession/autoRefreshToken not set
  evidence: These are correctly configured in supabase.js (commit a7f27b4)
  timestamp: 2026-03-29T20:00:00

- hypothesis: Profile fetch failing (no retry)
  evidence: Retry logic with 3 attempts and backoff is correctly implemented in AuthContext
  timestamp: 2026-03-29T20:00:00

## Evidence

- timestamp: 2026-03-29T20:00:00
  checked: Lock warning error message format
  found: Warning says lock "lock:sb-qtoptwgmqulrumyojtjv-auth-token" - this is the DEFAULT storage key, not "offmarket-auth"
  implication: CRITICAL - The lock warning references the OLD default key, meaning either (a) there's an orphaned lock from a previous session under the old key, or (b) a second Supabase client instance exists somewhere using the default key

- timestamp: 2026-03-29T20:01:00
  checked: Custom storageKey configuration
  found: storageKey is set to 'offmarket-auth' in supabase.js. The lock name should be "lock:offmarket-auth". But the console shows "lock:sb-qtoptwgmqulrumyojtjv-auth-token" (the default key format).
  implication: This means the lock warning is from a DIFFERENT client instance or from a previous session before the storageKey was changed. The lock system uses navigator.locks which persist per-origin. An orphaned lock from the old default key could be held by a stale service worker or tab.

- timestamp: 2026-03-29T20:02:00
  checked: React StrictMode in main.jsx
  found: App is wrapped in <StrictMode> which causes double mount/unmount in development
  implication: StrictMode double-mounts AuthProvider, causing TWO calls to supabase.auth.getSession() and TWO calls to supabase.auth.onAuthStateChange(). The first mount's cleanup runs (unsubscribe + mounted=false), but the navigator lock from the first mount's initialize() may not be released in time for the second mount's initialize() to acquire it within 5000ms.

- timestamp: 2026-03-29T20:03:00
  checked: AuthContext initialization sequence
  found: Both getSession() and onAuthStateChange() each need to acquire the lock independently. getSession() calls _acquireLock, and onAuthStateChange() also calls _acquireLock (for _emitInitialSession). With StrictMode: Mount1 starts getSession() (acquires lock) -> Mount1 starts onAuthStateChange() (queued behind lock) -> Mount1 cleanup (unmounts, but lock is still held by async operations) -> Mount2 starts getSession() (needs lock, but Mount1 still holds it) -> Mount2 starts onAuthStateChange() (also needs lock). This creates lock contention.
  implication: The 5-second lock timeout fires because Mount1's async operations hold the lock while Mount2 is waiting.

- timestamp: 2026-03-29T20:04:00
  checked: Race condition between getSession, onAuthStateChange, and ProtectedRoute
  found: In AuthContext, getSession().then() runs asynchronously. Meanwhile, onAuthStateChange registers a listener that also fires INITIAL_SESSION. Both update the same state (user, session, profile). ProtectedRoute checks `loading` and `user` - if loading becomes false before session is restored, user is null, and Navigate to="/login" fires.
  implication: The 5-second safety timeout (line 85-87) is the gun: if the lock contention delays getSession() beyond 5 seconds, the safety timeout sets loading=false while user is still null, causing the redirect to /login.

- timestamp: 2026-03-29T20:05:00
  checked: Safety timeout interaction
  found: Line 85-87 has `setTimeout(() => { if (mounted && loading) setLoading(false) }, 5000)`. The lock timeout is also 5000ms (default lockAcquireTimeout). If the lock times out at ~5000ms, the safety timeout fires at exactly the same time, setting loading=false with user=null.
  implication: The safety timeout and lock timeout are racing. The safety timeout "saves" the app from infinite loading but causes the flash of unauthenticated state or redirect.

- timestamp: 2026-03-29T20:06:00
  checked: The "Good morning, Agent" fallback
  found: AppDashboard line 4198: `const displayName = profile?.full_name || 'Agent'`. Line 4352: greeting uses firstName derived from displayName. When profile is null (still loading or failed), it shows "Agent".
  implication: Even when user session is restored but profile fetch hasn't completed yet, the UI shows "Agent". The profile fetch happens asynchronously AFTER session restore, so there's a window where user exists but profile is null.

## Resolution

root_cause: |
  Three interacting issues cause this bug:

  1. **React StrictMode double-mount causes lock contention (PRIMARY):** StrictMode mounts AuthProvider twice in dev. The first mount calls initialize() which acquires the navigator lock. The cleanup unmounts but the async lock operation continues. The second mount tries to acquire the same lock but it's still held, causing the 5000ms timeout warning. After timeout, the library recovers by stealing the lock, but this adds up to 5 seconds delay to session restoration.

  2. **Custom storageKey orphans the old session (SECONDARY):** Changing storageKey from default ("sb-qtoptwgmqulrumyojtjv-auth-token") to "offmarket-auth" means the session data stored in localStorage under the old key is invisible to the new client. Users who logged in before commit a7f27b4 have their session stored under the old key. The new client can't find it and treats the user as unauthenticated. The lock warning still references the OLD key name, suggesting there may also be lingering lock state from the old key.

  3. **Safety timeout races with lock timeout (TRIGGER):** The 5000ms safety timeout in AuthContext fires at the same time as the 5000ms lock acquire timeout. If the lock is contended (from StrictMode or orphaned locks), the safety timeout sets loading=false while user is still null. ProtectedRoute then sees !user and redirects to /login.

  In production (no StrictMode), issue #1 is less severe but #2 and #3 still apply. The lock warning in the console confirms lock contention is happening even in production, likely from the storageKey change or from multiple tab scenarios.

fix: (not applied - diagnosis only)
verification: (not applied - diagnosis only)
files_changed: []
