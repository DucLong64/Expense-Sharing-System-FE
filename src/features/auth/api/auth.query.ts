import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as authApi from '@/features/auth/api/auth.api'
import type { ChangePasswordRequest, SetPasswordRequest } from '@/features/auth/types/auth.types'

export const authKeys = {
  me: ['auth', 'me'] as const,
}

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authApi.getMe,
  })
}

export function useChangePassword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => authApi.changePassword(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.me })
    },
  })
}

export function useSetPassword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SetPasswordRequest) => authApi.setPassword(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.me })
    },
  })
}
