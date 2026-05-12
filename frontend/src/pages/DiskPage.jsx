import { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '../components/common/Sidebar';
import GlassCard from '../components/common/GlassCard';
import NeonButton from '../components/common/NeonButton';
import AIChatPanel from '../components/ai/AIChatPanel';
import { diskFCFS, diskSSTF, diskSCAN, diskCSCAN, diskLOOK, compareAllDisk } from '../algorithms/disk';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import { HiPlay, HiChartBar } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const ALGOS = [
  { key: 'fcfs', label: 'FCFS' }, { key: 'sstf', label: 'SSTF' },
  { key: 'scan', label: 'SCAN' }, { key: 'cscan', label: 'C-SCAN' }, { key: 'look', label: 'LOOK' },
];

export default function DiskPage() {
  const [requestStr, setRequestStr] = useState('98 183 37 122 14 124 65 67');
  const [head, setHead] = useState(53);
  const [maxCylinder, setMaxCylinder] = useState(199);
  const [algorithm, setAlgorithm] = useState('fcfs');
  const [result, setResult] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareResults, setCompareResults] = useState(null);

  const requests = requestStr.trim().split(/[\s,]+/).filter(Boolean).map(Number);

  const run = () => {
    if (requests.length === 0) { toast.error('Enter disk requests'); return; }
    let res;
    switch (algorithm) {
      case 'fcfs': res = diskFCFS(requests, head); break;
      case 'sstf': res = diskSSTF(requests, head); break;
      case 'scan': res = diskSCAN(requests, head, maxCylinder); break;
      case 'cscan': res = diskCSCAN(requests, head, maxCylinder); break;
      case 'look': res = diskLOOK(requests, head); break;
      default: res = diskFCFS(requests, head);
    }
    setResult(res); setCompareMode(false);
    toast.success(`${res.algorithmName}: Total seek = ${res.totalSeek}`);
  };

  const runCompare = () => {
    if (requests.length === 0) { toast.error('Enter disk requests'); return; }
    setCompareResults(compareAllDisk(requests, head, maxCylinder));
    setCompareMode(true); setResult(null);
    toast.success('Comparison complete!');
  };

  const chartData = result ? result.movements.map((pos, i) => ({ step: i, position: pos })) : [];

  return (
    <MainLayout>
      <AIChatPanel context="disk" />
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Disk Scheduling <span className="gradient-text">Simulator</span></h1>
          <p className="text-white/40">Visualize disk head movement and seek time calculations</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <GlassCard>
              <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Algorithm</h3>
              <div className="grid grid-cols-2 gap-2">
                {ALGOS.map(a => (
                  <button key={a.key} onClick={() => setAlgorithm(a.key)}
                    className={`p-3 rounded-xl text-sm font-bold transition-all ${algorithm === a.key ? 'bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan' : 'bg-white/3 border border-white/5 text-white/50 hover:border-white/20'}`}>
                    {a.label}
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Request Queue</label>
                  <input value={requestStr} onChange={e => setRequestStr(e.target.value)} className="input-glow" placeholder="e.g. 98 183 37 122" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Initial Head Position</label>
                  <input type="number" value={head} onChange={e => setHead(parseInt(e.target.value) || 0)} className="input-glow" min="0" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Max Cylinder</label>
                  <input type="number" value={maxCylinder} onChange={e => setMaxCylinder(parseInt(e.target.value) || 199)} className="input-glow" min="1" />
                </div>
              </div>
            </GlassCard>

            <div className="space-y-3">
              <NeonButton onClick={run} variant="fill" className="w-full flex items-center justify-center gap-2"><HiPlay /> Run</NeonButton>
              <NeonButton onClick={runCompare} className="w-full flex items-center justify-center gap-2"><HiChartBar /> Compare All</NeonButton>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {result && (
              <>
                <GlassCard hover={false}>
                  <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Head Movement — {result.algorithmName}</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="step" stroke="rgba(255,255,255,0.3)" fontSize={12} label={{ value: 'Step', position: 'bottom', fill: 'rgba(255,255,255,0.3)' }} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} domain={[0, maxCylinder]} label={{ value: 'Cylinder', angle: -90, position: 'left', fill: 'rgba(255,255,255,0.3)' }} />
                        <Tooltip contentStyle={{ background: '#111128', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                        <Line type="linear" dataKey="position" stroke="#00f5ff" strokeWidth={2} dot={{ fill: '#00f5ff', r: 4 }} activeDot={{ r: 6, stroke: '#00f5ff', strokeWidth: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>

                <div className="grid grid-cols-2 gap-4">
                  <GlassCard hover={false} className="text-center">
                    <div className="text-3xl font-black text-neon-cyan">{result.totalSeek}</div>
                    <div className="text-xs text-white/30 mt-1">Total Seek Time</div>
                  </GlassCard>
                  <GlassCard hover={false} className="text-center">
                    <div className="text-3xl font-black text-neon-purple">{(result.totalSeek / requests.length).toFixed(1)}</div>
                    <div className="text-xs text-white/30 mt-1">Avg Seek per Request</div>
                  </GlassCard>
                </div>

                <GlassCard hover={false}>
                  <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-3">Service Order</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.movements.map((pos, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${i === 0 ? 'bg-neon-green/10 border-neon-green/30 text-neon-green' : 'bg-white/3 border-white/10 text-white/60'}`}>
                        {pos}
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </>
            )}

            {compareMode && compareResults && (
              <GlassCard hover={false}>
                <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Seek Time Comparison</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={compareResults.map(r => ({ name: r.algorithmName, 'Total Seek': r.totalSeek }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                      <Tooltip contentStyle={{ background: '#111128', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                      <Bar dataKey="Total Seek" fill="#00f5ff" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            )}

            {!result && !compareMode && (
              <GlassCard hover={false} className="text-center py-20">
                <div className="text-6xl mb-4">💿</div>
                <h3 className="text-xl font-bold text-white mb-2">Disk Scheduler Ready</h3>
                <p className="text-white/30 text-sm">Enter request queue and select an algorithm</p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
