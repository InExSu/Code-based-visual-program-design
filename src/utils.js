/**
 * Вспомогательные утилиты для работы с DAG
 */

// =============== Вспомогательные утилиты ===============

function timestampFilename(prefix = 'dharma') {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  return `${prefix}_${y}-${m}-${d}_${h}-${min}-${s}.md`
}

// =============== Проверка циклов в графе (DFS) ===============

function hasCycle(nms) {
  const graph = new Map()
  const allNodes = new Set()

  function buildGraph(node, children) {
    allNodes.add(node)
    if (!graph.has(node)) graph.set(node, new Set())
    for (const child in children) {
      allNodes.add(child)
      graph.get(node).add(child)
      if (!graph.has(child)) graph.set(child, new Set())
      buildGraph(child, children[child])
    }
  }

  for (const root in nms) buildGraph(root, nms[root])

  const visiting = new Set()
  const visited = new Set()

  function dfs(node) {
    if (visited.has(node)) return false
    if (visiting.has(node)) return true // цикл!
    visiting.add(node)
    for (const neighbor of graph.get(node) || []) {
      if (dfs(neighbor)) return true
    }
    visiting.delete(node)
    visited.add(node)
    return false
  }

  for (const node of allNodes) {
    if (dfs(node)) return true
  }
  return false
}

// =============== Парсинг графа в зависимости ===============

function parseGraph(nms) {
  if (hasCycle(nms)) {
    throw new Error('Graph contains a cycle — DAG must be acyclic.')
  }

  const allNodesSet = new Set()
  const childToParents = new Map()

  function traverse(node, childrenTree) {
    allNodesSet.add(node)
    for (const child in childrenTree) {
      allNodesSet.add(child)
      if (!childToParents.has(child)) childToParents.set(child, new Set())
      childToParents.get(child).add(node)
      traverse(child, childrenTree[child])
    }
  }

  for (const root in nms) {
    traverse(root, nms[root])
  }

  const deps = {}
  const allNodes = Array.from(allNodesSet)
  for (const node of allNodes) {
    deps[node] = Array.from(childToParents.get(node) || [])
  }

  return { allNodes, deps }
}

// =============== Генерация Mermaid ===============

function dharma_2_Mermaid(
  nms,
  filename = null,
  fsModule = null,
  pathModule = null,
) {
  const edges = new Set()

  function traverse(parent, childrenTree) {
    for (const child in childrenTree) {
      edges.add(`${parent} --> ${child}`)
      traverse(child, childrenTree[child])
    }
  }

  for (const root in nms) {
    traverse(root, nms[root])
  }

  const edgeList = Array.from(edges).sort()
  const mermaidCode = [
    '```mermaid',
    'flowchart TD',
    ...edgeList.map(edge => '    ' + edge),
    '```',
  ].join('\n')

  // Если не переданы fs/path или не указан файл — просто возвращаем строку
  if (!filename) {
    console.error('Ошибка: filename не задан')
    return mermaidCode
  }
  if (!fsModule) {
    console.error('Ошибка: fsModule не задан')
    return mermaidCode
  }
  if (!pathModule) {
    console.error('Ошибка: pathModule не задан')
    return mermaidCode
  }

  // Сохранение в файл (только в Node.js)
  if (!filename.endsWith('.md')) filename += '.md'
  fsModule.writeFileSync(filename, mermaidCode, 'utf8')
  console.log(`✅ Сетевой график сохранён в: ${pathModule.resolve(filename)}`)
  return filename
}

export { timestampFilename, hasCycle, parseGraph, dharma_2_Mermaid }
