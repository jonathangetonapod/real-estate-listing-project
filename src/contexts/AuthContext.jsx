import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) {
          if (i < retries - 1) {
            await new Promise(r => setTimeout(r, 500 * (i + 1)))
            continue
          }
          console.error('Error fetching profile:', error.message)
          return null
        }
        return data
      } catch (err) {
        if (i < retries - 1) {
          await new Promise(r => setTimeout(r, 500 * (i + 1)))
          continue
        }
        console.error('Error fetching profile:', err)
        return null
      }
    }
    return null
  }, [])

  useEffect(() => {
    let mounted = true

    // Use onAuthStateChange with INITIAL_SESSION instead of separate getSession()
    // This avoids double lock acquisition and race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return

        setSession(newSession)
        setUser(newSession?.user ?? null)

        // Clean up the # fragment left by OAuth redirect
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname)
        }

        if (newSession?.user) {
          const profileData = await fetchProfile(newSession.user.id)
          if (mounted) setProfile(profileData)
        } else {
          setProfile(null)
        }

        // INITIAL_SESSION is the definitive signal that session restoration is complete
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          setLoading(false)
        }
      }
    )

    // Safety timeout — only fires if INITIAL_SESSION never comes (unlikely)
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false)
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
