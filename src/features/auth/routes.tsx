import { Route } from 'react-router-dom'
import { CompleteGoogleProfilePage } from '@/features/auth/pages/complete-google-profile-page'
import { ForgotPasswordPage } from '@/features/auth/pages/forgot-password-page'
import { LoginPage } from '@/features/auth/pages/login-page'
import { RegisterPage } from '@/features/auth/pages/register-page'
import { ResetPasswordPage } from '@/features/auth/pages/reset-password-page'
import { VerifyEmailPage } from '@/features/auth/pages/verify-email-page'

export const authRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/complete-google-profile" element={<CompleteGoogleProfilePage />} />
  </>
)
