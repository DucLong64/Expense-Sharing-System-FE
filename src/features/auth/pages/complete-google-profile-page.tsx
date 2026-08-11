import { Link } from 'react-router-dom'
import { useCompleteGoogleProfileForm } from '@/features/auth/hooks/use-complete-google-profile-form'
import { AuthLayout } from '@/shared/components/auth-layout'
import { Button } from '@/shared/components/button'
import { ErrorMessage } from '@/shared/components/error-message'
import { Input } from '@/shared/components/input'

export function CompleteGoogleProfilePage() {
  const { form, onSubmit, isSubmitting } = useCompleteGoogleProfileForm()
  const { register, formState } = form

  return (
    <AuthLayout
      title="Hoàn tất tài khoản Google"
      subtitle="Chọn username để dùng trong app. Bạn có thể đặt mật khẩu sau trong trang Tài khoản."
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
          label="Username"
          autoComplete="username"
          hint="3-30 ký tự, chỉ gồm chữ, số, _ và ."
          error={formState.errors.username?.message}
          {...register('username')}
        />
        <ErrorMessage message={formState.errors.root?.message} />
        <Button type="submit" loading={isSubmitting}>
          Tiếp tục
        </Button>
      </form>
    </AuthLayout>
  )
}
