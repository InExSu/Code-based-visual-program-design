import { dharma_2_Mermaid } from './utils.js';
import { dharma_4 } from './dharma.js';

import fs from 'fs';
import path from 'path';

dharma_2_Mermaid(dharma_4, 'dharma_4.md', fs, path)
