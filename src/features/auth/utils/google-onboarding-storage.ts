const ONBOARDING_TOKEN_KEY = 'expense_sharing_google_onboarding_token'

export function setGoogleOnboardingToken(token: string): void {
  sessionStorage.setItem(ONBOARDING_TOKEN_KEY, token)
}

export function getGoogleOnboardingToken(): string | null {
  return sessionStorage.getItem(ONBOARDING_TOKEN_KEY)
}

export function clearGoogleOnboardingToken(): void {
  sessionStorage.removeItem(ONBOARDING_TOKEN_KEY)
}
