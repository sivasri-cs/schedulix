// ========== DISK SCHEDULING ALGORITHMS ==========

export function diskFCFS(requests, head) {
  const order = [...requests];
  const movements = [head, ...order];
  let totalSeek = 0;
  for (let i = 1; i < movements.length; i++) totalSeek += Math.abs(movements[i] - movements[i - 1]);
  return { order, movements, totalSeek, algorithmName: 'FCFS' };
}

export function diskSSTF(requests, head) {
  const remaining = [...requests];
  const order = [];
  const movements = [head];
  let current = head, totalSeek = 0;
  while (remaining.length > 0) {
    let minDist = Infinity, minIdx = 0;
    for (let i = 0; i < remaining.length; i++) {
      const dist = Math.abs(remaining[i] - current);
      if (dist < minDist) { minDist = dist; minIdx = i; }
    }
    current = remaining[minIdx];
    totalSeek += minDist;
    order.push(current);
    movements.push(current);
    remaining.splice(minIdx, 1);
  }
  return { order, movements, totalSeek, algorithmName: 'SSTF' };
}

export function diskSCAN(requests, head, maxCylinder = 199, direction = 'right') {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter(r => r < head);
  const right = sorted.filter(r => r >= head);
  let order = [], movements = [head], totalSeek = 0, current = head;
  if (direction === 'right') {
    order = [...right, maxCylinder, ...left.reverse()];
  } else {
    order = [...left.reverse(), 0, ...right];
  }
  for (const pos of order) { totalSeek += Math.abs(pos - current); current = pos; movements.push(pos); }
  return { order, movements, totalSeek, algorithmName: 'SCAN' };
}

export function diskCSCAN(requests, head, maxCylinder = 199) {
  const sorted = [...requests].sort((a, b) => a - b);
  const right = sorted.filter(r => r >= head);
  const left = sorted.filter(r => r < head);
  const order = [...right, maxCylinder, 0, ...left];
  let movements = [head], totalSeek = 0, current = head;
  for (const pos of order) { totalSeek += Math.abs(pos - current); current = pos; movements.push(pos); }
  return { order, movements, totalSeek, algorithmName: 'C-SCAN' };
}

export function diskLOOK(requests, head, direction = 'right') {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter(r => r < head);
  const right = sorted.filter(r => r >= head);
  let order = direction === 'right' ? [...right, ...left.reverse()] : [...left.reverse(), ...right];
  let movements = [head], totalSeek = 0, current = head;
  for (const pos of order) { totalSeek += Math.abs(pos - current); current = pos; movements.push(pos); }
  return { order, movements, totalSeek, algorithmName: 'LOOK' };
}

export function compareAllDisk(requests, head, maxCylinder = 199) {
  return [
    diskFCFS(requests, head),
    diskSSTF(requests, head),
    diskSCAN(requests, head, maxCylinder),
    diskCSCAN(requests, head, maxCylinder),
    diskLOOK(requests, head),
  ];
}
