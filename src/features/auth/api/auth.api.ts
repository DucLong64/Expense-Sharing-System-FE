import { apiRequest } from '@/shared/api/axios-client'
import axios from 'axios'
import { ApiError } from '@/shared/api/api-error'
import type { ApiResponse } from '@/shared/api/api-response.types'
import type {
  AuthResponse,
  ChangePasswordRequest,
  CompleteGoogleProfileRequest,
  EmailOnlyRequest,
  GoogleAuthResponse,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  ResetTokenResponse,
  SetPasswordRequest,
  UserResponse,
  VerifyEmailRequest,
  VerifyResetOtpRequest,
} from '@/features/auth/types/auth.types'

const authBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

export function login(payload: LoginRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>({
    url: '/api/v1/auth/login',
    method: 'POST',
    data: payload,
  })
}

export function register(payload: RegisterRequest): Promise<void> {
  return apiRequest<void>({
    url: '/api/v1/auth/register',
    method: 'POST',
    data: payload,
  })
}

export function verifyEmail(payload: VerifyEmailRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>({
    url: '/api/v1/auth/verify-email',
    method: 'POST',
    data: payload,
  })
}

export function resendVerification(payload: EmailOnlyRequest): Promise<void> {
  return apiRequest<void>({
    url: '/api/v1/auth/resend-verification',
    method: 'POST',
    data: payload,
  })
}

export function forgotPassword(payload: EmailOnlyRequest): Promise<void> {
  return apiRequest<void>({
    url: '/api/v1/auth/forgot-password',
    method: 'POST',
    data: payload,
  })
}

export function verifyResetOtp(payload: VerifyResetOtpRequest): Promise<ResetTokenResponse> {
  return apiRequest<ResetTokenResponse>({
    url: '/api/v1/auth/verify-reset-otp',
    method: 'POST',
    data: payload,
  })
}

export function resetPassword(payload: ResetPasswordRequest): Promise<void> {
  return apiRequest<void>({
    url: '/api/v1/auth/reset-password',
    method: 'POST',
    data: payload,
  })
}

export function googleLogin(idToken: string): Promise<GoogleAuthResponse> {
  return apiRequest<GoogleAuthResponse>({
    url: '/api/v1/auth/google',
    method: 'POST',
    data: { idToken },
  })
}

export function completeGoogleProfile(payload: CompleteGoogleProfileRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>({
    url: '/api/v1/auth/google/complete',
    method: 'POST',
    data: payload,
  })
}

export async function refreshToken(refreshTokenValue: string): Promise<AuthResponse> {
  const response = await axios.post<ApiResponse<AuthResponse>>(
    `${authBaseUrl}/api/v1/auth/refresh`,
    { refreshToken: refreshTokenValue },
    { headers: { 'Content-Type': 'application/json' } },
  )
  const body = response.data

  if (!body.success || !body.data) {
    throw new ApiError(body.code ?? 'REFRESH_FAILED', body.message ?? 'Không thể làm mới phiên.')
  }

  return body.data
}

export function logout(refreshTokenValue: string): Promise<void> {
  return apiRequest<void>({
    url: '/api/v1/auth/logout',
    method: 'POST',
    data: { refreshToken: refreshTokenValue },
  })
}

export function getMe(): Promise<UserResponse> {
  return apiRequest<UserResponse>({
    url: '/api/v1/users/me',
    method: 'GET',
  })
}

export function changePassword(payload: ChangePasswordRequest): Promise<void> {
  return apiRequest<void>({
    url: '/api/v1/users/me/password',
    method: 'PATCH',
    data: payload,
  })
}

export function setPassword(payload: SetPasswordRequest): Promise<void> {
  return apiRequest<void>({
    url: '/api/v1/users/me/password',
    method: 'POST',
    data: payload,
  })
}
