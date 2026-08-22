import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register } = useApp();
  const navigate = useNavigate();

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(`${firstName} ${lastName}`.trim(), email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = 'w-full bg-surface border-2 border-black rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-black transition-colors';
  const labelClass = 'font-heading text-xs text-black font-bold mb-2 ml-1';

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body antialiased flex flex-col overflow-x-hidden">
      <header className="bg-surface/90 border-b-2 border-black w-full">
        <div className="flex items-center w-full px-4 md:px-10 py-4 max-w-[1200px] mx-auto">
          <Link to="/login" className="font-heading text-2xl font-bold text-primary hover:scale-105 transition-transform">
            Globe Trotter
          </Link>
        </div>
      </header>

      <main className="flex-grow w-full max-w-3xl mx-auto px-4 md:px-10 py-12 md:py-20 flex flex-col items-center">
        <div className="w-full bg-white border-[3px] border-black rounded-xl p-6 md:p-12 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <div className="text-center mb-10">
            <h1 className="font-heading text-3xl md:text-4xl text-on-surface mb-2 font-bold">Create Your Profile</h1>
            <p className="text-base text-on-surface-variant">Join the community of mindful explorers.</p>
          </div>

          <div className="flex flex-col items-center mb-10">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
              aria-label="Upload profile photo"
            >
              <div className="w-32 h-32 rounded-full border-[3px] border-black bg-surface-container-high flex items-center justify-center overflow-hidden group-hover:bg-primary-fixed transition-colors">
                {avatar ? <img src={avatar} alt="Profile preview" className="w-full h-full object-cover" /> : <Camera className="w-9 h-9 text-black" />}
              </div>
              <span className="absolute bottom-0 right-0 bg-primary border-2 border-black text-on-primary rounded-full p-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)] translate-x-2 translate-y-2 group-hover:scale-110 transition-transform">
                <Upload className="w-4 h-4" />
              </span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            <span className="mt-4 text-sm text-black font-bold">Upload Photo</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col">
                <span className={labelClass}>First Name</span>
                <input value={firstName} onChange={(event) => setFirstName(event.target.value)} className={fieldClass} placeholder="Jane" required />
              </label>
              <label className="flex flex-col">
                <span className={labelClass}>Last Name</span>
                <input value={lastName} onChange={(event) => setLastName(event.target.value)} className={fieldClass} placeholder="Doe" required />
              </label>
              <label className="flex flex-col">
                <span className={labelClass}>Email Address</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={fieldClass} placeholder="jane.doe@example.com" autoComplete="email" required />
              </label>
              <label className="flex flex-col">
                <span className={labelClass}>Phone Number</span>
                <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={fieldClass} placeholder="+1 (555) 000-0000" />
              </label>
              <label className="flex flex-col">
                <span className={labelClass}>Password</span>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={fieldClass} placeholder="At least 8 characters" autoComplete="new-password" required />
              </label>
              <label className="flex flex-col">
                <span className={labelClass}>City</span>
                <input value={city} onChange={(event) => setCity(event.target.value)} className={fieldClass} placeholder="Seattle" />
              </label>
              <label className="flex flex-col">
                <span className={labelClass}>Country</span>
                <select value={country} onChange={(event) => setCountry(event.target.value)} className={`${fieldClass} appearance-none`}>
                  <option value="">Select a country</option>
                  <option value="us">United States</option>
                  <option value="ca">Canada</option>
                  <option value="uk">United Kingdom</option>
                  <option value="au">Australia</option>
                  <option value="jp">Japan</option>
                </select>
              </label>
            </div>

            <label className="flex flex-col pt-2">
              <span className={labelClass}>Additional Information</span>
              <textarea value={additionalInfo} onChange={(event) => setAdditionalInfo(event.target.value)} className={`${fieldClass} resize-none`} placeholder="Tell us about your travel preferences or dietary requirements..." rows={4} />
            </label>

            {error && <p role="alert" className="border-2 border-black bg-error-container px-3 py-2 text-sm font-semibold text-on-error-container">{error}</p>}

            <div className="pt-4 flex justify-center">
              <button type="submit" disabled={loading} className="bg-primary-container hover:bg-primary border-[3px] border-black text-black py-4 px-12 rounded-lg min-h-12 flex items-center justify-center gap-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-wait disabled:opacity-70 transition-all w-full md:w-auto font-bold uppercase tracking-wider">
                <span>{loading ? 'Creating account...' : 'Register user'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-8">
            Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </main>

      <footer className="bg-surface-container border-t-2 border-black w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-heading text-lg text-primary font-bold">Globe Trotter</div>
        <nav className="flex gap-6 text-sm text-on-surface-variant">
          <a href="#support" className="hover:text-black hover:underline">Support</a>
          <a href="#privacy" className="hover:text-black hover:underline">Privacy</a>
          <a href="#terms" className="hover:text-black hover:underline">Terms</a>
          <a href="#destinations" className="hover:text-black hover:underline">Destinations</a>
        </nav>
        <div className="text-xs text-black font-medium">© 2024 Globe Trotter. Mindful Exploration.</div>
      </footer>
    </div>
  );
};
