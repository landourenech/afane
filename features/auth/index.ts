/* Types */
export * from './types';

/* Schemas */
export {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
} from './schemas/auth.schema';

export type {
  LoginInput,
  SignupInput,
  ForgotPasswordInput,
} from './schemas/auth.schema';

export {
  onboardingSchema,
  GABON_REGIONS,
  CROPS,
  PRODUCT_CATEGORIES,
  ONBOARDING_ROLES,
} from './schemas/onboarding.schema';

export type {
  OnboardingInput,
  OnboardingRole,
} from './schemas/onboarding.schema';

/* Services */
export * from './services/auth.service';

/* Hooks */
export * from './hooks/use-auth';
export * from './hooks/use-auth-mutations';
export * from './hooks/use-onboarding';

/* Components */
export { AuthLayout } from './components/AuthLayout';
export { GoogleButton } from './components/GoogleButton';
export { LoginForm } from './components/LoginForm';
export { SignupForm } from './components/SignupForm';
export { OnboardingWizard } from './components/OnboardingWizard';

/* API handlers */
export { handleSyncUser } from './services/api/sync-user';
