import { Link } from 'react-router-dom'
import { GoogleSignInButton } from '@/features/auth/components/google-sign-in-button'
import { useLoginForm } from '@/features/auth/hooks/use-login-form'
import { AuthLayout } from '@/shared/components/auth-layout'
import { Button } from '@/shared/components/button'
import { ErrorMessage } from '@/shared/components/error-message'
import { Input } from '@/shared/components/input'

export function LoginPage() {
  const { form, onSubmit, isSubmitting } = useLoginForm()
  const { register, formState } = form

  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Quản lý chi tiêu chung cùng nhóm của bạn."
      footer={
        <>
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Đăng ký ngay
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <GoogleSignInButton disabled={isSubmitting} />
        <div className="relative py-1 text-center text-xs font-medium uppercase tracking-wide text-slate-400">
          <span className="relative z-10 bg-white px-3">hoặc</span>
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-200" />
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            label="Username"
            autoComplete="username"
            error={formState.errors.username?.message}
            {...register('username')}
          />
          <Input
            label="Mật khẩu"
            type="password"
            autoComplete="current-password"
            error={formState.errors.password?.message}
            {...register('password')}
          />
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <ErrorMessage message={formState.errors.root?.message} />
          <Button type="submit" loading={isSubmitting} className="w-full">
            Đăng nhập
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}
