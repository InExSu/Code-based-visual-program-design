/**
 * ████████╗██╗███╗   ███╗███████╗    ███████╗██╗██████╗ ███████╗██████╗ 
 * ╚══██╔══╝██║████╗ ████║██╔════╝    ██╔════╝██║██╔══██╗██╔════╝██╔══██╗
 *    ██║   ██║██╔████╔██║█████╗      █████╗  ██║██████╔╝█████╗  ██████╔╝
 *    ██║   ██║██║╚██╔╝██║██╔══╝      ██╔══╝  ██║██╔══██╗██╔══╝  ██╔══██╗
 *    ██║   ██║██║ ╚═╝ ██║███████╗    ██║     ██║██║  ██║███████╗██║  ██║
 *    ╚═╝   ╚═╝╚═╝     ╚═╝╚══════╝    ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
 * 
 * ХАРДКОРНАЯ ФУНКЦИОНАЛЬЩИНА С КРУТЫМИ КОМБИНАТОРАМИ
 */

/**
 * 🎯 КОНСТРУКТОРЫ ТИПА EITHER
 */
const right = value => ({
  chain: fn => fn(value),
  map: fn => right(fn(value)),
  fold: (_, onRight) => onRight(value),
  catch: () => right(value),
  thru: fn => fn(right(value)),
  isRight: true,
  isLeft: false,
})

const left = error => ({
  chain: () => left(error),
  map: () => left(error),
  // eslint-disable-next-line no-unused-vars
  fold: (onLeft, _) => onLeft(error),
  catch: recoveryFn => recoveryFn(error),
  thru: fn => fn(left(error)),
  isRight: false,
  isLeft: true,
})

/**
 * 🎭 МЕГА КОМБИНАТОРЫ ДЛЯ МАГИИ
 */

// 📝 Базовый шаг с логированием и обработкой ошибок
const createStep = (name, fieldName, transform = x => x) => (data, arg) => {
  console.log(`🎬 [${name}] Вход:`, data, 'Аргумент:', arg)

  try {
    const result = {
      ...data,
      [fieldName]: arg,
      [`${fieldName}Processed`]: transform(arg),
    }
    console.log(`✅ [${name}] Успех:`, JSON.stringify(result))
    return right(result)
  } catch (error) {
    console.log(`💥 [${name}] Ошибка:`, error.message)
    return left(`💀 ${name} упала: ${error.message}`)
  }
}

// 🎉 КОМБИНАТОР ФИНАЛЬНОГО УСПЕХА
const withFinalSuccess = (message = '🎉 ВСЁ РАБОТАЕТ!') => either =>
  either.map(data => ({
    ...data,
    finalTouch: message,
    processedAt: new Date().toISOString(),
  }))

// 🛡️ КОМБИНАТОР ВОССТАНОВЛЕНИЯ ПОСЛЕ ОШИБОК  
const withErrorRecovery = (recoveryMessage = '💪 ВОССТАНОВИЛИСЬ!') => either =>
  either.catch(error => right({
    recovered: true,
    originalError: error,
    message: recoveryMessage,
    recoveredAt: Date.now(),
  }))

// ⚡ СУПЕР-КОМБИНАТОР: УСПЕХ + ВОССТАНОВЛЕНИЕ
const withPipelineMagic = (successMsg = '🎉 ВСЁ РАБОТАЕТ!', recoveryMsg = '💪 ВОССТАНОВИЛИСЬ!') => either =>
  either
    .map(data => ({
      ...data,
      finalTouch: successMsg,
      processedAt: new Date().toISOString(),
    }))
    .catch(error => right({
      recovered: true,
      originalError: error,
      message: recoveryMsg,
      recoveredAt: Date.now(),
    }))

/**
 * 🚀 СОЗДАЕМ БИЗНЕС-ФУНКЦИИ ОДНОЙ СТРОКОЙ КАЖДАЯ
 */

// 📏 F1 - добавляет длину строки
const f1 = createStep('f1', 'f1', arg => typeof arg === 'string' ? arg.length : 0)

// 🔠 F2 - преобразует в верхний регистр  
const f2 = createStep('f2', 'f2', arg => typeof arg === 'string' ? arg.toUpperCase() : arg)

