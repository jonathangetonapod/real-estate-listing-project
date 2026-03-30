-- ============================================================================
-- Fix: Supabase JS client .single() hangs due to RLS planner issue
--
-- Root cause: PostgREST wraps .single() queries in a JSON aggregate that
-- prevents the Postgres planner from pushing down the id filter. This causes
-- is_admin() to be evaluated for EVERY row instead of just the target row.
--
-- Fix 1: Use CASE statement to force short-circuit evaluation
-- Fix 2: Lock search_path on SECURITY DEFINER function
-- ============================================================================

-- Fix 2: Recreate is_admin() with locked search_path to prevent context leakage
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT role = 'admin' FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE;

-- Fix 1: Replace admin policy with CASE-based short-circuit
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
CREATE POLICY "Admins can read all users" ON public.users
FOR SELECT USING (
  CASE
    WHEN id = auth.uid() THEN false
    ELSE is_admin()
  END
);
