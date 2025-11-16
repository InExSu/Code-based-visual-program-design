const karma = {
  f1: () => ({ state: '', info: 'Случайная' }),
  f2: () => ({ state: '', info: 'текст' }),
  f3: () => ({ state: '', info: ' в start' }),
  f4: () => ({ state: '', info: 'данные f4' }),
  f5: () => ({ state: '', info: 'данные f5' }),
  f6: async () => {
    for (let i = 1; i <= 10; i++) {
      console.log('%c🟡 5: строка ' + i, 'color: yellow; font-weight: bold;')
      await new Promise(resolve => setTimeout(resolve, 20))
    }
    return { state: '', info: 'данные f6' }
  },
  f7: async () => {
    for (let i = 1; i <= 3; i++) {
      console.log('%c🔴 f7: строка ' + i, 'color: red; font-weight: bold;')
      await new Promise(resolve => setTimeout(resolve, 35))
    }
    return { state: '', info: 'данные f7' }
  },
  f8: () => ({ state: '', info: 'данные f8' }),
  f9: () => ({ state: '', info: 'слияние f9' }),
  f10: () => ({ state: '', info: 'слияние f10' }),
  f11: () => ({ state: '', info: 'финал f11' }),
  buddha: info => ({ state: 'nirvana', info: `Освобождение: ${info}` }),
}

export { karma }
