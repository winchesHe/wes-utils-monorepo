export const excludeList = [
  'node_modules',
  '.md',
  '.vscode',
  '.git',
  '.DS_Store',
  '.json',
  '.npmrc',
  '.yaml',
  '.eslintrc',
  '.svg',
  'LICENSE',
]

export const jsExt = ['.js', '.jsx']
export const tsExt = ['.ts', '.tsx']
export const vueExt = ['.vue']
export const cssExt = ['.sass', '.scss', '.less', '.css']
export const extList = [...jsExt, ...tsExt, ...cssExt, ...vueExt]

export const alias = ['./', '../', '@/', '~@/', '`'] as const

export const nodeTypes = [
  'assert',
  'buffer',
  'child_process',
  'cluster',
  'console',
  'constants',
  'crypto',
  'dgram',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  'https',
  'module',
  'net',
  'os',
  'path',
  'punycode',
  'querystring',
  'readline',
  'repl',
  'stream',
  'string_decoder',
  'sys',
  'timers',
  'tls',
  'tty',
  'url',
  'util',
  'vm',
  'zlib',
]
