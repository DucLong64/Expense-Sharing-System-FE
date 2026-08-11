import { Link } from 'react-router-dom'
import { useResetPasswordForm } from '@/features/auth/hooks/use-reset-password-form'
import { AuthLayout } from '@/shared/components/auth-layout'
import { Button } from '@/shared/components/button'
import { ErrorMessage } from '@/shared/components/error-message'
import { Input } from '@/shared/components/input'

export function ResetPasswordPage() {
  const { otpForm, passwordForm, onVerifyOtp, onResetPassword, otpVerified } =
    useResetPasswordForm()

  return (
    <AuthLayout
      title="Đặt lại mật khẩu"
      subtitle={
        otpVerified
          ? 'OTP hợp lệ. Nhập mật khẩu mới cho tài khoản của bạn.'
          : 'Nhập mã OTP đã gửi tới email, sau đó đặt mật khẩu mới.'
      }
      footer={
        <>
          Quay lại{' '}
          <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
            đăng nhập
          </Link>
        </>
      }
    >
      {!otpVerified ? (
        <form className="space-y-4" onSubmit={onVerifyOtp}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={otpForm.formState.errors.email?.message}
            {...otpForm.register('email')}
          />
          <Input
            label="Mã OTP"
            inputMode="numeric"
            autoComplete="one-time-code"
            error={otpForm.formState.errors.otp?.message}
            {...otpForm.register('otp')}
          />
          <ErrorMessage message={otpForm.formState.errors.root?.message} />
          <Button type="submit" loading={otpForm.formState.isSubmitting}>
            Xác nhận OTP
          </Button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={onResetPassword}>
          <Input
            label="Mật khẩu mới"
            type="password"
            autoComplete="new-password"
            hint="Tối thiểu 8 ký tự."
            error={passwordForm.formState.errors.newPassword?.message}
            {...passwordForm.register('newPassword')}
          />
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            autoComplete="new-password"
            error={passwordForm.formState.errors.confirmPassword?.message}
            {...passwordForm.register('confirmPassword')}
          />
          <ErrorMessage message={passwordForm.formState.errors.root?.message} />
          <Button type="submit" loading={passwordForm.formState.isSubmitting}>
            Đặt lại mật khẩu
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
