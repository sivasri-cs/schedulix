// ========== PROCESS SCHEDULING ALGORITHMS ==========

const COLORS = [
  '#00f5ff', '#a855f7', '#ff00ff', '#00ff88', '#ff6b35',
  '#ff3e8e', '#3b82f6', '#eab308', '#14b8a6', '#f97316'
];

/**
 * FCFS - First Come First Served
 */
export function fcfs(processes) {
  const procs = processes.map((p, i) => ({ ...p, color: COLORS[i % COLORS.length], id: p.id || `P${i + 1}` }));
  procs.sort((a, b) => a.arrivalTime - b.arrivalTime);

  const gantt = [];
  const results = [];
  let currentTime = 0;

  for (const proc of procs) {
    if (currentTime < proc.arrivalTime) {
      gantt.push({ id: 'idle', name: 'Idle', start: currentTime, end: proc.arrivalTime, color: '#333' });
      currentTime = proc.arrivalTime;
    }
    const start = currentTime;
    const end = start + proc.burstTime;
    gantt.push({ id: proc.id, name: proc.id, start, end, color: proc.color });

    const turnaroundTime = end - proc.arrivalTime;
    const waitingTime = turnaroundTime - proc.burstTime;

    results.push({
      ...proc,
      startTime: start,
      completionTime: end,
      turnaroundTime,
      waitingTime,
    });
    currentTime = end;
  }

  const totalTime = currentTime;
  const busyTime = results.reduce((sum, r) => sum + r.burstTime, 0);
  const cpuUtilization = totalTime > 0 ? ((busyTime / totalTime) * 100).toFixed(1) : 0;
  const avgWaiting = results.length > 0 ? (results.reduce((s, r) => s + r.waitingTime, 0) / results.length).toFixed(2) : 0;
  const avgTurnaround = results.length > 0 ? (results.reduce((s, r) => s + r.turnaroundTime, 0) / results.length).toFixed(2) : 0;

  return { gantt, results, cpuUtilization, avgWaiting, avgTurnaround, algorithmName: 'FCFS' };
}

/**
 * SJF - Shortest Job First (Non-preemptive)
 */
export function sjf(processes) {
  const procs = processes.map((p, i) => ({ ...p, color: COLORS[i % COLORS.length], id: p.id || `P${i + 1}` }));
  const n = procs.length;
  const completed = new Array(n).fill(false);
  const gantt = [];
  const results = [];
  let currentTime = 0;
  let done = 0;

  while (done < n) {
    const available = procs
      .map((p, i) => ({ ...p, idx: i }))
      .filter((p, i) => !completed[i] && p.arrivalTime <= currentTime);

    if (available.length === 0) {
      const nextArrival = Math.min(...procs.filter((_, i) => !completed[i]).map(p => p.arrivalTime));
      gantt.push({ id: 'idle', name: 'Idle', start: currentTime, end: nextArrival, color: '#333' });
      currentTime = nextArrival;
      continue;
    }

    available.sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime);
    const proc = available[0];
    const start = currentTime;
    const end = start + proc.burstTime;

    gantt.push({ id: proc.id, name: proc.id, start, end, color: proc.color });

    const turnaroundTime = end - proc.arrivalTime;
    const waitingTime = turnaroundTime - proc.burstTime;

    results.push({ ...proc, startTime: start, completionTime: end, turnaroundTime, waitingTime });
    completed[proc.idx] = true;
    currentTime = end;
    done++;
  }

  const totalTime = currentTime;
  const busyTime = results.reduce((sum, r) => sum + r.burstTime, 0);
  const cpuUtilization = totalTime > 0 ? ((busyTime / totalTime) * 100).toFixed(1) : 0;
  const avgWaiting = results.length > 0 ? (results.reduce((s, r) => s + r.waitingTime, 0) / results.length).toFixed(2) : 0;
  const avgTurnaround = results.length > 0 ? (results.reduce((s, r) => s + r.turnaroundTime, 0) / results.length).toFixed(2) : 0;

  return { gantt, results, cpuUtilization, avgWaiting, avgTurnaround, algorithmName: 'SJF' };
}

/**
 * Round Robin
 */
