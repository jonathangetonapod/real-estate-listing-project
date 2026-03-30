import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  // Track whether we've completed the initial auth + profile resolution.
  // This prevents premature redirects when INITIAL_SESSION fires with a
  // null session before Supabase restores the token from storage/URL.
  const [initialResolved, setInitialResolved] = useState(false)
  const initialResolvedRef = useRef(false)

  const fetchProfile = useCallback(async (userId) => {
    try {
      console.log(`[AuthContext] fetchProfile for ${userId}`)

      // Use direct REST API call with the user's JWT to avoid RLS hanging issues
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!currentSession?.access_token) {
        console.log('[AuthContext] No session token available')
        return null
      }

      const res = await fetch(
        `https://qtoptwgmqulrumyojtjv.supabase.co/rest/v1/users?id=eq.${userId}&select=*`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0b3B0d2dtcXVscnVteW9qdGp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3Mzk2MTAsImV4cCI6MjA5MDMxNTYxMH0.qeRXNytcgBKc4fyFpTqnUkhGdtHEBYAi0_AU-9AFF74',
            'Authorization': `Bearer ${currentSession.access_token}`,
          },
        }
      )

      if (!res.ok) {
        console.log(`[AuthContext] fetchProfile REST failed: ${res.status}`)
        return null
      }

      const rows = await res.json()
      const profile = rows?.[0] || null
      console.log(`[AuthContext] fetchProfile success:`, profile?.role)
      return profile
    } catch (err) {
      console.error('[AuthContext] fetchProfile error:', err.message)
      return null
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return

        console.log('[AuthContext] onAuthStateChange:', event, newSession?.user?.id ?? 'no-user')

        setSession(newSession)
        setUser(newSession?.user ?? null)

        // Clean up the # fragment left by OAuth redirect
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname)
        }

        if (newSession?.user) {
          const profileData = await fetchProfile(newSession.user.id)
          if (mounted) {
            console.log('[AuthContext] Profile fetched:', profileData?.role)
            setProfile(profileData)
          }
        } else {
          setProfile(null)
        }

        // Only mark loading as done for definitive auth events.
        // For INITIAL_SESSION: if the session is null, Supabase may still
        // fire SIGNED_IN shortly after (token refresh / OAuth redirect).
        // We mark as resolved but keep loading=true if we expect a follow-up.
        if (event === 'INITIAL_SESSION') {
          if (newSession?.user) {
            // Session was restored immediately — profile is fetched above, we're done
            if (mounted) {
              setLoading(false)
              setInitialResolved(true)
              initialResolvedRef.current = true
            }
          } else {
            // No session on INITIAL_SESSION. This could mean:
            // (a) User is genuinely not authenticated, OR
            // (b) Supabase is about to fire SIGNED_IN with a restored session
            // Give Supabase a short window to fire SIGNED_IN before resolving.
            setTimeout(() => {
              if (mounted && !initialResolvedRef.current) {
                console.log('[AuthContext] No SIGNED_IN after INITIAL_SESSION — resolving as unauthenticated')
                setLoading(false)
                setInitialResolved(true)
                initialResolvedRef.current = true
              }
            }, 1000)
          }
        } else if (event === 'SIGNED_IN') {
          // SIGNED_IN with profile already fetched above — resolve now
          if (mounted) {
            setLoading(false)
            setInitialResolved(true)
            initialResolvedRef.current = true
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            setLoading(false)
            setInitialResolved(true)
            initialResolvedRef.current = true
          }
        }
      }
    )

    // Safety timeout — only fires if INITIAL_SESSION never comes (unlikely)
    const timeout = setTimeout(() => {
      if (mounted && !initialResolvedRef.current) {
        console.log('[AuthContext] Safety timeout — forcing loading=false')
        setLoading(false)
        setInitialResolved(true)
        initialResolvedRef.current = true
      }
    }, 10000)

    return () => {
      mounted = false
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [fetchProfile])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    if (error) throw error

    // If the user is immediately confirmed (email confirmation disabled),
    // the auth trigger will handle profile creation.
    // If not immediately confirmed, the trigger fires when they confirm.
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/app`,
      },
    })
    if (error) throw error
    return data
  }

  const isAdmin = profile?.role === 'admin'

  const value = {
    user,
    session,
    profile,
    loading,
    initialResolved,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    isAdmin,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
