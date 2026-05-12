import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../components/common/Sidebar';
import GlassCard from '../components/common/GlassCard';
import AIChatPanel from '../components/ai/AIChatPanel';
import { useAuth } from '../context/AuthContext';
import { getSimulations } from '../services/simulationService';
import { HiCpuChip, HiCircleStack, HiLockClosed, HiServerStack, HiFolderOpen, HiAcademicCap, HiClock, HiChartBar } from 'react-icons/hi2';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const modules = [
  { path: '/scheduling', label: 'Process Scheduling', icon: HiCpuChip, color: 'from-neon-cyan to-blue-500', desc: 'FCFS, SJF, RR, Priority' },
  { path: '/memory', label: 'Memory Management', icon: HiCircleStack, color: 'from-neon-purple to-pink-500', desc: 'FIFO, LRU, Optimal' },
  { path: '/deadlock', label: 'Deadlock Detection', icon: HiLockClosed, color: 'from-neon-orange to-red-500', desc: "Banker's Algorithm" },
  { path: '/disk', label: 'Disk Scheduling', icon: HiServerStack, color: 'from-neon-green to-emerald-500', desc: 'FCFS, SSTF, SCAN' },
  { path: '/filesystem', label: 'File System', icon: HiFolderOpen, color: 'from-neon-pink to-rose-500', desc: 'Terminal & Explorer' },
  { path: '/quiz', label: 'Quiz Section', icon: HiAcademicCap, color: 'from-yellow-400 to-orange-500', desc: 'Test Your Knowledge' },
];

const cpuData = Array.from({ length: 20 }, (_, i) => ({ time: i, usage: 30 + Math.random() * 60 }));

export default function DashboardPage() {
  const { user } = useAuth();
  const [simulations, setSimulations] = useState([]);

  useEffect(() => {
    getSimulations().then(r => setSimulations(r.data.simulations || [])).catch(() => {});
  }, []);

  return (
    <MainLayout>
      <AIChatPanel />
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, <span className="gradient-text">{user?.name || 'User'}</span></h1>
          <p className="text-white/40">Your OS learning dashboard</p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Simulations', value: simulations.length, icon: HiChartBar, color: 'text-neon-cyan' },
            { label: 'Modules', value: '5', icon: HiCpuChip, color: 'text-neon-purple' },
            { label: 'Algorithms', value: '15+', icon: HiClock, color: 'text-neon-green' },
            { label: 'Quiz Score', value: user?.quizScores?.length ? `${Math.round(user.quizScores.reduce((a, b) => a + b, 0) / user.quizScores.length)}%` : '—', icon: HiAcademicCap, color: 'text-neon-orange' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="!p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-white/30 mt-0.5">{stat.label}</div>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color} opacity-30`} />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* CPU Animation */}
        <GlassCard hover={false} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider">Real-time CPU Usage Simulation</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-xs text-neon-green">Active</span>
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuData}>
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00f5ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.1)" fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.1)" fontSize={10} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#111128', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                <Area type="monotone" dataKey="usage" stroke="#00f5ff" fill="url(#cpuGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Module Cards */}
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Quick Access</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {modules.map((mod, i) => (
            <motion.div key={mod.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={mod.path}>
                <GlassCard className="group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <mod.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-neon-cyan transition-colors">{mod.label}</h3>
                      <p className="text-xs text-white/30">{mod.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Simulations */}
        {simulations.length > 0 && (
          <GlassCard hover={false}>
            <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Recent Simulations</h3>
            <div className="space-y-2">
              {simulations.slice(0, 5).map((sim, i) => (
                <div key={sim._id || i} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                  <div>
                    <span className="text-sm font-medium text-white capitalize">{sim.type}</span>
                    <span className="text-xs text-white/30 ml-2">{new Date(sim.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="text-xs text-neon-cyan">View →</span>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </MainLayout>
  );
}