// 🎯 F3 - просто добавляет поле
const f3 = createStep('f3', 'f3')

// 🔢 F4 - умножает число на 2
const f4 = createStep('f4', 'f4', arg => typeof arg === 'number' ? arg * 2 : 'not a number')

// 🏷️ F5 - добавляет префикс
const f5 = createStep('f5', 'f5', arg => `PREFIX_${arg}`)

/**
 * ⛓️ ЧИСТЫЙ ПАЙПЛАЙН ВЕРХНЕГО УРОВНЯ - БЕЗ ШУМА!
 */
console.clear()
console.log('🌈 === ЗАПУСК ХАРДКОРНОГО ПАЙПЛАЙНА ===')

// 🎛️ ВОТ ОН - ЧИСТЫЙ ПАЙПЛАЙН!
const result = right({ timestamp: Date.now() })
  .chain(data => f1(data, 'functional'))
  .chain(data => f2(data, 'programming'))
  .chain(data => f3(data, 'rules'))
  .chain(data => f4(data, 42))
  .chain(data => f5(data, 'awesome'))
  // 🎉 ВСЯ МАГИЯ СПРЯТАНА В КОМБИНАТОРАХ!
  .thru(withPipelineMagic('🎉 ВСЁ РАБОТАЕТ!', '💪 ВОССТАНОВИЛИСЬ ПОСЛЕ ПАДЕНИЯ!'))

/**
 * 📊 ФИНАЛЬНАЯ ОБРАБОТКА РЕЗУЛЬТАТА
 */
console.log('\n🎯 === ФИНАЛЬНЫЙ РЕЗУЛЬТАТ ===')

result.fold(
  error => {
    console.log('💀 КРИТИЧЕСКАЯ ОШИБКА:', error)
    console.log('❌ ПРОГРАММА ЗАВЕРШИЛАСЬ С ОШИБКОЙ')
  },
  data => {
    console.log('🎉 УСПЕШНО ВЫПОЛНЕНО!')
    console.log('📊 ФИНАЛЬНЫЕ ДАННЫЕ:', data)
  },
)

/**
 * ⚡ ДЕМО РАЗНЫХ ВАРИАНТОВ КОМБИНАТОРОВ
 */
console.log('\n🔥 === ДЕМО: РАЗНЫЕ ВИДЫ МАГИИ ===')

// 🎭 Вариант 1: Только финальный успех
const successOnly = right({ demo: 'success' })
  .chain(data => f1(data, 'hello'))
  .chain(data => f2(data, 'world'))
  .thru(withFinalSuccess('✨ ТОЛЬКО УСПЕХ!'))

// 🎭 Вариант 2: Только восстановление  
const recoveryOnly = right({ demo: 'recovery' })
  .chain(data => f1(data, 'test'))
  .chain(data => f2(data, null)) // 💥 Упадет здесь
  .thru(withErrorRecovery('🛡️ ТОЛЬКО ВОССТАНОВЛЕНИЕ!'))

// 🎭 Вариант 3: Полная магия
const fullMagic = right({ demo: 'magic' })
  .chain(data => f1(data, 'magic'))
  .chain(data => f2(data, 'power'))
  .thru(withPipelineMagic('🔮 ПОЛНАЯ МАГИЯ!', '✨ МАГИЧЕСКОЕ ВОССТАНОВЛЕНИЕ!'))

console.log('\n📋 Результаты демо:')
console.log('1. Только успех:')
successOnly.fold(
  error => console.log('   ❌ Ошибка:', error),
  data => console.log('   ✅ Успех:', data.finalTouch),
)

console.log('2. Только восстановление:')
recoveryOnly.fold(
  error => console.log('   ❌ Не восстановились:', error),
  data => console.log('   ✅ Восстановились:', data.message),
)

console.log('3. Полная магия:')
fullMagic.fold(
  error => console.log('   ❌ Ошибка магии:', error),
  data => console.log('   ✅ Магия удалась:', data.finalTouch),
)

console.log('\n🚀 === КОМБИНАТОРЫ - ЭТО СИЛА ФУНКЦИОНАЛЬНОГО ПРОГРАММИРОВАНИЯ! ===')
