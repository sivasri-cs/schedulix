// ========== MEMORY MANAGEMENT ALGORITHMS ==========

/**
 * FIFO Page Replacement
 */
export function fifoPageReplacement(pageString, frameCount) {
  const pages = pageString.map(Number);
  const frames = [];
  const steps = [];
  let faults = 0;
  let hits = 0;
  let pointer = 0; // FIFO pointer

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const isHit = frames.includes(page);

    if (isHit) {
      hits++;
      steps.push({
        page,
        frames: [...frames],
        fault: false,
        replaced: null,
        action: `Page ${page} found in frame (HIT)`,
      });
    } else {
      faults++;
      let replaced = null;
      if (frames.length < frameCount) {
        frames.push(page);
      } else {
        replaced = frames[pointer];
        frames[pointer] = page;
        pointer = (pointer + 1) % frameCount;
      }
      steps.push({
        page,
        frames: [...frames],
        fault: true,
        replaced,
        action: replaced !== null
          ? `Page ${page} replaced page ${replaced} (FAULT)`
          : `Page ${page} loaded into empty frame (FAULT)`,
      });
    }
  }

  return {
    steps,
    totalFaults: faults,
    totalHits: hits,
    hitRatio: pages.length > 0 ? ((hits / pages.length) * 100).toFixed(1) : 0,
    faultRatio: pages.length > 0 ? ((faults / pages.length) * 100).toFixed(1) : 0,
    algorithmName: 'FIFO',
  };
}

/**
 * LRU Page Replacement
 */
export function lruPageReplacement(pageString, frameCount) {
  const pages = pageString.map(Number);
  const frames = [];
  const usageOrder = []; // Track usage order
  const steps = [];
  let faults = 0;
  let hits = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const frameIdx = frames.indexOf(page);
    const isHit = frameIdx !== -1;

    if (isHit) {
      hits++;
      // Update usage order
      const uIdx = usageOrder.indexOf(page);
      if (uIdx !== -1) usageOrder.splice(uIdx, 1);
      usageOrder.push(page);

      steps.push({
        page,
        frames: [...frames],
        fault: false,
        replaced: null,
        action: `Page ${page} found in frame (HIT)`,
      });
    } else {
      faults++;
      let replaced = null;

      if (frames.length < frameCount) {
        frames.push(page);
      } else {
        // Find LRU page
        const lruPage = usageOrder.shift();
        replaced = lruPage;
        const replaceIdx = frames.indexOf(lruPage);
        frames[replaceIdx] = page;
      }
      usageOrder.push(page);

      steps.push({
        page,
        frames: [...frames],
        fault: true,
        replaced,
        action: replaced !== null
          ? `Page ${page} replaced LRU page ${replaced} (FAULT)`
          : `Page ${page} loaded into empty frame (FAULT)`,
      });
    }
  }

  return {
    steps,
    totalFaults: faults,
    totalHits: hits,
    hitRatio: pages.length > 0 ? ((hits / pages.length) * 100).toFixed(1) : 0,
    faultRatio: pages.length > 0 ? ((faults / pages.length) * 100).toFixed(1) : 0,
    algorithmName: 'LRU',
  };
}

/**
 * Optimal Page Replacement
 */
export function optimalPageReplacement(pageString, frameCount) {
  const pages = pageString.map(Number);
  const frames = [];
  const steps = [];
  let faults = 0;
  let hits = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const isHit = frames.includes(page);

    if (isHit) {
      hits++;
      steps.push({
        page,
        frames: [...frames],
        fault: false,
        replaced: null,
        action: `Page ${page} found in frame (HIT)`,
      });
    } else {
      faults++;
      let replaced = null;

      if (frames.length < frameCount) {
        frames.push(page);
      } else {
        // Find the page that won't be used for the longest time
        let farthest = -1;
        let replaceIdx = 0;

        for (let j = 0; j < frames.length; j++) {
          const nextUse = pages.indexOf(frames[j], i + 1);
          if (nextUse === -1) {
            replaceIdx = j;
            break;
          }
          if (nextUse > farthest) {
            farthest = nextUse;
            replaceIdx = j;
          }
        }

        replaced = frames[replaceIdx];
        frames[replaceIdx] = page;
      }

      steps.push({
        page,
        frames: [...frames],
        fault: true,
        replaced,
        action: replaced !== null
          ? `Page ${page} replaced page ${replaced} (FAULT - Optimal)`
          : `Page ${page} loaded into empty frame (FAULT)`,
      });
    }
  }

  return {
    steps,
    totalFaults: faults,
    totalHits: hits,
    hitRatio: pages.length > 0 ? ((hits / pages.length) * 100).toFixed(1) : 0,
    faultRatio: pages.length > 0 ? ((faults / pages.length) * 100).toFixed(1) : 0,
    algorithmName: 'Optimal',
  };
}

/**
 * Compare all memory algorithms
 */
export function compareMemoryAlgorithms(pageString, frameCount) {
  return [
    fifoPageReplacement(pageString, frameCount),
    lruPageReplacement(pageString, frameCount),
    optimalPageReplacement(pageString, frameCount),
  ];
}
