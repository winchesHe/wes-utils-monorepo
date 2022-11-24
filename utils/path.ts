import { resolve } from 'path'
import { fileURLToPath } from 'url'

export const root = resolve(fileURLToPath(import.meta.url), '../..')
