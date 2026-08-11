import { Link } from 'react-router-dom'
import { useVerifyEmailForm } from '@/features/auth/hooks/use-verify-email-form'
import { AuthLayout } from '@/shared/components/auth-layout'
import { Button } from '@/shared/components/button'
import { ErrorMessage } from '@/shared/components/error-message'
import { Input } from '@/shared/components/input'

export function VerifyEmailPage() {
  const { form, onSubmit, onResend, isSubmitting, isResending } = useVerifyEmailForm()
  const { register, formState } = form

  return (
    <AuthLayout
      title="Xác thực email"
      subtitle="Nhập mã OTP đã được gửi tới email của bạn để kích hoạt tài khoản."
      footer={
        <>
          Quay lại{' '}
          <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
            đăng nhập
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
        <Input
          label="Mã OTP"
          inputMode="numeric"
          autoComplete="one-time-code"
          hint="Mã gồm 6 chữ số, có hiệu lực 10 phút."
          error={formState.errors.otp?.message}
          {...register('otp')}
        />
        <ErrorMessage message={formState.errors.root?.message} />
        <Button type="submit" loading={isSubmitting}>
          Xác thực
        </Button>
        <Button type="button" variant="secondary" loading={isResending} onClick={onResend}>
          Gửi lại OTP
        </Button>
      </form>
    </AuthLayout>
  )
}
