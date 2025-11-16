import { parseGraph } from './utils.js';

const State = {
  INIT: 'init',
  WAIT_PARENTS: 'wait_parents',
  RUNNING: 'running',
  COMPLETE: 'complete',
  ERROR: 'error'
};

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

  // Состояния выполнения узлов
  const nodeStates = new Map();
  const results = new Map();
  const indentMap = new Map();

  // Инициализация
  allNodes.forEach(node => {
    nodeStates.set(node, State.INIT);
    indentMap.set(node, 0);
  });

  // Хранение промисов выполнения для каждого узла
  const completions = new Map();

  function runNode(node) {
    return new Promise(async (resolve, reject) => {

      let state = nodeStates.get(node);

      while (state !== State.COMPLETE && state !== State.ERROR) {
        switch (state) {
          case State.INIT: {
            // Ставим ожидание данных родителей
            state = State.WAIT_PARENTS;
            nodeStates.set(node, state);
            break;
          }
          case State.WAIT_PARENTS: {
            try {
              const parentPromises = deps[node].map(p => completions.get(p));
              await Promise.all(parentPromises);
              state = State.RUNNING;
              nodeStates.set(node, state);
            } catch (error) {
              state = State.ERROR;
              nodeStates.set(node, state);
              reject(error);
              return;
            }
            break;
          }
          case State.RUNNING: {
            const order = ++executionOrder;
            const indent = deps[node].length === 0 ? 0 : Math.max(...deps[node].map(p => indentMap.get(p) || 0), 0) + 1;
            indentMap.set(node, indent);

            log(`▶ #${order} START: ${node} [+${Date.now() - startTime}ms]`, colors.start, indent);

            if (!karma[node]) {
              const errMsg = `Function ${node} not found in karma`;
              log(`✗ ERROR in ${node}: ${errMsg}`, colors.error, indent);
              state = State.ERROR;
              nodeStates.set(node, state);
              reject(new Error(errMsg));
              return;
            }

            try {
              const inputMap = {};
              for (const parent of deps[node]) {
                inputMap[parent] = results.get(parent);
              }
              const result = await Promise.resolve(karma[node](inputMap));
              results.set(node, result);

              if (!result?.info || result.info.trim() === '') {
                log(`⏹ STOPPED: ${node} (empty info)`, colors.stopped, indent);
              } else {
                const duration = Date.now() - startTime;
                const resultInfo = logConfig.showResults ? ` → info: "${result.info}"` : '';
                log(`✓ COMPLETE: ${node} (${duration}ms)${resultInfo}`, colors.complete, indent);
              }

              state = State.COMPLETE;
              nodeStates.set(node, state);
              resolve(result);
            } catch (error) {
              log(`✗ ERROR in ${node}: ${error.message}`, colors.error, indent);
              state = State.ERROR;
              nodeStates.set(node, state);
              reject(error);
            }
            break;
          }
          default:
            reject(new Error(`Unexpected state ${state} for node ${node}`));
            return;
        }
      }
    });
  }

  // Запускаем выполнение всех узлов и сохраняем их промисы
  allNodes.forEach(node => {
    completions.set(node, runNode(node));
  });

  try {
    await Promise.all(completions.values());
  } catch (err) {
    log(`✗ Execution halted: ${err.message}`, colors.error);
  }

  const allInfo = [...results.values()]
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
