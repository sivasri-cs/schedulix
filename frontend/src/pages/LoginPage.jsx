import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/common/AnimatedBackground';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <AnimatedBackground />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-strong p-8 rounded-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center font-bold text-osnova-bg text-xl mb-4">OS</div>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-sm text-white/40">Sign in to your OSNova account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-glow" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-glow" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-neon-fill w-full !py-3.5 text-base">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-white/30 mt-6">
            Don't have an account? <Link to="/register" className="text-neon-cyan hover:underline">Sign up</Link>
          </p>
          <p className="text-center text-xs text-white/20 mt-3">
            <Link to="/" className="hover:text-white/40">← Back to home</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
