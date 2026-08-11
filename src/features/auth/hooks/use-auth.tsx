import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as authApi from '@/features/auth/api/auth.api'
import type {
  CompleteGoogleProfileRequest,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
} from '@/features/auth/types/auth.types'
import {
  clearGoogleOnboardingToken,
  setGoogleOnboardingToken,
} from '@/features/auth/utils/google-onboarding-storage'
import {
  clearTokens,
  getRefreshToken,
  isAuthenticated,
  setTokens,
} from '@/shared/auth/auth-storage'

interface AuthContextValue {
  isAuthenticated: boolean
  login: (payload: LoginRequest) => Promise<void>
  register: (payload: RegisterRequest) => Promise<void>
  verifyEmail: (payload: VerifyEmailRequest) => Promise<void>
  loginWithGoogle: (idToken: string) => Promise<'authenticated' | 'needs_username'>
  completeGoogleProfile: (payload: CompleteGoogleProfileRequest) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(isAuthenticated)

  const login = useCallback(async (payload: LoginRequest) => {
    const tokens = await authApi.login(payload)
    setTokens(tokens.accessToken, tokens.refreshToken)
    setAuthenticated(true)
  }, [])

  const register = useCallback(async (payload: RegisterRequest) => {
    await authApi.register(payload)
  }, [])

  const verifyEmail = useCallback(async (payload: VerifyEmailRequest) => {
    const tokens = await authApi.verifyEmail(payload)
    setTokens(tokens.accessToken, tokens.refreshToken)
    setAuthenticated(true)
  }, [])

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const result = await authApi.googleLogin(idToken)
    if (result.needsUsername) {
      if (!result.onboardingToken) {
        throw new Error('Missing Google onboarding token.')
      }
      setGoogleOnboardingToken(result.onboardingToken)
      return 'needs_username' as const
    }
    if (!result.accessToken || !result.refreshToken) {
      throw new Error('Missing auth tokens from Google login.')
    }
    clearGoogleOnboardingToken()
    setTokens(result.accessToken, result.refreshToken)
    setAuthenticated(true)
    return 'authenticated' as const
  }, [])

  const completeGoogleProfile = useCallback(async (payload: CompleteGoogleProfileRequest) => {
    const tokens = await authApi.completeGoogleProfile(payload)
    clearGoogleOnboardingToken()
    setTokens(tokens.accessToken, tokens.refreshToken)
    setAuthenticated(true)
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken)
      } catch {
        // Clear local session even if logout API fails.
      }
    }
    clearTokens()
    clearGoogleOnboardingToken()
    setAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated: authenticated,
      login,
      register,
      verifyEmail,
      loginWithGoogle,
      completeGoogleProfile,
      logout,
    }),
    [authenticated, login, register, verifyEmail, loginWithGoogle, completeGoogleProfile, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
