export enum PasswordStrength {
  WEAK = 'Weak',
  MODERATE = 'Moderate',
  STRONG = 'Strong',
  VERY_STRONG = 'Very Strong'
}

export interface AnalysisResult {
  score: number; // 0-100
  label: string;
  crackTimeDisplay: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface ValidationState {
  hasMinLength: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
}