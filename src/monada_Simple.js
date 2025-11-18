/**
 * A monadic chain for a single-threaded program
 * @param {*} steps 
 * @param {*} initialData 
 * @returns 
 */
function monada_Chain(steps, initialData) {
  let data = initialData

  for (const { fn, arg } of steps) {
    try {
      data = fn(data, arg)
      // Можно создавать декораторы
      console.log(`[${fn.name}] ✓`, JSON.stringify(data))
    } catch (e) {
      console.log(`[${fn.name}] ✗ Ошибка:`, e.message)
      return { success: false, error: e.message }
    }
  }

  return { success: true, data }
}

// Пример функций
// const f1 = (data, arg) => ({ ...data, f1: arg })
// const f2 = (data, arg) => ({ ...data, f2: arg })
// const f3 = (data, arg) => ({ ...data, f3: arg })

const f1 = (data, arg) => {

  // Добавим поле с длиной строки аргумента
  const length = typeof arg === 'string' ? arg.length : 0

  return {
    ...data,
    f1: arg,
    f1Length: length,  // дополнительное поле для демонстрации
  }
}

const f2 = (data, arg) => {

  // Добавим поле с аргументом в верхнем регистре
  const upper = typeof arg === 'string' ? arg.toUpperCase() : arg

  return {
    ...data,
    f2: arg,
    f2Upper: upper,  // дополнительное поле для демонстрации
  }
}

const f3 = (data, arg) => {
  return { ...data, f3: arg }
}

// A monadic chain example for a single-threaded program
const result = monada_Chain(
  [
    { fn: f1, arg: 'x' },
    { fn: f2, arg: 'y' },
    { fn: f3, arg: 'z' },
  ],
  {},
)

console.clear()
console.log('Final countdown:', result)
