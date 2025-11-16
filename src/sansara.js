import { parseGraph } from './utils.js';

async function sansara(dharma, karma, exitHandler = 'buddha', options = {}) {
  const { allNodes, deps } = parseGraph(dharma);

  const logConfig = {
    enabled: options.log !== false,
    showTiming: options.showTiming !== false,
    showResults: options.showResults !== false,
    useColors: options.useColors !== false,
  };

  const startTime = Date.now();
  let executionOrder = 0;

  const colors = {
    start: 'color: #2196F3; font-weight: bold',
    complete: 'color: #4CAF50; font-weight: bold',
    stopped: 'color: #FF9800; font-weight: bold',
    error: 'color: #F44336; font-weight: bold',
    info: 'color: #9E9E9E',
    result: 'color: #673AB7',
  };

  function log(message, style = '', indent = 0) {
    if (!logConfig.enabled) return;
    const prefix = '  '.repeat(indent);
    if (logConfig.useColors && style) {
      console.log(`%c${prefix}${message}`, style);
    } else {
      console.log(`${prefix}${message}`);
    }
  }

  const results = {};
  const completions = {};
  const indentMap = {};

  // Инициализация корневых узлов
  for (const node of allNodes) {
    indentMap[node] = 0;
    if (deps[node].length === 0) {
      completions[node] = Promise.resolve();
    }
  }

  console.log('═══════════════════════════════════════');
  log('🚀 Starting execution graph (async)', colors.start, 0);
  console.log('───────────────────────────────────────');

  const promises = [];
  for (const node of allNodes) {
    const p = (async () => {
      // Ждём всех родителей
      const parentPromises = deps[node].map(p => completions[p]);
      await Promise.all(parentPromises);

      const order = ++executionOrder;
      const indent = deps[node].length === 0 ? 0 : Math.max(...deps[node].map(p => indentMap[p] || 0), 0) + 1;
      indentMap[node] = indent;
      const nodeStartTime = Date.now();

      log(`▶ #${order} START: ${node} [+${Date.now() - startTime}ms]`, colors.start, indent);

      if (!karma[node]) {
        throw new Error(`Function ${node} not found in karma`);
      }

      try {
        // Передаём данные по именам родителей
        const inputMap = {};
        for (const parent of deps[node]) {
          inputMap[parent] = results[parent];
        }

        // Единая обработка sync/async
        const result = await Promise.resolve(karma[node](inputMap));

        results[node] = result;

        if (!result?.info || result.info.trim() === '') {
          log(`⏹ STOPPED: ${node} (empty info)`, colors.stopped, indent);
        } else {
          const duration = Date.now() - nodeStartTime;
          const resultInfo = logConfig.showResults ? ` → info: "${result.info}"` : '';
          log(`✓ COMPLETE: ${node} (${duration}ms)${resultInfo}`, colors.complete, indent);
        }

        return result;
      } catch (error) {
        log(`✗ ERROR in ${node}: ${error.message}`, colors.error, indent);
        throw error;
      }
    })();
    completions[node] = p;
    promises.push(p);
  }

  await Promise.all(promises);

  console.log('───────────────────────────────────────');

  const allInfo = Object.values(results)
    .map(r => r?.info)
    .filter(info => info && info.trim() !== '')
    .join('');

  if (allInfo === '') {
    log('⏹ Execution stopped (no valid info)', colors.stopped, 0);
    console.log('═══════════════════════════════════════\n');
    return { state: 'stopped', info: 'Execution stopped' };
  }

  log(`🏁 Calling exit handler: ${exitHandler}`, colors.info, 0);
  let finalResult = { state: 'unknown', info: allInfo };

  if (karma[exitHandler]) {
    finalResult = await Promise.resolve(karma[exitHandler](allInfo));
    if (logConfig.showResults) {
      log(`Exit result: ${JSON.stringify(finalResult)}`, colors.result, 0);
    }
  }

  const totalTime = Date.now() - startTime;
  if (logConfig.showTiming) {
    log(`Total execution time: ${totalTime}ms`, colors.info, 0);
    log(`Total nodes executed: ${executionOrder}`, colors.info, 0);
  }

  console.log('═══════════════════════════════════════\n');
  return finalResult;
}

export { sansara };
