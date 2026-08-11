import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import * as authApi from '@/features/auth/api/auth.api'
import { ApiError } from '@/shared/api/api-error'
import { useToast } from '@/shared/hooks/use-toast'

const otpStepSchema = z.object({
  email: z.string().trim().email('Email không hợp lệ'),
  otp: z.string().trim().regex(/^\d{6}$/, 'Mã OTP gồm 6 chữ số'),
})

const passwordStepSchema = z
  .object({
    newPassword: z.string().min(8, 'Mật khẩu mới tối thiểu 8 ký tự'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

type OtpStepValues = z.infer<typeof otpStepSchema>
type PasswordStepValues = z.infer<typeof passwordStepSchema>

export function useResetPasswordForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()
  const [resetToken, setResetToken] = useState<string | null>(null)

  const otpForm = useForm<OtpStepValues>({
    resolver: zodResolver(otpStepSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
      otp: '',
    },
  })

  const passwordForm = useForm<PasswordStepValues>({
    resolver: zodResolver(passwordStepSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onVerifyOtp = otpForm.handleSubmit(async (values) => {
    try {
      const result = await authApi.verifyResetOtp(values)
      setResetToken(result.resetToken)
      showToast('OTP hợp lệ. Hãy đặt mật khẩu mới.', 'success')
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'OTP không hợp lệ. Vui lòng thử lại.'
      otpForm.setError('root', { message })
      showToast(message)
    }
  })

  const onResetPassword = passwordForm.handleSubmit(async (values) => {
    if (!resetToken) return
    try {
      await authApi.resetPassword({
        resetToken,
        newPassword: values.newPassword,
      })
      showToast('Đặt lại mật khẩu thành công. Vui lòng đăng nhập.', 'success')
      navigate('/login', { replace: true })
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Không thể đặt lại mật khẩu. Vui lòng thử lại.'
      passwordForm.setError('root', { message })
      showToast(message)
    }
  })

  return {
    otpForm,
    passwordForm,
    onVerifyOtp,
    onResetPassword,
    otpVerified: Boolean(resetToken),
  }
}
