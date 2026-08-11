import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as authApi from '@/features/auth/api/auth.api'
import { useAuth } from '@/features/auth/hooks/use-auth'
import {
  verifyEmailSchema,
  type VerifyEmailFormValues,
} from '@/features/auth/schemas/auth.schema'
import { ApiError } from '@/shared/api/api-error'
import { useToast } from '@/shared/hooks/use-toast'

export function useVerifyEmailForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { verifyEmail } = useAuth()
  const { showToast } = useToast()
  const [isResending, setIsResending] = useState(false)

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
      otp: '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await verifyEmail(values)
      showToast('Xác thực email thành công.', 'success')
      navigate('/', { replace: true })
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Không thể xác thực email. Vui lòng thử lại.'
      form.setError('root', { message })
      showToast(message)
    }
  })

  const onResend = async () => {
    const email = form.getValues('email')
    const valid = await form.trigger('email')
    if (!valid) return

    setIsResending(true)
    try {
      await authApi.resendVerification({ email })
      showToast('Đã gửi lại mã OTP.', 'success')
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Không thể gửi lại OTP. Vui lòng thử lại.'
      showToast(message)
    } finally {
      setIsResending(false)
    }
  }

  return {
    form,
    onSubmit,
    onResend,
    isSubmitting: form.formState.isSubmitting,
    isResending,
  }
}
