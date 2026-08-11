import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as authApi from '@/features/auth/api/auth.api'
import { emailOnlySchema, type EmailOnlyFormValues } from '@/features/auth/schemas/auth.schema'
import { ApiError } from '@/shared/api/api-error'
import { useToast } from '@/shared/hooks/use-toast'

export function useForgotPasswordForm() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const form = useForm<EmailOnlyFormValues>({
    resolver: zodResolver(emailOnlySchema),
    defaultValues: { email: '' },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await authApi.forgotPassword(values)
      showToast('Nếu email tồn tại, mã OTP đã được gửi.', 'success')
      navigate(`/reset-password?email=${encodeURIComponent(values.email)}`, { replace: true })
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Không thể gửi yêu cầu. Vui lòng thử lại.'
      form.setError('root', { message })
      showToast(message)
    }
  })

  return { form, onSubmit, isSubmitting: form.formState.isSubmitting }
}
