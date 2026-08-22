import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

const loginIllustration =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCIAsTeYuuXtUk-kXt59t7s7yIuyIPREas3HtD9wlPlIOirwlwLAwWrK551sUIHpRBUgU4GR2t8pUBBSACHQ8kmK3BNtaaEd8lJMr9cK-hH4z9w8FMumYXVOcug7_q4wuGQlay-GATYRmbs_yp2Miso46JeEvcS3OFINti615OfLAIy_DyjtySPDpGSq4SF-qvhfysq3Er_SH1E-1pkZY-qjnq8P_jlENBjTwg4hJVDnHu6-rYI50OBCkPvNxS7rh8Wzkq_KeqjPQ9RrLg';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('demo1@globetrotter.local');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-on-background flex items-center justify-center font-body p-4 md:p-10">
      <div className="w-full max-w-[1200px] min-h-[calc(100svh-2rem)] md:h-[800px] md:min-h-0 bg-surface-container-lowest rounded-[32px] overflow-hidden flex flex-col md:flex-row relative border-[3px] border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
        <section className="hidden md:flex md:w-1/2 relative bg-surface-container overflow-hidden items-center justify-center p-10 lg:p-20 border-r-[3px] border-black">
          <div className="absolute inset-0 bg-secondary/10 rounded-tr-[120px] rounded-bl-[120px] m-10 border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]" />
          <div className="relative z-10 w-full h-full max-w-md max-h-[600px] rounded-t-[200px] rounded-b-xl overflow-hidden border-[3px] border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] bg-surface-container-lowest">
            <img
              className="w-full h-full object-cover"
              src={loginIllustration}
              alt="Traveler planning a mindful journey"
            />
          </div>
          <div className="absolute top-24 left-24 w-12 h-12 rounded-full bg-primary border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]" />
          <div className="absolute bottom-32 right-32 w-20 h-20 rounded-full bg-tertiary-container border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]" />
        </section>

        <section className="w-full md:w-1/2 p-6 sm:p-10 md:p-16 flex flex-col justify-center relative bg-surface-container-lowest">
          <div className="absolute top-8 left-8 md:top-12 md:left-16">
            <p className="font-heading text-2xl font-bold text-primary tracking-tight">Globe Trotter</p>
          </div>

          <div className="max-w-md w-full mx-auto mt-16 md:mt-0">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-on-surface mb-2">Welcome back</h1>
            <p className="text-base text-on-surface-variant mb-10">Continue your journey of mindful exploration.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder=" "
                  autoComplete="email"
                  required
                  className="peer w-full h-14 px-4 pt-2 border-2 border-black rounded-lg bg-surface-container-lowest text-on-surface transition-colors focus:border-black focus:outline-none"
                />
                <label
                  htmlFor="login-email"
                  className="pointer-events-none absolute left-4 top-0 -translate-y-1/2 bg-surface-container-lowest px-1 text-sm text-on-surface-variant transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:px-0 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:px-1"
                >
                  Email address
                </label>
              </div>

              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder=" "
                  autoComplete="current-password"
                  required
                  className="peer w-full h-14 px-4 pt-2 pr-12 border-2 border-black rounded-lg bg-surface-container-lowest text-on-surface transition-colors focus:border-black focus:outline-none"
                />
                <label
                  htmlFor="login-password"
                  className="pointer-events-none absolute left-4 top-0 -translate-y-1/2 bg-surface-container-lowest px-1 text-sm text-on-surface-variant transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:px-0 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:px-1"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex justify-end">
                <button type="button" className="text-sm text-secondary hover:text-primary transition-colors">
                  Forgot Password?
                </button>
              </div>

              {error && (
                <p role="alert" className="border-2 border-black bg-error-container px-3 py-2 text-sm font-semibold text-on-error-container">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary text-on-primary font-semibold rounded-full border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] disabled:cursor-wait disabled:opacity-70 transition-all"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-black" /></div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface-container-lowest text-on-surface-variant border-2 border-black rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="h-12 border-2 border-black rounded-full text-on-surface hover:bg-surface-container-low shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all">Google</button>
              <button type="button" className="h-12 border-2 border-black rounded-full text-on-surface hover:bg-surface-container-low shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all">Apple</button>
            </div>

            <p className="text-center text-base text-on-surface-variant mt-10">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary-container border-b-2 border-black ml-1">Sign Up</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};
