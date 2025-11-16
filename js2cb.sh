#!/usr/bin/env bash

SRC_DIR="src"

# Проверка наличия папки
if [[ ! -d "$SRC_DIR" ]]; then
  echo "Папка '$SRC_DIR' не найдена."
  exit 1
fi

# Считываем содержимое всех js-файлов
content=$(find "$SRC_DIR" -type f -name "*.js" -exec cat {} +)

if [[ -z "$content" ]]; then
  echo "Файлы *.js в папке '$SRC_DIR' не найдены или пусты."
  exit 1
fi

# Функция копирования в буфер в зависимости от ОС
copy_to_clipboard() {
  if command -v pbcopy &> /dev/null; then
    # macOS
    echo "$content" | pbcopy
  elif command -v xclip &> /dev/null; then
    # Linux с xclip
    echo "$content" | xclip -selection clipboard
  elif command -v xsel &> /dev/null; then
    # Linux с xsel
    echo "$content" | xsel --clipboard --input
  elif command -v clip.exe &> /dev/null; then
    # Windows (Git Bash, WSL)
    echo "$content" | clip.exe
  else
    echo "Не найден инструмент для копирования в буфер. Установите pbcopy, xclip, xsel или используйте Windows с clip."
    exit 2
  fi
}

copy_to_clipboard
echo "Содержимое всех *.js файлов из папки '$SRC_DIR' скопировано в буфер обмена."
