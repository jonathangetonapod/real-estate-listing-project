import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// Animated dots simulating property locations on a dark grid
function PropertyGrid() {
  const dots = Array.from({ length: 40 }, (_, i) => ({
    x: 8 + (((i * 37) % 84)),
    y: 5 + (((i * 53) % 90)),
    size: 3 + (i % 4) * 2,
    delay: (i % 8) * 0.3,
    pulse: i % 5 === 0,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Subtle grid lines */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated property dots */}
      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            background: dot.pulse ? '#FF5924' : 'rgba(255,89,36,0.3)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: dot.pulse ? [0.4, 1, 0.4] : [0, 0.6, 0.3],
            scale: dot.pulse ? [1, 1.8, 1] : 1,
          }}
          transition={{
            duration: dot.pulse ? 2.5 : 1.5,
            delay: dot.delay,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      ))}

      {/* Connecting lines between some dots */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]">
        {dots.slice(0, 15).map((dot, i) => {
          const next = dots[(i * 3 + 7) % dots.length];
          return (
            <motion.line
              key={i}
              x1={`${dot.x}%`}
              y1={`${dot.y}%`}
              x2={`${next.x}%`}
              y2={`${next.y}%`}
              stroke="#FF5924"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, delay: dot.delay + 1 }}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading, signUp } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/app', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!agreedToTerms) return;

    setLoading(true);
    try {
      const data = await signUp(email, password, fullName);
      // If user is immediately confirmed (no email confirmation), redirect
      if (data?.user?.confirmed_at || data?.session) {
        navigate('/app');
      } else {
        // Show confirmation message
        setSuccess(true);
      }
    } catch (err) {
      const msg = err.message || 'Something went wrong';
      if (msg.includes('User already registered')) {
        setError('An account with this email already exists. Try signing in instead.');
      } else if (msg.includes('Password should be')) {
        setError('Password is too weak. Use at least 6 characters.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (err) {
      setError(err.message || 'Failed to sign up with Google');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand + visualization */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-charcoal flex-col p-12 overflow-hidden">
        <PropertyGrid />

        {/* Logo — pinned top */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <a href="/" className="inline-flex items-center gap-1 no-underline">
            <span className="font-heading text-2xl font-bold text-white">Off</span>
            <span className="font-heading text-2xl font-bold text-orange">Market</span>
          </a>
        </motion.div>

        {/* Tagline — centered vertically */}
        <motion.div
          className="relative z-10 max-w-md flex-1 flex flex-col justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="font-heading text-4xl font-bold text-white leading-tight mb-4">
            Start closing more listings.
          </h1>
          <p className="font-sans text-lg text-white/40 leading-relaxed">
            Join thousands of agents using OffMarket to reach motivated sellers.
          </p>
        </motion.div>
      </div>

      {/* Right panel — sign up form */}
      <div className="flex-1 flex items-center justify-center bg-light-bg p-6 sm:p-12">
        <motion.div
          className="w-full max-w-[400px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <a href="/" className="inline-flex items-center gap-1 no-underline">
              <span className="font-heading text-2xl font-bold text-charcoal">Off</span>
              <span className="font-heading text-2xl font-bold text-orange">Market</span>
            </a>
          </div>

          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-charcoal">Create your account</h2>
            <p className="font-sans text-sm text-gray-500 mt-1">Get started with OffMarket today</p>
          </div>

          {success ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-charcoal mb-2">Check your email</h3>
              <p className="font-sans text-sm text-gray-500">
                We sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.
              </p>
            </div>
          ) : (
          <>
          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                <p className="font-sans text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block font-sans text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sarah Johnson"
                className="w-full h-12 rounded-lg border border-gray-200 bg-white px-4 font-sans text-sm text-charcoal placeholder:text-gray-400 outline-none transition-all focus:border-orange focus:ring-2 focus:ring-orange/10"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-sans text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@offmarket.com"
                className="w-full h-12 rounded-lg border border-gray-200 bg-white px-4 font-sans text-sm text-charcoal placeholder:text-gray-400 outline-none transition-all focus:border-orange focus:ring-2 focus:ring-orange/10"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-sans text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full h-12 rounded-lg border border-gray-200 bg-white px-4 pr-12 font-sans text-sm text-charcoal placeholder:text-gray-400 outline-none transition-all focus:border-orange focus:ring-2 focus:ring-orange/10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 font-sans text-xs text-gray-400 hover:text-charcoal transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-sans text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={cn(
                    'w-full h-12 rounded-lg border bg-white px-4 pr-12 font-sans text-sm text-charcoal placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-orange/10',
                    confirmPassword && password !== confirmPassword
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-gray-200 focus:border-orange'
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 font-sans text-xs text-gray-400 hover:text-charcoal transition-colors"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="font-sans text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Terms agreement */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-orange focus:ring-orange/20 cursor-pointer"
                required
              />
              <label htmlFor="terms" className="font-sans text-sm text-gray-500 cursor-pointer select-none">
                I agree to the{' '}
                <span className="text-orange font-medium hover:text-orange-hover transition-colors cursor-pointer">
                  Terms of Service
                </span>{' '}
                and{' '}
                <span className="text-orange font-medium hover:text-orange-hover transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || password !== confirmPassword || !agreedToTerms}
              className={cn(
                'w-full h-12 rounded-lg font-sans text-sm font-semibold transition-all duration-200',
                loading
                  ? 'bg-orange/70 text-white cursor-wait'
                  : (!agreedToTerms || (confirmPassword && password !== confirmPassword))
                    ? 'bg-orange/40 text-white/70 cursor-not-allowed'
                    : 'bg-orange text-white hover:bg-orange-hover hover:shadow-lg hover:shadow-orange/20 active:scale-[0.98]'
              )}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="font-sans text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google sign up */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full h-12 rounded-lg border border-gray-200 bg-white font-sans text-sm font-medium text-charcoal hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          {/* Sign in link */}
          <p className="text-center mt-8 font-sans text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-orange font-medium hover:text-orange-hover transition-colors no-underline">
              Sign in
            </a>
          </p>
          </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
