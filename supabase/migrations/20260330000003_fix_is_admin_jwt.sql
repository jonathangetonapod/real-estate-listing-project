-- ============================================================================
-- Fix: is_admin() reads from JWT app_metadata instead of querying users table
--
-- This eliminates the circular RLS dependency entirely. The role is stored
-- in the user's JWT app_metadata (set via Supabase Admin API), so checking
-- admin status never touches the users table.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$ LANGUAGE sql STABLE;
