import React, { useState, useEffect, useCallback } from 'react';
import { PasswordInput } from './components/PasswordInput';
import { StrengthDisplay } from './components/StrengthDisplay';
import { analyzePasswordWithGemini } from './services/geminiService';
import { useDebounce } from './hooks/useDebounce';
import { AnalysisResult, ValidationState } from './types';
import { Icons, APP_NAME, APP_DESCRIPTION } from './constants';

const App: React.FC = () => {
  const [password, setPassword] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedPassword = useDebounce(password, 800);

  // Client-side quick validation state
  const [validation, setValidation] = useState<ValidationState>({
    hasMinLength: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasUpperCase: false,
    hasLowerCase: false,
  });

  const updateValidation = useCallback((pwd: string) => {
    setValidation({
      hasMinLength: pwd.length >= 8,
      hasNumber: /\d/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
    });
  }, []);

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    updateValidation(val);
    if (val.trim() === '') {
      setAnalysis(null);
      setError(null);
    }
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let newPassword = "";
    const length = 16;
    for (let i = 0, n = chars.length; i < length; ++i) {
      newPassword += chars.charAt(Math.floor(Math.random() * n));
    }
    handlePasswordChange(newPassword);
  };

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!debouncedPassword) return;
      
      setLoading(true);
      setError(null);
      try {
        const result = await analyzePasswordWithGemini(debouncedPassword);
        setAnalysis(result);
      } catch (err) {
        console.error(err);
        // Don't show generic error to user immediately unless persistent, 
        // but let's show a small warning if API fails.
        setError("AI Service unavailable. Check API Key or connectivity.");
      } finally {
        setLoading(false);
      }
    };

    if (debouncedPassword.length > 0) {
      fetchAnalysis();
    }
  }, [debouncedPassword]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
      <div className="w-full max-w-3xl animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20 backdrop-blur-xl">
             <Icons.ShieldCheck />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {APP_NAME}
          </h1>
          <p className="text-slate-400 text-lg font-light max-w-lg mx-auto">
            {APP_DESCRIPTION}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
          
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <PasswordInput 
              value={password} 
              onChange={handlePasswordChange} 
              onGenerate={generatePassword}
              disabled={loading && !password} // Only disable if loading initial
            />

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                <Icons.Warning />
                {error}
              </div>
            )}

            <StrengthDisplay 
              analysis={analysis} 
              loading={loading}
              validation={validation}
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            <span className="font-semibold text-slate-400">Privacy Notice:</span> Passwords are sent to Google's Gemini AI for analysis. 
            Do not enter real banking passwords or sensitive personal credentials. This tool is for educational and testing purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;