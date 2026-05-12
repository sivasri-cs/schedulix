import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '../components/common/Sidebar';
import GlassCard from '../components/common/GlassCard';
import NeonButton from '../components/common/NeonButton';
import AIChatPanel from '../components/ai/AIChatPanel';
import { fcfs, sjf, roundRobin, priorityScheduling, compareAll } from '../algorithms/scheduling';
import { exportToPDF } from '../utils/pdfExport';
import { saveSimulation } from '../services/simulationService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { HiPlus, HiTrash, HiPlay, HiArrowPath, HiDocumentArrowDown, HiBookmark, HiChartBar } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const ALGOS = [
  { key: 'fcfs', label: 'FCFS', desc: 'First Come First Served' },
  { key: 'sjf', label: 'SJF', desc: 'Shortest Job First' },
  { key: 'rr', label: 'Round Robin', desc: 'Time Quantum Based' },
  { key: 'priority', label: 'Priority', desc: 'Priority Based' },
];

const defaultProcesses = [
  { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
  { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
  { id: 'P3', arrivalTime: 2, burstTime: 8, priority: 4 },
  { id: 'P4', arrivalTime: 3, burstTime: 2, priority: 3 },
];

export default function SchedulingPage() {
  const [processes, setProcesses] = useState(defaultProcesses);
  const [algorithm, setAlgorithm] = useState('fcfs');
  const [quantum, setQuantum] = useState(2);
  const [result, setResult] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareResults, setCompareResults] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [animStep, setAnimStep] = useState(-1);

  const addProcess = () => {
    const id = `P${processes.length + 1}`;
    setProcesses([...processes, { id, arrivalTime: 0, burstTime: 1, priority: 1 }]);
  };

  const updateProcess = (idx, field, value) => {
    const updated = [...processes];
    updated[idx] = { ...updated[idx], [field]: Math.max(0, parseInt(value) || 0) };
    setProcesses(updated);
  };

  const deleteProcess = (idx) => setProcesses(processes.filter((_, i) => i !== idx));

  const runSimulation = useCallback(() => {
    if (processes.length === 0) { toast.error('Add at least one process'); return; }
    let res;
    switch (algorithm) {
      case 'fcfs': res = fcfs(processes); break;
      case 'sjf': res = sjf(processes); break;
      case 'rr': res = roundRobin(processes, quantum); break;
      case 'priority': res = priorityScheduling(processes); break;
      default: res = fcfs(processes);
    }
    setResult(res);
    setCompareMode(false);
    setCompareResults(null);
    // Animate gantt
    setAnimating(true);
    setAnimStep(0);
    res.gantt.forEach((_, i) => {
      setTimeout(() => setAnimStep(i), (i + 1) * 400);
    });
    setTimeout(() => setAnimating(false), res.gantt.length * 400 + 500);
    toast.success(`${res.algorithmName} simulation complete!`);
  }, [processes, algorithm, quantum]);

  const runComparison = () => {
    if (processes.length === 0) { toast.error('Add at least one process'); return; }
    const results = compareAll(processes, quantum);
    setCompareResults(results);
    setCompareMode(true);
    setResult(null);
    toast.success('Comparison complete!');
  };

  const handleSave = async () => {
    try {
      await saveSimulation({ type: 'scheduling', config: { processes, algorithm, quantum }, results: result || compareResults });
      toast.success('Simulation saved!');
    } catch { toast.error('Login to save simulations'); }
  };

  const handleExport = () => {
    if (!result) return;
    exportToPDF(result.algorithmName, result.results.map(r => ({ Process: r.id, Arrival: r.arrivalTime, Burst: r.burstTime, Waiting: r.waitingTime, Turnaround: r.turnaroundTime, Completion: r.completionTime })),
      { 'Avg Waiting Time': result.avgWaiting, 'Avg Turnaround Time': result.avgTurnaround, 'CPU Utilization': `${result.cpuUtilization}%` });
    toast.success('PDF exported!');
  };

  const totalTime = result ? Math.max(...result.gantt.map(g => g.end)) : 0;

  return (
    <MainLayout>
      <AIChatPanel context="scheduling" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Process Scheduling <span className="gradient-text">Simulator</span></h1>
          <p className="text-white/40">Visualize CPU scheduling algorithms with animated Gantt charts</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Algorithm Selector */}
            <GlassCard>
              <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Algorithm</h3>
              <div className="grid grid-cols-2 gap-2">
                {ALGOS.map(a => (
                  <button key={a.key} onClick={() => setAlgorithm(a.key)}
                    className={`p-3 rounded-xl text-left transition-all text-sm ${algorithm === a.key ? 'bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan' : 'bg-white/3 border border-white/5 text-white/50 hover:border-white/20'}`}>
                    <div className="font-bold">{a.label}</div>
                    <div className="text-[10px] opacity-60">{a.desc}</div>
                  </button>
                ))}
              </div>
              {algorithm === 'rr' && (
                <div className="mt-4">
                  <label className="text-xs text-white/40 mb-1 block">Time Quantum</label>
                  <input type="number" value={quantum} onChange={e => setQuantum(Math.max(1, parseInt(e.target.value) || 1))} className="input-glow" min="1" />
                </div>
              )}
            </GlassCard>

            {/* Process Input */}
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider">Processes</h3>
                <button onClick={addProcess} className="text-neon-cyan hover:text-white transition-colors"><HiPlus size={20} /></button>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {processes.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="bg-white/3 rounded-xl p-3 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-neon-cyan">{p.id}</span>
                      <button onClick={() => deleteProcess(i)} className="text-white/20 hover:text-neon-pink"><HiTrash size={14} /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div><label className="text-[10px] text-white/30 block">Arrival</label><input type="number" value={p.arrivalTime} onChange={e => updateProcess(i, 'arrivalTime', e.target.value)} className="input-glow !py-1.5 !text-xs" min="0" /></div>
                      <div><label className="text-[10px] text-white/30 block">Burst</label><input type="number" value={p.burstTime} onChange={e => updateProcess(i, 'burstTime', e.target.value)} className="input-glow !py-1.5 !text-xs" min="1" /></div>
                      <div><label className="text-[10px] text-white/30 block">Priority</label><input type="number" value={p.priority} onChange={e => updateProcess(i, 'priority', e.target.value)} className="input-glow !py-1.5 !text-xs" min="0" /></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Actions */}
            <div className="space-y-3">
              <NeonButton onClick={runSimulation} variant="fill" className="w-full flex items-center justify-center gap-2">
                <HiPlay /> Run Simulation
              </NeonButton>
              <NeonButton onClick={runComparison} className="w-full flex items-center justify-center gap-2">
                <HiChartBar /> Compare All
              </NeonButton>
              <div className="grid grid-cols-2 gap-3">
                <NeonButton onClick={handleSave} className="flex items-center justify-center gap-1 !text-xs"><HiBookmark /> Save</NeonButton>
                <NeonButton onClick={handleExport} disabled={!result} className="flex items-center justify-center gap-1 !text-xs"><HiDocumentArrowDown /> PDF</NeonButton>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gantt Chart */}
            {result && (
              <GlassCard hover={false}>
                <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Gantt Chart — {result.algorithmName}</h3>
                <div className="overflow-x-auto pb-2">
                  <div className="flex items-end gap-0.5 min-w-[600px] h-20 relative">
                    {result.gantt.map((block, i) => {
                      const width = ((block.end - block.start) / totalTime) * 100;
                      return (
                        <motion.div key={i}
                          initial={{ scaleX: 0, opacity: 0 }} animate={i <= animStep ? { scaleX: 1, opacity: 1 } : {}}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          style={{ width: `${width}%`, backgroundColor: block.color, originX: 0 }}
                          className="h-full rounded-lg flex items-center justify-center text-xs font-bold text-white relative group gantt-block">
                          <span className="z-10">{block.name}</span>
                          <div className="absolute -bottom-6 left-0 text-[10px] text-white/30">{block.start}</div>
                          {i === result.gantt.length - 1 && <div className="absolute -bottom-6 right-0 text-[10px] text-white/30">{block.end}</div>}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Metrics */}
            {result && (
              <div className="grid grid-cols-3 gap-4">
                <GlassCard hover={false} className="text-center">
                  <div className="text-2xl font-black text-neon-cyan">{result.avgWaiting}</div>
                  <div className="text-xs text-white/30 mt-1">Avg Waiting Time</div>
                </GlassCard>
                <GlassCard hover={false} className="text-center">
                  <div className="text-2xl font-black text-neon-purple">{result.avgTurnaround}</div>
                  <div className="text-xs text-white/30 mt-1">Avg Turnaround</div>
                </GlassCard>
                <GlassCard hover={false} className="text-center">
                  <div className="text-2xl font-black text-neon-green">{result.cpuUtilization}%</div>
                  <div className="text-xs text-white/30 mt-1">CPU Utilization</div>
                </GlassCard>
              </div>
            )}

            {/* Results Table */}
            {result && (
              <GlassCard hover={false}>
                <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Process Results</h3>
                <div className="overflow-x-auto">
                  <table className="osnova-table">
                    <thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Priority</th><th>Completion</th><th>Waiting</th><th>Turnaround</th></tr></thead>
                    <tbody>
                      {result.results.map((r, i) => (
                        <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                          <td className="font-bold" style={{ color: r.color }}>{r.id}</td>
                          <td>{r.arrivalTime}</td><td>{r.burstTime}</td><td>{r.priority ?? '-'}</td>
                          <td className="text-neon-green">{r.completionTime}</td>
                          <td className="text-neon-cyan">{r.waitingTime}</td>
                          <td className="text-neon-purple">{r.turnaroundTime}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}

            {/* Comparison Mode */}
            {compareMode && compareResults && (
              <GlassCard hover={false}>
                <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Algorithm Comparison</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={compareResults.map(r => ({ name: r.algorithmName, 'Avg Waiting': parseFloat(r.avgWaiting), 'Avg Turnaround': parseFloat(r.avgTurnaround), 'CPU %': parseFloat(r.cpuUtilization) }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                      <Tooltip contentStyle={{ background: '#111128', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                      <Bar dataKey="Avg Waiting" fill="#00f5ff" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Avg Turnaround" fill="#a855f7" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="CPU %" fill="#00ff88" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                  {compareResults.map((r, i) => (
                    <div key={i} className="bg-white/3 rounded-xl p-3 border border-white/5">
                      <div className="font-bold text-sm text-white mb-1">{r.algorithmName}</div>
                      <div className="text-[10px] text-white/40 space-y-1">
                        <div>Wait: <span className="text-neon-cyan">{r.avgWaiting}</span></div>
                        <div>Turn: <span className="text-neon-purple">{r.avgTurnaround}</span></div>
                        <div>CPU: <span className="text-neon-green">{r.cpuUtilization}%</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {!result && !compareMode && (
              <GlassCard hover={false} className="text-center py-20">
                <div className="text-6xl mb-4">🖥️</div>
                <h3 className="text-xl font-bold text-white mb-2">Ready to Simulate</h3>
                <p className="text-white/30 text-sm">Add processes, select an algorithm, and hit Run!</p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
