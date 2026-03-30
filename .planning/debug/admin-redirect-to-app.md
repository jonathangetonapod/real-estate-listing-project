---
status: awaiting_human_verify
trigger: "Admin route /admin redirects to /app even though user has role 'admin' in Supabase"
created: 2026-03-29T00:00:00Z
updated: 2026-03-29T00:00:00Z
---

## Current Focus

hypothesis: The `is_admin()` function was recreated as plpgsql SECURITY DEFINER but the query `SELECT role FROM public.users WHERE id = auth.uid()` inside a SECURITY DEFINER function runs as the function owner (postgres), bypassing RLS — however the issue is that `loading` becomes false BEFORE `profile` is fetched, causing ProtectedRoute to see profile=null and redirect.
test: Trace the timing of setLoading(false) vs setProfile() in AuthContext
expecting: setLoading(false) fires before profile fetch completes
next_action: Analyze the race condition in onAuthStateChange callback

## Symptoms

expected: User with role='admin' accesses /admin and sees AdminDashboard
actual: User is redirected from /admin to /app
errors: Console log shows "Admin check failed - profile.role: [unknown]"
reproduction: Login with admin user, navigate to /admin
started: After RLS circular dependency fix migration

## Eliminated

## Evidence

- timestamp: 2026-03-29T00:01:00Z
  checked: AuthContext.jsx onAuthStateChange callback
  found: The callback sets loading=false on INITIAL_SESSION event but ALSO awaits fetchProfile before that — the issue is the sequence in the async callback
  implication: Need to check if setLoading(false) can fire before profile is set

- timestamp: 2026-03-29T00:02:00Z
  checked: ProtectedRoute in App.jsx
  found: When requireAdmin=true, if !profile it shows LoadingScreen. If profile exists but role!='admin', it redirects. This logic looks correct IF profile loads.
  implication: The ProtectedRoute logic is sound — the bug must be in profile not loading

- timestamp: 2026-03-29T00:03:00Z
  checked: RLS migration 20260329000005_fix_rls_circular.sql
  found: DROP FUNCTION IF EXISTS is_admin() CASCADE drops ALL policies that depend on is_admin(). The migration recreates admin policies but does NOT recreate "Users can read own profile" or "Users can update own profile" policies
  implication: CRITICAL — need to check if the CASCADE also dropped the non-admin user policies

## Resolution

root_cause: Two-part timing race. (1) INITIAL_SESSION can fire with null session before Supabase restores the token, setting loading=false and user=null. ProtectedRoute then redirects /admin to /login. (2) When SIGNED_IN fires, setUser(user) triggers a render BEFORE fetchProfile completes. LoginPage sees user=truthy + isAdmin=false (profile not loaded yet) and navigates to /app. The admin user ends up on /app instead of /admin.
fix: (a) In AuthContext, don't set loading=false until profile is fetched. Track profileLoading separately. (b) In ProtectedRoute, use a profileLoading state to wait for profile before making admin decisions. (c) In LoginPage, wait for profile to load before deciding redirect destination.
verification: Build passes. Logic trace confirms all three race condition paths are now blocked. Awaiting human verification in deployed environment.
files_changed:
  - src/contexts/AuthContext.jsx
  - src/App.jsx
  - src/components/LoginPage.jsx
