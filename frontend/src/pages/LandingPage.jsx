import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/common/AnimatedBackground';
import { HiCpuChip, HiCircleStack, HiLockClosed, HiServerStack, HiFolderOpen, HiSparkles, HiPlay, HiAcademicCap } from 'react-icons/hi2';

const features = [
  { icon: HiCpuChip, title: 'Process Scheduling', desc: 'FCFS, SJF, Round Robin, Priority — animated Gantt charts with real-time metrics', color: 'from-neon-cyan to-blue-500' },
  { icon: HiCircleStack, title: 'Memory Management', desc: 'FIFO, LRU, Optimal page replacement with animated RAM visualization', color: 'from-neon-purple to-pink-500' },
  { icon: HiLockClosed, title: 'Deadlock Detection', desc: "Banker's Algorithm, resource allocation graphs, safe sequence animation", color: 'from-neon-orange to-red-500' },
  { icon: HiServerStack, title: 'Disk Scheduling', desc: 'FCFS, SSTF, SCAN, C-SCAN, LOOK with seek time visualization', color: 'from-neon-green to-emerald-500' },
  { icon: HiFolderOpen, title: 'File System Explorer', desc: 'Directory tree, Linux terminal, file permissions simulator', color: 'from-neon-pink to-rose-500' },
  { icon: HiAcademicCap, title: 'Quiz & Learn', desc: 'Test your OS knowledge with interactive quizzes and leaderboard', color: 'from-yellow-400 to-orange-500' },
];

const stats = [
  { value: '5+', label: 'Simulators' },
  { value: '15+', label: 'Algorithms' },
  { value: '100%', label: 'Interactive' },
  { value: '∞', label: 'Learning' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-16 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center font-bold text-osnova-bg">OS</div>
          <span className="text-xl font-bold gradient-text">OSNova</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2">Login</Link>
          <Link to="/register" className="btn-neon-fill text-sm !py-2 !px-5">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-neon-cyan text-xs font-medium mb-8 border border-neon-cyan/20">
            <HiSparkles className="w-4 h-4" /> Interactive OS Learning Platform
          </div>
          <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="gradient-text">Master Operating</span><br />
            <span className="text-white">System Concepts</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Learn scheduling, memory management, deadlock detection, disk scheduling and file systems through beautiful, animated, interactive simulations.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register" className="btn-neon-fill !py-4 !px-8 text-base flex items-center gap-2">
              <HiPlay className="w-5 h-5" /> Start Simulating
            </Link>
            <Link to="/login" className="btn-neon !py-4 !px-8 text-base">
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Terminal preview */}
        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20 max-w-3xl mx-auto glass p-1 rounded-2xl neon-border">
          <div className="bg-osnova-bg/80 rounded-xl p-6 font-mono text-sm text-left">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="space-y-2 text-white/70">
              <p><span className="text-neon-green">osnova@sim</span>:<span className="text-neon-cyan">~</span>$ run scheduling --algo FCFS</p>
              <p className="text-neon-cyan">▸ Loading 5 processes...</p>
              <p className="text-neon-cyan">▸ Running FCFS simulation...</p>
              <p>  Avg Waiting Time: <span className="text-neon-green">8.4ms</span></p>
              <p>  Avg Turnaround:   <span className="text-neon-green">12.6ms</span></p>
              <p>  CPU Utilization:  <span className="text-neon-green">94.2%</span></p>
              <p className="text-neon-purple">▸ Gantt chart rendered ✓</p>
              <p className="text-white/40">$ <span className="terminal-cursor" /></p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass text-center py-6 px-4 rounded-2xl">
              <div className="text-3xl font-black gradient-text mb-1">{stat.value}</div>
              <div className="text-xs text-white/40 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">Explore <span className="gradient-text">Simulators</span></h2>
          <p className="text-white/40 max-w-xl mx-auto">Each module brings OS theory to life with interactive visualizations and real-time algorithm execution.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card p-6 group cursor-pointer">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center">
        <p className="text-white/20 text-sm">© 2026 OSNova. Built for learning operating systems interactively.</p>
      </footer>
    </div>
  );
}
