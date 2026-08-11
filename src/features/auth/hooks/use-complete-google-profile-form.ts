import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/use-auth'
import {
  completeGoogleProfileSchema,
  type CompleteGoogleProfileFormValues,
} from '@/features/auth/schemas/auth.schema'
import { getGoogleOnboardingToken } from '@/features/auth/utils/google-onboarding-storage'
import { ApiError } from '@/shared/api/api-error'
import { useToast } from '@/shared/hooks/use-toast'

export function useCompleteGoogleProfileForm() {
  const navigate = useNavigate()
  const { completeGoogleProfile } = useAuth()
  const { showToast } = useToast()

  const form = useForm<CompleteGoogleProfileFormValues>({
    resolver: zodResolver(completeGoogleProfileSchema),
    defaultValues: { username: '' },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const onboardingToken = getGoogleOnboardingToken()
    if (!onboardingToken) {
      showToast('Phiên Google đã hết hạn. Vui lòng đăng nhập lại.')
      navigate('/login', { replace: true })
      return
    }

    try {
      await completeGoogleProfile({
        onboardingToken,
        username: values.username,
      })
      showToast('Hoàn tất tài khoản Google thành công.', 'success')
      navigate('/', { replace: true })
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Không thể hoàn tất tài khoản. Vui lòng thử lại.'
      form.setError('root', { message })
      showToast(message)
    }
  })

  return { form, onSubmit, isSubmitting: form.formState.isSubmitting }
}
