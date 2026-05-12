// ========== DEADLOCK DETECTION & BANKER'S ALGORITHM ==========

export function bankersAlgorithm(allocation, max, available) {
  const n = allocation.length;
  const m = available.length;
  const need = allocation.map((alloc, i) => alloc.map((val, j) => max[i][j] - val));
  const work = [...available];
  const finish = new Array(n).fill(false);
  const sequence = [];
  const steps = [];
  let found = true;
  while (found) {
    found = false;
    for (let i = 0; i < n; i++) {
      if (!finish[i]) {
        const canAllocate = need[i].every((val, j) => val <= work[j]);
        if (canAllocate) {
          const prevWork = [...work];
          for (let j = 0; j < m; j++) work[j] += allocation[i][j];
          finish[i] = true;
          sequence.push(i);
          found = true;
          steps.push({ process: `P${i}`, processIndex: i, need: [...need[i]], workBefore: prevWork, workAfter: [...work], allocation: [...allocation[i]], canRun: true, message: `P${i} can run: Need [${need[i]}] <= Work [${prevWork}]. After: [${work}]` });
        }
      }
    }
  }
  const safe = finish.every(f => f);
  if (!safe) {
    const deadlocked = finish.map((f, i) => (!f ? `P${i}` : null)).filter(Boolean);
    steps.push({ process: 'DEADLOCK', processIndex: -1, canRun: false, message: `UNSAFE state. Deadlocked: ${deadlocked.join(', ')}` });
  }
  return { safe, sequence: sequence.map(i => `P${i}`), sequenceIndices: sequence, steps, need, deadlockedProcesses: finish.map((f, i) => (!f ? i : -1)).filter(i => i !== -1) };
}

export function detectDeadlock(allocation, request, available) {
  const n = allocation.length;
  const work = [...available];
  const finish = new Array(n).fill(false);
  for (let i = 0; i < n; i++) if (allocation[i].every(v => v === 0)) finish[i] = true;
  let found = true;
  while (found) {
    found = false;
    for (let i = 0; i < n; i++) {
      if (!finish[i] && request[i].every((val, j) => val <= work[j])) {
        for (let j = 0; j < work.length; j++) work[j] += allocation[i][j];
        finish[i] = true;
        found = true;
      }
    }
  }
  const deadlocked = finish.map((f, i) => (!f ? i : -1)).filter(i => i !== -1);
  return { isDeadlocked: deadlocked.length > 0, deadlockedProcesses: deadlocked.map(i => `P${i}`), deadlockedIndices: deadlocked, safeProcesses: finish.map((f, i) => (f ? `P${i}` : null)).filter(Boolean) };
}

export function generateRAG(allocation, request, numResources) {
  const edges = [];
  for (let i = 0; i < allocation.length; i++) {
    for (let j = 0; j < numResources; j++) {
      if (allocation[i][j] > 0) edges.push({ from: `R${j}`, to: `P${i}`, type: 'allocation', count: allocation[i][j] });
      if (request[i][j] > 0) edges.push({ from: `P${i}`, to: `R${j}`, type: 'request', count: request[i][j] });
    }
  }
  return edges;
}
