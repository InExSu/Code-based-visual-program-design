/**
 * Когда созданы dharma и karma,
 * запустить колесо сансары
 */

import { dharma }  from './dharma_Example.js'
import { karma }   from './karma_Example.js '
import { sansara } from './sansara.js'

console.clear()

sansara(dharma, karma)
  .then(result => {
    console.log('Результат выполнения:', 
      result)
  })
