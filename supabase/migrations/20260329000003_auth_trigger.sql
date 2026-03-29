-- Auto-create user profile when someone signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, initials, role, status, plan, leads_per_month)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    UPPER(LEFT(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 1) ||
          LEFT(SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', 2), 1)),
    'agent',
    'trial',
    'starter',
    100
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists to make this migration idempotent
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
