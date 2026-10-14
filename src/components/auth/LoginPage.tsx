import React, { useState } from 'react';
import { useEcoPulse } from '../../context/EcoPulseContext.tsx';
import { ASSETS } from '../../data/seedData.ts';
import {
  Eye,
  EyeOff,
  Leaf,
  Shield,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Mail,
  Zap,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setActiveTab } = useEcoPulse();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!email.trim()) {
      setError('Please provide your registered email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email format (e.g., steward@ecopulse.in).');
      return;
    }
    if (!password) {
      setError('Please enter your account password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email.trim(), password, rememberMe);
      if (res.success) {
        // Navigate to the operations dashboard
        setActiveTab('overview');
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setError('An unexpected connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('EcoPulse2026!');
    setError(null);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans selection:bg-[#00E5FF] selection:text-[#0B1020]">
      {/* 1. VIVID ENVIRONMENTAL BACKGROUND IMAGE */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-100"
        style={{
          backgroundImage: `url(${ASSETS.cyberpunkCityDusk})`,
          backgroundColor: '#0B1020',
        }}
      >
        {/* Subtle translucent cinematic vignette overlay ensuring contrast while keeping city clearly recognizable */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020]/90 via-[#0B1020]/40 to-[#0B1020]/70" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0B1020]/20 to-[#0B1020]/80" />
      </div>

      {/* Cyberpunk Scanline & Ambient Lighting Accent */}
      <div className="fixed inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent z-10 opacity-75" />
      <div className="fixed top-1/4 -left-48 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-1/4 -right-48 w-96 h-96 bg-[#8B7CFF]/15 rounded-full blur-3xl pointer-events-none z-0" />

      {/* 2. TOP MINIMAL NAVIGATION BAR */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
        {/* Brand Lockup */}
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00E5FF] rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] group-hover:border-[#00E5FF] group-hover:bg-[#00E5FF]/20 transition-all shadow-[0_0_15px_rgba(0,229,255,0.25)]">
            <Leaf className="w-5 h-5 text-[#35E6A1]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-wider uppercase text-[#F3F6FC]">
                EcoPulse <span className="text-[#00E5FF]">|</span> RoadGuard
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#35E6A1] block leading-none">
              AP Smart Civic Network
            </span>
          </div>
        </button>

        {/* Back Link to Landing */}
        <button
          onClick={() => setActiveTab('landing')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#111827]/70 hover:bg-[#111827] border border-[#00E5FF]/20 hover:border-[#00E5FF]/50 text-xs font-semibold text-[#F3F6FC] transition-all backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>Back to Landing</span>
        </button>
      </header>

      {/* 3. CENTER CYBERPUNK GLASS PANEL */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Cyberpunk Glass Card */}
          <div className="relative rounded-2xl bg-[#0B1020]/80 backdrop-blur-xl border border-[#00E5FF]/30 p-8 shadow-[0_0_40px_rgba(0,229,255,0.12)] space-y-6">
            {/* Top Glowing Edge Line */}
            <div className="absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-80" />

            {/* Header Lockup */}
            <div className="space-y-1.5 text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[10px] font-mono font-bold uppercase tracking-wider text-[#00E5FF] mb-2">
                <Zap className="w-3 h-3 text-[#35E6A1]" />
                <span>Municipal Terminal Access</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F3F6FC]">
                Welcome Back
              </h1>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Sign in to continue building safer, cleaner streets across Vijayawada & Guntur.
              </p>
            </div>

            {/* Inline Error Message */}
            {error && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-xs text-rose-200 flex items-start gap-2.5 shadow-md animate-in fade-in duration-200"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Main Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#F3F6FC] tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-[#00E5FF]/80" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="steward@ecopulse.ap.gov.in"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#111827]/80 text-[#F3F6FC] placeholder:text-[#6B7280] border border-slate-700/80 rounded-xl focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all outline-none"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#F3F6FC] tracking-wide">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotNotice(true)}
                    className="text-[11px] font-medium text-[#8B7CFF] hover:text-[#00E5FF] transition-colors focus:outline-none"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-[#00E5FF]/80" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#111827]/80 text-[#F3F6FC] placeholder:text-[#6B7280] border border-slate-700/80 rounded-xl focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all outline-none"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#00E5FF] transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-sm bg-[#111827] border-slate-700 text-[#00E5FF] focus:ring-[#00E5FF] accent-[#00E5FF]"
                  />
                  <span>Remember session</span>
                </label>
                <span className="text-[11px] font-mono text-[#35E6A1]">VMC / GMC Zone</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs text-[#0B1020] bg-gradient-to-r from-[#00E5FF] via-[#35E6A1] to-[#00E5FF] hover:brightness-110 active:brightness-95 transition-all shadow-[0_0_20px_rgba(0,229,255,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0B1020] border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Log In to Operations</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick-Fill Demo Credentials */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block text-center">
                Quick Demonstration Accounts (1-Click Fill)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('venkat.rao@ecopulse.ap.gov.in')}
                  className="p-2 rounded-lg bg-[#111827]/70 hover:bg-[#111827] border border-slate-800 hover:border-[#00E5FF]/40 text-left transition-colors cursor-pointer group"
                >
                  <span className="block text-[11px] font-semibold text-[#F3F6FC] group-hover:text-[#00E5FF] truncate">
                    Dr. Venkat Rao
                  </span>
                  <span className="block text-[10px] text-slate-400">Vijayawada Lead</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('priya.r@ecopulse.ap.gov.in')}
                  className="p-2 rounded-lg bg-[#111827]/70 hover:bg-[#111827] border border-slate-800 hover:border-[#35E6A1]/40 text-left transition-colors cursor-pointer group"
                >
                  <span className="block text-[11px] font-semibold text-[#F3F6FC] group-hover:text-[#35E6A1] truncate">
                    Priya Ramakrishna
                  </span>
                  <span className="block text-[10px] text-slate-400">Mobility Marshal</span>
                </button>
              </div>
            </div>

            {/* Footer Navigation Link to Signup */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-300">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="font-bold text-[#00E5FF] hover:text-[#35E6A1] underline decoration-[#00E5FF]/50 underline-offset-4 transition-colors cursor-pointer"
                >
                  Sign Up as Civic Steward
                </button>
              </p>
            </div>
          </div>

          {/* Honest Demo Authentication Notice */}
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <Shield className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Demonstration Session Mode · Secure Client Boundary</span>
            </span>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal Notice */}
      {showForgotNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-sm w-full bg-[#111827] border border-[#8B7CFF]/40 rounded-2xl p-6 space-y-4 shadow-2xl text-[#F3F6FC]">
            <div className="flex items-center gap-2 text-[#8B7CFF]">
              <Info className="w-5 h-5" />
              <h3 className="text-sm font-bold">Credential Recovery Notice</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Automated self-service password reset requires enterprise PWD / VMC directory services. For this competition demonstration, please select one of the 1-click quick-fill accounts or create a new steward account on the Signup page.
            </p>
            <button
              onClick={() => setShowForgotNotice(false)}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-[#8B7CFF]/20 hover:bg-[#8B7CFF]/30 border border-[#8B7CFF]/50 text-[#F3F6FC] transition-colors cursor-pointer"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}

      {/* 4. FOOTER */}
      <footer className="relative z-20 py-4 px-6 text-center text-[11px] text-slate-400 border-t border-slate-800/60 bg-[#0B1020]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Serving Vijayawada & Guntur, Andhra Pradesh</span>
          <span className="font-mono text-[#00E5FF]">EcoPulse v3.0 · Cyberpunk Civic Edition</span>
        </div>
      </footer>
    </div>
  );
};
