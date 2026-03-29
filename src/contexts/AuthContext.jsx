import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error.message)
        return null
      }
      return data
    } catch (err) {
      console.error('Error fetching profile:', err)
      return null
    }
  }, [])

  useEffect(() => {
    let mounted = true

    // Check existing session on mount
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (!mounted) return
      setSession(currentSession)
      setUser(currentSession?.user ?? null)

      if (currentSession?.user) {
        const profileData = await fetchProfile(currentSession.user.id)
        if (mounted) setProfile(profileData)
      }

      if (mounted) setLoading(false)
    }).catch(() => {
      if (mounted) setLoading(false)
    })

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return
        setSession(newSession)
        setUser(newSession?.user ?? null)

        if (newSession?.user) {
          const profileData = await fetchProfile(newSession.user.id)
          if (mounted) setProfile(profileData)
        } else {
          setProfile(null)
        }

        setLoading(false)
      }
    )

    // Safety timeout — never stay loading forever
    const timeout = setTimeout(() => {
      if (mounted && loading) setLoading(false)
    }, 5000)

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
