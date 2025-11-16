import { sansara } from './sansara.js';
import { dharma_4 } from './dharma.js';
import { karma } from './karma.js';

console.clear();
console.log('=== TEST 4: dharma_4 ===');

sansara(dharma_4, karma).then(result => {
  console.log('Результат выполнения:', result);
});
