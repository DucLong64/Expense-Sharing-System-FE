import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { ApiError } from '@/shared/api/api-error'
import { useToast } from '@/shared/hooks/use-toast'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

export function useGoogleCredentialLogin() {
  const navigate = useNavigate()
  const { loginWithGoogle } = useAuth()
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      showToast('Không nhận được credential từ Google.')
      return
    }
    setIsSubmitting(true)
    try {
      const status = await loginWithGoogle(response.credential)
      if (status === 'needs_username') {
        showToast('Chọn username để hoàn tất tài khoản Google.', 'success')
        navigate('/complete-google-profile', { replace: true })
        return
      }
      showToast('Đăng nhập Google thành công.', 'success')
      navigate('/', { replace: true })
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Không thể đăng nhập Google. Vui lòng thử lại.'
      showToast(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return { onSuccess, isSubmitting }
}

interface GoogleSignInButtonProps {
  disabled?: boolean
}

export function GoogleSignInButton({ disabled }: GoogleSignInButtonProps) {
  const { onSuccess, isSubmitting } = useGoogleCredentialLogin()
  const { showToast } = useToast()

  if (!googleClientId) {
    return null
  }

  return (
    <div
      className={`flex w-full justify-center ${disabled || isSubmitting ? 'pointer-events-none opacity-60' : ''}`}
    >
      <GoogleLogin
        onSuccess={(response) => {
          void onSuccess(response)
        }}
        onError={() => showToast('Không thể đăng nhập Google. Vui lòng thử lại.')}
        useOneTap={false}
        theme="outline"
        size="large"
        width="352"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  )
}
