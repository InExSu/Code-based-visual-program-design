import fs from 'fs'

const watchedFile = 'dharma.js'
const scriptToRun = 'dharma_2_Mermaid.js'

let lastModified = 0

function checkFileChanges() {
  try {
    if (fs.existsSync(watchedFile)) {
      const stats = fs.statSync(watchedFile)
      if (stats.mtimeMs > lastModified) {
        lastModified = stats.mtimeMs
        console.log(`📝 Файл ${watchedFile} изменен, выполняю ${scriptToRun}...`)
        
        // Импортируем и выполняем скрипт
        import(`./${scriptToRun}`)
          .then(module => {
            console.log(`✅ ${scriptToRun} выполнен успешно`)
          })
          .catch(err => {
            console.error(`❌ Ошибка при выполнении ${scriptToRun}:`, err.message)
          })
      }
    }
  } catch (error) {
    console.error('❌ Ошибка при проверке файла:', error.message)
  }
}

// Проверяем файл каждую секунду
console.log(`🔍 Отслеживание изменений файла: ${watchedFile}`)
console.log(`🔄 При изменении будет выполняться: ${scriptToRun}`)
console.log('Нажмите Ctrl+C для остановки...')

setInterval(checkFileChanges, 1000)

// Обработка Ctrl+C
process.on('SIGINT', () => {
  console.log('\n👋 Отслеживание остановлено')
  process.exit(0)
})

