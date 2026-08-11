import { Link } from 'react-router-dom'
import { useForgotPasswordForm } from '@/features/auth/hooks/use-forgot-password-form'
import { AuthLayout } from '@/shared/components/auth-layout'
import { Button } from '@/shared/components/button'
import { ErrorMessage } from '@/shared/components/error-message'
import { Input } from '@/shared/components/input'

export function ForgotPasswordPage() {
  const { form, onSubmit, isSubmitting } = useForgotPasswordForm()
  const { register, formState } = form

  return (
    <AuthLayout
      title="Quên mật khẩu"
      subtitle="Nhập email đã đăng ký. Nếu tài khoản tồn tại, chúng tôi sẽ gửi mã OTP."
      footer={
        <>
          Nhớ mật khẩu?{' '}
          <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Đăng nhập
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={formState.errors.email?.message}
          {...register('email')}
        />
        <ErrorMessage message={formState.errors.root?.message} />
        <Button type="submit" loading={isSubmitting}>
          Gửi mã OTP
        </Button>
      </form>
    </AuthLayout>
  )
}
