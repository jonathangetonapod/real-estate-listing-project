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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, profile, isAdmin, loading: authLoading, initialResolved, signIn } = useAuth();
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Redirect if already logged in — wait for profile to load so we know the correct destination
  useEffect(() => {
    if (!authLoading && initialResolved && user) {
      // Profile may still be loading; wait for it before deciding
      if (!profile) return;
      navigate(isAdmin ? '/admin' : '/app', { replace: true });
    }
  }, [user, profile, isAdmin, authLoading, initialResolved, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      // Navigation happens via the useEffect above after auth state updates
    } catch (err) {
      const msg = err.message || 'Something went wrong';
      if (msg.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Please confirm your email before signing in.');
      } else {
        setError(msg);
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setError('');
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (resetError) throw resetError;
      setResetSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
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
            Your market is waiting.
          </h1>
          <p className="font-sans text-lg text-white/40 leading-relaxed">
            More listing appointments. Less cold calling. One platform to close.
          </p>

        </motion.div>
      </div>

      {/* Right panel — login form */}
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
            <h2 className="font-heading text-2xl font-bold text-charcoal">Welcome back</h2>
            <p className="font-sans text-sm text-gray-500 mt-1">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                <p className="font-sans text-sm text-red-600">{error}</p>
              </div>
            )}

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
              <div className="flex items-center justify-between mb-2">
                <label className="font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { setForgotMode(true); setResetEmail(email); setResetSent(false); setError(''); }}
                  className="font-sans text-xs text-orange hover:text-orange-hover transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            {/* Forgot password modal overlay */}
            {forgotMode && (
              <div className="rounded-xl border border-orange/20 bg-orange/[0.02] p-4 space-y-3">
                {resetSent ? (
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium text-charcoal">Reset link sent</p>
                    <p className="text-xs text-gray-500">Check your inbox at <span className="font-medium">{resetEmail}</span></p>
                    <button
                      type="button"
                      onClick={() => { setForgotMode(false); setResetSent(false); }}
                      className="text-xs text-orange hover:text-orange-hover transition-colors"
                    >
                      Back to sign in
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-charcoal">Reset your password</p>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full h-10 rounded-lg border border-gray-200 bg-white px-4 font-sans text-sm text-charcoal placeholder:text-gray-400 outline-none focus:border-orange focus:ring-2 focus:ring-orange/10"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="flex-1 h-9 rounded-lg bg-orange text-white text-xs font-semibold hover:bg-orange/90 transition-colors"
                      >
                        Send reset link
                      </button>
                      <button
                        type="button"
                        onClick={() => setForgotMode(false)}
                        className="h-9 px-3 rounded-lg border border-gray-200 text-xs text-gray-500 hover:text-charcoal transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full h-12 rounded-lg font-sans text-sm font-semibold transition-all duration-200',
                loading
                  ? 'bg-orange/70 text-white cursor-wait'
                  : 'bg-orange text-white hover:bg-orange-hover hover:shadow-lg hover:shadow-orange/20 active:scale-[0.98]'
              )}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="font-sans text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google sign in */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full h-12 rounded-lg border border-gray-200 bg-white font-sans text-sm font-medium text-charcoal hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Sign up link */}
          <p className="text-center mt-8 font-sans text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-orange font-medium hover:text-orange-hover transition-colors no-underline">
              Sign up
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
