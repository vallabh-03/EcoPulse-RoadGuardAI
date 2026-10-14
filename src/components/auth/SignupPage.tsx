import React, { useState, useMemo } from 'react';
import { useEcoPulse } from '../../context/EcoPulseContext.tsx';
import { SupportedCity, Neighborhood } from '../../types/index.ts';
import {
  VIJAYAWADA_NEIGHBORHOODS,
  GUNTUR_NEIGHBORHOODS,
} from '../../utils/locationValidator.ts';
import { ASSETS } from '../../data/seedData.ts';
import {
  Eye,
  EyeOff,
  Leaf,
  Shield,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Mail,
  User,
  MapPin,
  Check,
  X,
  Zap,
} from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signup, setActiveTab } = useEcoPulse();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState<SupportedCity>('Vijayawada');
  const [neighborhood, setNeighborhood] = useState<Neighborhood>(VIJAYAWADA_NEIGHBORHOODS[0]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic neighborhood list based on city
  const availableNeighborhoods = useMemo(() => {
    return city === 'Vijayawada' ? VIJAYAWADA_NEIGHBORHOODS : GUNTUR_NEIGHBORHOODS;
  }, [city]);

  const handleCityChange = (newCity: SupportedCity) => {
    setCity(newCity);
    setNeighborhood(newCity === 'Vijayawada' ? VIJAYAWADA_NEIGHBORHOODS[0] : GUNTUR_NEIGHBORHOODS[0]);
  };

  // Live Password Checklist
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isFormSubmittable = !isLoading && hasMinLength && hasNumber && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError('Please provide your full legal name or volunteer callsign (min 2 characters).');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email format (e.g. steward@ecopulse.in).');
      return;
    }
    if (!hasMinLength) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!hasNumber) {
      setError('Password must include at least one numeric digit (0-9).');
      return;
    }
    if (!passwordsMatch) {
      setError('Password and confirm password entries do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signup(name.trim(), email.trim(), password, city, neighborhood);
      if (res.success) {
        // Navigate to the operations dashboard with new steward account
        setActiveTab('overview');
      } else {
        setError(res.error || 'Account creation could not be completed.');
      }
    } catch {
      setError('An unexpected error occurred while creating your account. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
      <div className="fixed inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#35E6A1] to-transparent z-10 opacity-75" />
      <div className="fixed top-1/4 -right-48 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-1/4 -left-48 w-96 h-96 bg-[#8B7CFF]/15 rounded-full blur-3xl pointer-events-none z-0" />

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
        <div className="w-full max-w-lg">
          {/* Cyberpunk Glass Card */}
          <div className="relative rounded-2xl bg-[#0B1020]/80 backdrop-blur-xl border border-[#35E6A1]/30 p-8 shadow-[0_0_40px_rgba(53,230,161,0.12)] space-y-6">
            {/* Top Glowing Edge Line */}
            <div className="absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#35E6A1] to-transparent opacity-80" />

            {/* Header Lockup */}
            <div className="space-y-1.5 text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#35E6A1]/10 border border-[#35E6A1]/30 text-[10px] font-mono font-bold uppercase tracking-wider text-[#35E6A1] mb-2">
                <Sparkles className="w-3 h-3 text-[#00E5FF]" />
                <span>+100 GreenPoints Welcome Bonus</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F3F6FC]">
                Create Civic Steward Account
              </h1>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Join our Vijayawada & Guntur civic action network. Report hazards, verify potholes, and earn verified impact points.
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#F3F6FC] tracking-wide">
                  Full Name / Volunteer Callsign *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-[#35E6A1]/80" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="e.g. Ramesh Kumar / Ananya Rao"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#111827]/80 text-[#F3F6FC] placeholder:text-[#6B7280] border border-slate-700/80 rounded-xl focus:border-[#35E6A1] focus:ring-1 focus:ring-[#35E6A1] transition-all outline-none"
                    disabled={isLoading}
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#F3F6FC] tracking-wide">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-[#35E6A1]/80" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="steward@domain.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#111827]/80 text-[#F3F6FC] placeholder:text-[#6B7280] border border-slate-700/80 rounded-xl focus:border-[#35E6A1] focus:ring-1 focus:ring-[#35E6A1] transition-all outline-none"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* City & Locality (Strictly Vijayawada & Guntur) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#F3F6FC] tracking-wide">
                    City Jurisdiction *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => handleCityChange(e.target.value as SupportedCity)}
                    className="w-full px-3 py-2.5 text-xs bg-[#111827] text-[#F3F6FC] border border-slate-700/80 rounded-xl focus:border-[#35E6A1] focus:ring-1 focus:ring-[#35E6A1] transition-all outline-none font-medium"
                    disabled={isLoading}
                  >
                    <option value="Vijayawada" className="text-[#111827] bg-white font-medium">Vijayawada (VMC)</option>
                    <option value="Guntur" className="text-[#111827] bg-white font-medium">Guntur (GMC)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#F3F6FC] tracking-wide">
                    Assigned Locality *
                  </label>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value as Neighborhood)}
                    className="w-full px-3 py-2.5 text-xs bg-[#111827] text-[#F3F6FC] border border-slate-700/80 rounded-xl focus:border-[#35E6A1] focus:ring-1 focus:ring-[#35E6A1] transition-all outline-none font-medium"
                    disabled={isLoading}
                  >
                    {availableNeighborhoods.map((n) => (
                      <option key={n} value={n} className="text-[#111827] bg-white font-medium">
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#F3F6FC] tracking-wide">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Min 8 characters"
                      className="w-full pl-3.5 pr-9 py-2.5 text-xs bg-[#111827]/80 text-[#F3F6FC] placeholder:text-[#6B7280] border border-slate-700/80 rounded-xl focus:border-[#35E6A1] focus:ring-1 focus:ring-[#35E6A1] transition-all outline-none"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-[#35E6A1] transition-colors focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#F3F6FC] tracking-wide">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Repeat password"
                      className="w-full pl-3.5 pr-9 py-2.5 text-xs bg-[#111827]/80 text-[#F3F6FC] placeholder:text-[#6B7280] border border-slate-700/80 rounded-xl focus:border-[#35E6A1] focus:ring-1 focus:ring-[#35E6A1] transition-all outline-none"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-[#35E6A1] transition-colors focus:outline-none"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Quality Checklist */}
              <div className="p-3 bg-[#111827]/60 rounded-xl border border-slate-800 text-[11px] space-y-1.5">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">
                  Security Checklist:
                </span>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div className={`flex items-center gap-1 ${hasMinLength ? 'text-[#35E6A1]' : 'text-slate-500'}`}>
                    {hasMinLength ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 inline-block rounded-full border border-slate-600" />}
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1 ${hasNumber ? 'text-[#35E6A1]' : 'text-slate-500'}`}>
                    {hasNumber ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 inline-block rounded-full border border-slate-600" />}
                    <span>1+ number</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordsMatch ? 'text-[#35E6A1]' : 'text-slate-500'}`}>
                    {passwordsMatch ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 inline-block rounded-full border border-slate-600" />}
                    <span>Passwords match</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs text-[#0B1020] bg-gradient-to-r from-[#35E6A1] via-[#00E5FF] to-[#35E6A1] hover:brightness-110 active:brightness-95 transition-all shadow-[0_0_20px_rgba(53,230,161,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0B1020] border-t-transparent rounded-full animate-spin" />
                    <span>Provisioning Steward Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Create Steward Account (+100 Pts)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Navigation Link to Login */}
            <div className="text-center pt-2 border-t border-slate-800/80">
              <p className="text-xs text-slate-300">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="font-bold text-[#00E5FF] hover:text-[#35E6A1] underline decoration-[#00E5FF]/50 underline-offset-4 transition-colors cursor-pointer"
                >
                  Log In to Existing Account
                </button>
              </p>
            </div>
          </div>

          {/* Privacy & Security Note */}
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <Shield className="w-3.5 h-3.5 text-[#35E6A1]" />
              <span>Zero Plaintext Passwords Stored · Client Demonstration Boundary</span>
            </span>
          </div>
        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="relative z-20 py-4 px-6 text-center text-[11px] text-slate-400 border-t border-slate-800/60 bg-[#0B1020]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Serving Vijayawada & Guntur, Andhra Pradesh</span>
          <span className="font-mono text-[#35E6A1]">EcoPulse v3.0 · Cyberpunk Civic Edition</span>
        </div>
      </footer>
    </div>
  );
};
