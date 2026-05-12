import { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '../components/common/Sidebar';
import GlassCard from '../components/common/GlassCard';
import NeonButton from '../components/common/NeonButton';
import AIChatPanel from '../components/ai/AIChatPanel';
import { bankersAlgorithm } from '../algorithms/deadlock';
import { HiPlay, HiPlus, HiMinus } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function DeadlockPage() {
  const [numProc, setNumProc] = useState(3);
  const [numRes, setNumRes] = useState(3);
  const [allocation, setAllocation] = useState([[0,1,0],[2,0,0],[3,0,2]]);
  const [max, setMax] = useState([[7,5,3],[3,2,2],[9,0,2]]);
  const [available, setAvailable] = useState([3,3,2]);
  const [result, setResult] = useState(null);
  const [animStep, setAnimStep] = useState(-1);

  const updateMatrix = (matrix, setMatrix, i, j, val) => {
    const m = matrix.map(r => [...r]);
    m[i][j] = Math.max(0, parseInt(val) || 0);
    setMatrix(m);
  };

  const resize = (np, nr) => {
    setNumProc(np); setNumRes(nr);
    setAllocation(Array.from({length: np}, (_, i) => Array.from({length: nr}, (_, j) => allocation[i]?.[j] || 0)));
    setMax(Array.from({length: np}, (_, i) => Array.from({length: nr}, (_, j) => max[i]?.[j] || 0)));
    setAvailable(Array.from({length: nr}, (_, j) => available[j] || 0));
  };

  const run = () => {
    const res = bankersAlgorithm(allocation, max, available);
    setResult(res);
    setAnimStep(-1);
    res.steps.forEach((_, i) => setTimeout(() => setAnimStep(i), (i + 1) * 600));
    toast.success(res.safe ? 'System is in SAFE state!' : 'DEADLOCK detected!');
  };

  // Resource allocation graph positions
  const procPositions = Array.from({length: numProc}, (_, i) => ({
    x: 100, y: 60 + i * 80, label: `P${i}`
  }));
  const resPositions = Array.from({length: numRes}, (_, i) => ({
    x: 340, y: 60 + i * 80, label: `R${i}`
  }));

  return (
    <MainLayout>
      <AIChatPanel context="deadlock" />
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Deadlock Detection & <span className="gradient-text">Banker's Algorithm</span></h1>
          <p className="text-white/40">Visualize resource allocation and check for safe states</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <GlassCard>
              <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Processes</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => numProc > 1 && resize(numProc-1, numRes)} className="text-white/40 hover:text-neon-cyan"><HiMinus /></button>
                    <span className="text-lg font-bold text-neon-cyan">{numProc}</span>
                    <button onClick={() => resize(numProc+1, numRes)} className="text-white/40 hover:text-neon-cyan"><HiPlus /></button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Resources</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => numRes > 1 && resize(numProc, numRes-1)} className="text-white/40 hover:text-neon-cyan"><HiMinus /></button>
                    <span className="text-lg font-bold text-neon-purple">{numRes}</span>
                    <button onClick={() => resize(numProc, numRes+1)} className="text-white/40 hover:text-neon-cyan"><HiPlus /></button>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Allocation Matrix */}
            <GlassCard>
              <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-3">Allocation Matrix</h3>
              <div className="space-y-2">
                <div className="flex gap-2 pl-8">{Array.from({length: numRes}, (_, j) => <div key={j} className="w-12 text-center text-[10px] text-neon-purple">R{j}</div>)}</div>
                {allocation.map((row, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-neon-cyan w-6">P{i}</span>
                    {row.map((val, j) => (
                      <input key={j} type="number" value={val} onChange={e => updateMatrix(allocation, setAllocation, i, j, e.target.value)}
                        className="input-glow !w-12 !py-1 !px-2 text-center text-xs" min="0" />
                    ))}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Max Matrix */}
            <GlassCard>
              <h3 className="text-sm font-semibold text-neon-purple uppercase tracking-wider mb-3">Max Matrix</h3>
              <div className="space-y-2">
                {max.map((row, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-neon-cyan w-6">P{i}</span>
                    {row.map((val, j) => (
                      <input key={j} type="number" value={val} onChange={e => updateMatrix(max, setMax, i, j, e.target.value)}
                        className="input-glow !w-12 !py-1 !px-2 text-center text-xs" min="0" />
                    ))}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Available */}
            <GlassCard>
              <h3 className="text-sm font-semibold text-neon-green uppercase tracking-wider mb-3">Available Resources</h3>
              <div className="flex gap-2">
                {available.map((val, j) => (
                  <div key={j} className="text-center">
                    <div className="text-[10px] text-neon-purple mb-1">R{j}</div>
                    <input type="number" value={val} onChange={e => { const a = [...available]; a[j] = Math.max(0, parseInt(e.target.value) || 0); setAvailable(a); }}
                      className="input-glow !w-12 !py-1 !px-2 text-center text-xs" min="0" />
                  </div>
                ))}
              </div>
            </GlassCard>

            <NeonButton onClick={run} variant="fill" className="w-full flex items-center justify-center gap-2"><HiPlay /> Run Banker's Algorithm</NeonButton>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Resource Allocation Graph */}
            <GlassCard hover={false}>
              <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Resource Allocation Graph</h3>
              <svg viewBox="0 0 440 360" className="w-full max-h-[300px]">
                {/* Edges */}
                {allocation.map((row, i) => row.map((val, j) => val > 0 ? (
                  <line key={`a-${i}-${j}`} x1={resPositions[j]?.x} y1={resPositions[j]?.y} x2={procPositions[i]?.x} y2={procPositions[i]?.y}
                    stroke="#00ff88" strokeWidth="2" className="graph-edge" markerEnd="url(#arrowGreen)" />
                ) : null))}
                {result?.need.map((row, i) => row.map((val, j) => val > 0 ? (
                  <line key={`n-${i}-${j}`} x1={procPositions[i]?.x} y1={procPositions[i]?.y} x2={resPositions[j]?.x} y2={resPositions[j]?.y}
                    stroke={result.deadlockedProcesses.includes(i) ? '#ff3e8e' : '#00f5ff'} strokeWidth="2" className="graph-edge" markerEnd="url(#arrowCyan)" />
                ) : null))}
                {/* Process nodes */}
                {procPositions.map((p, i) => (
                  <g key={`p-${i}`}>
                    <circle cx={p.x} cy={p.y} r="28"
                      fill={result?.deadlockedProcesses.includes(i) ? 'rgba(255,62,142,0.2)' : 'rgba(0,245,255,0.1)'}
                      stroke={result?.deadlockedProcesses.includes(i) ? '#ff3e8e' : '#00f5ff'} strokeWidth="2" />
                    <text x={p.x} y={p.y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{p.label}</text>
                  </g>
                ))}
                {/* Resource nodes */}
                {resPositions.map((r, i) => (
                  <g key={`r-${i}`}>
                    <rect x={r.x-22} y={r.y-22} width="44" height="44" rx="8"
                      fill="rgba(168,85,247,0.1)" stroke="#a855f7" strokeWidth="2" />
                    <text x={r.x} y={r.y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{r.label}</text>
                  </g>
                ))}
                <defs>
                  <marker id="arrowGreen" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#00ff88" /></marker>
                  <marker id="arrowCyan" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#00f5ff" /></marker>
                </defs>
              </svg>
            </GlassCard>

            {/* Result */}
            {result && (
              <>
                <GlassCard hover={false} className={result.safe ? 'neon-border' : '!border-neon-pink/30'}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${result.safe ? 'bg-neon-green/10' : 'bg-neon-pink/10'}`}>
                      {result.safe ? '✅' : '🔴'}
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${result.safe ? 'text-neon-green' : 'text-neon-pink'}`}>
                        {result.safe ? 'System is in SAFE State' : 'DEADLOCK Detected!'}
                      </h3>
                      {result.safe && <p className="text-sm text-white/40">Safe sequence: {result.sequence.join(' → ')}</p>}
                    </div>
                  </div>
                </GlassCard>

                {/* Steps */}
                <GlassCard hover={false}>
                  <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Execution Steps</h3>
                  <div className="space-y-2">
                    {result.steps.map((step, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={i <= animStep ? { opacity: 1, x: 0 } : { opacity: 0.2 }}
                        className={`p-3 rounded-xl text-sm border ${step.canRun ? 'bg-neon-green/5 border-neon-green/20 text-neon-green' : 'bg-neon-pink/5 border-neon-pink/20 text-neon-pink'}`}>
                        <span className="font-bold">{step.process}</span>: {step.message}
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>

                {/* Need Matrix */}
                <GlassCard hover={false}>
                  <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-3">Need Matrix (Max - Allocation)</h3>
                  <table className="osnova-table">
                    <thead><tr><th>Process</th>{Array.from({length: numRes}, (_, j) => <th key={j}>R{j}</th>)}</tr></thead>
                    <tbody>
                      {result.need.map((row, i) => (
                        <tr key={i}><td className="font-bold text-neon-cyan">P{i}</td>{row.map((v, j) => <td key={j}>{v}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </GlassCard>
              </>
            )}

            {!result && (
              <GlassCard hover={false} className="text-center py-20">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-white mb-2">Deadlock Analyzer Ready</h3>
                <p className="text-white/30 text-sm">Configure matrices and run Banker's Algorithm</p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
