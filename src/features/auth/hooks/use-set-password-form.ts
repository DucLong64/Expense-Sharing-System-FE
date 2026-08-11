import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSetPassword } from '@/features/auth/api/auth.query'
import {
  setPasswordSchema,
  type SetPasswordFormValues,
} from '@/features/auth/schemas/auth.schema'
import { ApiError } from '@/shared/api/api-error'
import { useToast } from '@/shared/hooks/use-toast'

export function useSetPasswordForm(onSuccess?: () => void) {
  const { showToast } = useToast()
  const setPasswordMutation = useSetPassword()

  const form = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await setPasswordMutation.mutateAsync({ newPassword: values.newPassword })
      form.reset()
      showToast('Đặt mật khẩu thành công.', 'success')
      onSuccess?.()
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Không thể đặt mật khẩu. Vui lòng thử lại.'
      form.setError('root', { message })
      showToast(message)
    }
  })

  return { form, onSubmit, isSubmitting: setPasswordMutation.isPending }
}
