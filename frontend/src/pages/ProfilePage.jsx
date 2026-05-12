import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '../components/common/Sidebar';
import GlassCard from '../components/common/GlassCard';
import NeonButton from '../components/common/NeonButton';
import { useAuth } from '../context/AuthContext';
import { getSimulations, deleteSimulation } from '../services/simulationService';
import { HiTrash, HiUser, HiEnvelope, HiShieldCheck } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const [simulations, setSimulations] = useState([]);

  useEffect(() => { getSimulations().then(r => setSimulations(r.data.simulations || [])).catch(() => {}); }, []);

  const handleDelete = async (id) => {
    try { await deleteSimulation(id); setSimulations(s => s.filter(x => x._id !== id)); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your <span className="gradient-text">Profile</span></h1>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="md:col-span-1 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-3xl font-bold text-white mb-4">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-sm text-white/40">{user?.email}</p>
            <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan text-xs">
              <HiShieldCheck /> {user?.role}
            </div>
          </GlassCard>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <GlassCard className="text-center !p-4">
              <div className="text-3xl font-black text-neon-cyan">{simulations.length}</div>
              <div className="text-xs text-white/30">Total Simulations</div>
            </GlassCard>
            <GlassCard className="text-center !p-4">
              <div className="text-3xl font-black text-neon-purple">{new Set(simulations.map(s => s.type)).size}</div>
              <div className="text-xs text-white/30">Modules Used</div>
            </GlassCard>
            <GlassCard className="text-center !p-4">
              <div className="text-3xl font-black text-neon-green">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
              </div>
              <div className="text-xs text-white/30">Member Since</div>
            </GlassCard>
            <GlassCard className="text-center !p-4">
              <div className="text-3xl font-black text-neon-orange">{simulations.filter(s => s.type === 'scheduling').length}</div>
              <div className="text-xs text-white/30">Scheduling Sims</div>
            </GlassCard>
          </div>
        </div>

        <GlassCard hover={false}>
          <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Simulation History</h3>
          {simulations.length === 0 ? (
            <p className="text-white/30 text-center py-8">No simulations saved yet</p>
          ) : (
            <div className="space-y-2">
              {simulations.map((sim, i) => (
                <motion.div key={sim._id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-colors">
                  <div>
                    <span className="text-sm font-medium text-white capitalize">{sim.type}</span>
                    <span className="text-xs text-white/30 ml-3">{new Date(sim.createdAt).toLocaleString()}</span>
                  </div>
                  <button onClick={() => handleDelete(sim._id)} className="text-white/20 hover:text-neon-pink"><HiTrash size={16} /></button>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </MainLayout>
  );
}
