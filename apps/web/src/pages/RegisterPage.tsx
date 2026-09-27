import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, User, Phone, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register({ name, email, phone, password });
      navigate('/live-map');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Try another email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel-elevated p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-cyan-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create Citizen Account</h2>
          <p className="text-xs text-slate-400">Join India's crowdsourced flood safety and intelligence network.</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                required
                placeholder="Rohan Verma"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                placeholder="rohan@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Phone (Optional)</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Password (min 6 chars)</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-400 hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
