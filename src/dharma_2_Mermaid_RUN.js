import { dharma_2_Mermaid } from './utils.js'
import { dharma } from './dharma_Example.js'

import fs from 'fs'
import path from 'path'

dharma_2_Mermaid(dharma, 'src/dharma.md', fs, path)

