export interface AuthResponse {
  accessToken: string
  refreshToken: string
}

export interface GoogleAuthResponse {
  needsUsername: boolean
  onboardingToken: string | null
  accessToken: string | null
  refreshToken: string | null
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  fullName: string
}

export interface VerifyEmailRequest {
  email: string
  otp: string
}

export interface EmailOnlyRequest {
  email: string
}

export interface VerifyResetOtpRequest {
  email: string
  otp: string
}

export interface ResetTokenResponse {
  resetToken: string
}

export interface ResetPasswordRequest {
  resetToken: string
  newPassword: string
}

export interface CompleteGoogleProfileRequest {
  onboardingToken: string
  username: string
}

export interface UserResponse {
  id: string
  username: string
  email: string
  fullName: string
  emailVerified: boolean
  hasPassword: boolean
  createdAt: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface SetPasswordRequest {
  newPassword: string
}
