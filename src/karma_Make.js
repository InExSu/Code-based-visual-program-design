import fs from 'fs'
import path from 'path'

/**
 * Извлекает все уникальные узлы из dharma графа
 * @param {Object} dharma - DAG граф
 * @returns {Set<string>} Множество всех узлов
 */
function extractAllNodes(dharma) {
  const nodes = new Set()

  function traverse(nodeName, childrenTree) {
    nodes.add(nodeName)
    for (const childName in childrenTree) {
      traverse(childName, childrenTree[childName])
    }
  }

  for (const root in dharma) {
    traverse(root, dharma[root])
  }

  return nodes
}

/**
 * Генерирует код функции для узла
 * @param {string} nodeName - Имя узла
 * @returns {string} Код функции
 */
function generateFunctionCode(nodeName) {
  // Специальные обработчики для зарезервированных узлов
  if (nodeName === 'buddha') {
    return 'buddha: info => ({ state: \'nirvana\', info: `Освобождение: ${info}` })'
  }

  return `${nodeName}: () => ({ state: '', info: \'TODO\' })`
}

/**
 * Создает или обновляет файл karma.js на основе dharma
 * @param {string} dharmaFilePath - Путь к файлу dharma.js
 * @param {string} karmaFilePath - Путь к файлу karma.js
 */
async function karma_Make(dharmaFilePath, karmaFilePath) {
  try {
    // Импортируем модуль dharma.js напрямую
    const dharmaModule = await import(`file://${path.resolve(dharmaFilePath)}`)
    const dharma = dharmaModule.dharma

    if (!dharma) {
      throw new Error('Объект dharma не найден в модуле')
    }

    // Извлекаем все узлы
    const allNodes = extractAllNodes(dharma)
    console.log(`Найдено узлов: ${Array.from(allNodes).join(', ')}`)

    // Генерируем код функций
    const functionCodes = Array.from(allNodes)
      .map(node => generateFunctionCode(node))
      .join(',\n  ')

    // Читаем существующий файл karma.js
    let existingCode = ''

    if (fs.existsSync(karmaFilePath)) {
      existingCode = fs.readFileSync(karmaFilePath, 'utf8')

      // Проверяем, есть ли уже объект karma
      if (existingCode.includes('const karma = {') || existingCode.includes('export const karma = {')) {
        console.log('Файл karma.js уже существует и содержит объект karma')
      }
    }

    // Создаем новый файл karma.js
    const newKarmaCode = `const karma = {
  ${functionCodes},
}

export { karma }
`

    // Записываем файл
    fs.writeFileSync(karmaFilePath, newKarmaCode, 'utf8')
    console.log(`✅ Файл karma.js успешно создан/обновлен: ${path.resolve(karmaFilePath)}`)

    return {
      success: true,
      nodesCount: allNodes.size,
      nodes: Array.from(allNodes),
    }

  } catch (error) {
    console.error('❌ Ошибка при создании karma.js:', error.message)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Пример использования
if (import.meta.url === `file://${process.argv[1]}`) {
  ;(async () => {
    console.log('=== Генерация karma.js на основе dharma.js ===')

    // Создаем/обновляем основной karma.js
    const result = await karma_Make(
      path.join(process.cwd(), 'src', 'dharma.js'),
      path.join(process.cwd(), 'src', 'karma.js'),
    )

    if (result.success) {
      console.log(`🎯 Создано функций: ${result.nodesCount}`)
      console.log(`📝 Узлы: ${result.nodes.join(', ')}`)
    }
  })()
}

export { karma_Make, extractAllNodes, generateFunctionCode }
