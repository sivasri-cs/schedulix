import { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '../components/common/Sidebar';
import GlassCard from '../components/common/GlassCard';
import NeonButton from '../components/common/NeonButton';
import AIChatPanel from '../components/ai/AIChatPanel';
import { fifoPageReplacement, lruPageReplacement, optimalPageReplacement, compareMemoryAlgorithms } from '../algorithms/memory';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { HiPlay, HiChartBar } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const ALGOS = [
  { key: 'fifo', label: 'FIFO', desc: 'First In First Out' },
  { key: 'lru', label: 'LRU', desc: 'Least Recently Used' },
  { key: 'optimal', label: 'Optimal', desc: 'Best Possible' },
];

export default function MemoryPage() {
  const [pageString, setPageString] = useState('7 0 1 2 0 3 0 4 2 3 0 3 2');
  const [frameCount, setFrameCount] = useState(3);
  const [algorithm, setAlgorithm] = useState('fifo');
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [compareMode, setCompareMode] = useState(false);
  const [compareResults, setCompareResults] = useState(null);

  const pages = pageString.trim().split(/[\s,]+/).filter(Boolean);

  const runSimulation = () => {
    if (pages.length === 0) { toast.error('Enter page reference string'); return; }
    let res;
    switch (algorithm) {
      case 'fifo': res = fifoPageReplacement(pages, frameCount); break;
      case 'lru': res = lruPageReplacement(pages, frameCount); break;
      case 'optimal': res = optimalPageReplacement(pages, frameCount); break;
      default: res = fifoPageReplacement(pages, frameCount);
    }
    setResult(res);
    setCompareMode(false);
    setCurrentStep(-1);
    // Animate steps
    res.steps.forEach((_, i) => setTimeout(() => setCurrentStep(i), (i + 1) * 300));
    toast.success(`${res.algorithmName} simulation complete!`);
  };

  const runComparison = () => {
    if (pages.length === 0) { toast.error('Enter page reference string'); return; }
    setCompareResults(compareMemoryAlgorithms(pages, frameCount));
    setCompareMode(true);
    setResult(null);
    toast.success('Comparison complete!');
  };

  const pieData = result ? [
    { name: 'Hits', value: result.totalHits, color: '#00ff88' },
    { name: 'Faults', value: result.totalFaults, color: '#ff3e8e' },
  ] : [];

  return (
    <MainLayout>
      <AIChatPanel context="memory" />
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Memory Management <span className="gradient-text">Simulator</span></h1>
          <p className="text-white/40">Visualize page replacement algorithms with animated RAM blocks</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <GlassCard>
              <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Algorithm</h3>
              <div className="space-y-2">
                {ALGOS.map(a => (
                  <button key={a.key} onClick={() => setAlgorithm(a.key)}
                    className={`w-full p-3 rounded-xl text-left transition-all text-sm ${algorithm === a.key ? 'bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan' : 'bg-white/3 border border-white/5 text-white/50 hover:border-white/20'}`}>
                    <div className="font-bold">{a.label}</div><div className="text-[10px] opacity-60">{a.desc}</div>
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Page Reference String</label>
                  <input value={pageString} onChange={e => setPageString(e.target.value)} className="input-glow" placeholder="e.g. 7 0 1 2 0 3 0 4" />
                  <p className="text-[10px] text-white/20 mt-1">Space or comma separated</p>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Frame Count: {frameCount}</label>
                  <input type="range" min="1" max="7" value={frameCount} onChange={e => setFrameCount(parseInt(e.target.value))}
                    className="w-full accent-neon-cyan" />
                  <div className="flex justify-between text-[10px] text-white/20"><span>1</span><span>7</span></div>
                </div>
              </div>
            </GlassCard>

            <div className="space-y-3">
              <NeonButton onClick={runSimulation} variant="fill" className="w-full flex items-center justify-center gap-2"><HiPlay /> Run</NeonButton>
              <NeonButton onClick={runComparison} className="w-full flex items-center justify-center gap-2"><HiChartBar /> Compare All</NeonButton>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* RAM Visualization */}
            {result && (
              <GlassCard hover={false}>
                <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Memory Frames — {result.algorithmName}</h3>
                <div className="overflow-x-auto">
                  <div className="flex gap-1 min-w-[600px]">
                    {result.steps.map((step, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={i <= currentStep ? { opacity: 1, y: 0 } : { opacity: 0.2 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center">
                        <div className={`text-xs font-bold mb-2 ${step.fault ? 'text-neon-pink' : 'text-neon-green'}`}>{step.page}</div>
                        <div className="flex flex-col gap-1">
                          {Array.from({ length: frameCount }, (_, f) => (
                            <div key={f} className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
                              step.frames[f] !== undefined
                                ? (step.frames[f] === step.page && step.fault ? 'bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan ram-block page-in' : 'bg-white/5 border-white/10 text-white/60')
                                : 'bg-white/2 border-white/5 text-white/10'
                            }`}>
                              {step.frames[f] ?? '—'}
                            </div>
                          ))}
                        </div>
                        <div className={`text-[10px] mt-1 font-bold ${step.fault ? 'text-neon-pink' : 'text-neon-green'}`}>
                          {step.fault ? 'F' : 'H'}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Stats */}
            {result && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard hover={false} className="text-center !p-4">
                  <div className="text-2xl font-black text-neon-pink">{result.totalFaults}</div>
                  <div className="text-xs text-white/30">Page Faults</div>
                </GlassCard>
                <GlassCard hover={false} className="text-center !p-4">
                  <div className="text-2xl font-black text-neon-green">{result.totalHits}</div>
                  <div className="text-xs text-white/30">Page Hits</div>
                </GlassCard>
                <GlassCard hover={false} className="text-center !p-4">
                  <div className="text-2xl font-black text-neon-cyan">{result.hitRatio}%</div>
                  <div className="text-xs text-white/30">Hit Ratio</div>
                </GlassCard>
                <GlassCard hover={false} className="text-center !p-4">
                  <div className="h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart><Pie data={pieData} innerRadius={20} outerRadius={35} dataKey="value" stroke="none">
                        {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie></PieChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Comparison */}
            {compareMode && compareResults && (
              <GlassCard hover={false}>
                <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Algorithm Comparison</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={compareResults.map(r => ({ name: r.algorithmName, Faults: r.totalFaults, Hits: r.totalHits }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                      <Tooltip contentStyle={{ background: '#111128', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                      <Bar dataKey="Faults" fill="#ff3e8e" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Hits" fill="#00ff88" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            )}

            {!result && !compareMode && (
              <GlassCard hover={false} className="text-center py-20">
                <div className="text-6xl mb-4">🧠</div>
                <h3 className="text-xl font-bold text-white mb-2">Memory Simulator Ready</h3>
                <p className="text-white/30 text-sm">Enter a page reference string and select an algorithm to begin</p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
