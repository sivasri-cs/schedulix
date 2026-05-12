import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/common/AnimatedBackground';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be 6+ characters'); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
            <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
            <p className="text-sm text-white/40">Join OSNova and start learning</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-glow" placeholder="John Doe" required />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-glow" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-glow" placeholder="Min 6 characters" required />
            </div>
            <button type="submit" disabled={loading} className="btn-neon-fill w-full !py-3.5 text-base">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-white/30 mt-6">
            Already have an account? <Link to="/login" className="text-neon-cyan hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