export function roundRobin(processes, quantum = 2) {
  const procs = processes.map((p, i) => ({
    ...p,
    color: COLORS[i % COLORS.length],
    id: p.id || `P${i + 1}`,
    remainingTime: p.burstTime,
  }));
  procs.sort((a, b) => a.arrivalTime - b.arrivalTime);

  const gantt = [];
  const queue = [];
  const resultMap = {};
  let currentTime = 0;
  let idx = 0;

  // Add first arriving processes
  while (idx < procs.length && procs[idx].arrivalTime <= currentTime) {
    queue.push({ ...procs[idx] });
    idx++;
  }

  while (queue.length > 0 || idx < procs.length) {
    if (queue.length === 0 && idx < procs.length) {
      const nextTime = procs[idx].arrivalTime;
      gantt.push({ id: 'idle', name: 'Idle', start: currentTime, end: nextTime, color: '#333' });
      currentTime = nextTime;
      while (idx < procs.length && procs[idx].arrivalTime <= currentTime) {
        queue.push({ ...procs[idx] });
        idx++;
      }
      continue;
    }

    const proc = queue.shift();
    const execTime = Math.min(proc.remainingTime, quantum);
    const start = currentTime;
    const end = start + execTime;

    gantt.push({ id: proc.id, name: proc.id, start, end, color: proc.color });
    proc.remainingTime -= execTime;
    currentTime = end;

    // Add newly arrived processes before re-adding current
    while (idx < procs.length && procs[idx].arrivalTime <= currentTime) {
      queue.push({ ...procs[idx] });
      idx++;
    }

    if (proc.remainingTime > 0) {
      queue.push(proc);
    } else {
      const turnaroundTime = end - proc.arrivalTime;
      const waitingTime = turnaroundTime - proc.burstTime;
      resultMap[proc.id] = {
        ...proc,
        completionTime: end,
        turnaroundTime,
        waitingTime,
      };
    }
  }

  const results = procs.map(p => resultMap[p.id]).filter(Boolean);
  const totalTime = currentTime;
  const busyTime = results.reduce((sum, r) => sum + r.burstTime, 0);
  const cpuUtilization = totalTime > 0 ? ((busyTime / totalTime) * 100).toFixed(1) : 0;
  const avgWaiting = results.length > 0 ? (results.reduce((s, r) => s + r.waitingTime, 0) / results.length).toFixed(2) : 0;
  const avgTurnaround = results.length > 0 ? (results.reduce((s, r) => s + r.turnaroundTime, 0) / results.length).toFixed(2) : 0;

  return { gantt, results, cpuUtilization, avgWaiting, avgTurnaround, algorithmName: 'Round Robin' };
}

/**
 * Priority Scheduling (Non-preemptive, lower number = higher priority)
 */
export function priorityScheduling(processes) {
  const procs = processes.map((p, i) => ({
    ...p,
    color: COLORS[i % COLORS.length],
    id: p.id || `P${i + 1}`,
    priority: p.priority ?? 0,
  }));
  const n = procs.length;
  const completed = new Array(n).fill(false);
  const gantt = [];
  const results = [];
  let currentTime = 0;
  let done = 0;

  while (done < n) {
    const available = procs
      .map((p, i) => ({ ...p, idx: i }))
      .filter((_, i) => !completed[i] && procs[i].arrivalTime <= currentTime);

    if (available.length === 0) {
      const nextArrival = Math.min(...procs.filter((_, i) => !completed[i]).map(p => p.arrivalTime));
      gantt.push({ id: 'idle', name: 'Idle', start: currentTime, end: nextArrival, color: '#333' });
      currentTime = nextArrival;
      continue;
    }

    available.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);
    const proc = available[0];
    const start = currentTime;
    const end = start + proc.burstTime;

    gantt.push({ id: proc.id, name: proc.id, start, end, color: proc.color });

    const turnaroundTime = end - proc.arrivalTime;
    const waitingTime = turnaroundTime - proc.burstTime;

    results.push({ ...proc, startTime: start, completionTime: end, turnaroundTime, waitingTime });
    completed[proc.idx] = true;
    currentTime = end;
    done++;
  }

  const totalTime = currentTime;
  const busyTime = results.reduce((sum, r) => sum + r.burstTime, 0);
  const cpuUtilization = totalTime > 0 ? ((busyTime / totalTime) * 100).toFixed(1) : 0;
  const avgWaiting = results.length > 0 ? (results.reduce((s, r) => s + r.waitingTime, 0) / results.length).toFixed(2) : 0;
  const avgTurnaround = results.length > 0 ? (results.reduce((s, r) => s + r.turnaroundTime, 0) / results.length).toFixed(2) : 0;

  return { gantt, results, cpuUtilization, avgWaiting, avgTurnaround, algorithmName: 'Priority' };
}

/**
 * Run all algorithms for comparison
 */
export function compareAll(processes, quantum = 2) {
  return [
    fcfs(processes),
    sjf(processes),
    roundRobin(processes, quantum),
    priorityScheduling(processes),
  ];
}
