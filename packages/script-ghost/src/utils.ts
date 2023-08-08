import fs, { existsSync, readFileSync } from 'fs'
import { basename, join, parse, resolve } from 'pathe'
import { printErrorLogs, printWarnLogs } from 'utils/log'
import type { GoGoAST } from 'gogocode'
import $ from 'gogocode'
import validPkgName from 'validate-npm-package-name'
import fg from 'fast-glob'
import { alias, cssExt, excludeList, jsExt, nodeTypes, tsExt, vueExt } from './constant'
import { createSingleProgressBar } from './bar'

export const scanDirFile = (filePath: string,
  extList: string[] = [],
  exclude: ExcludePattern | ExcludePattern[] = excludeList,
) => {
  const fileArr: string[] = []

  try {
    if (existsSync(filePath)) {
      // 传入单文件时判断
      if (fs.statSync(filePath).isFile()) {
        fileArr.push(filePath)
        printWarnLogs(filePath, '传入扫描的为单文件：')
        return fileArr
      }

      // 读取目录遍历
      fs.readdirSync(filePath).forEach((file) => {
        // 按 exclude 列表排除文件/文件夹
        if (isExclude(file, exclude))
          return

        // 拼接路径
        file = join(filePath, file)

        const isFile = fs.statSync(file).isFile()
        const isDir = fs.statSync(file).isDirectory()

        // 文件满足ext条件时添加
        isFile && (extList.length === 0 || extList.includes(parse(file).ext)) && fileArr.push(file)
        // 目录则遍历循环
        isDir && fileArr.push(...scanDirFile(file, extList, exclude))
      })
    }
    else { printErrorLogs(`路径文件读取失败：${filePath}`) }
  }
  catch (error) {
    printErrorLogs(error)
  }

  return fileArr
}

export const parseJsTsFile = (fileText: string) => {
  // 存放解析后导入的数据
  const sourcesList: string[] = []
  const ast = $(fileText)

  const addSource = (node: GoGoAST) => {
    // 获取捕获到的 import XX from / export XX from 资源
    const importSource = node.attr('source.value') as string

    importSource && sourcesList.push(importSource)
  }
  ast.find({ type: 'ImportDeclaration' }).each(addSource)
  ast.find({ type: 'ExportNamedDeclaration' }).each(addSource)

  // 处理import('')
  ast.find('import($_$)').each((node) => {
    sourcesList.push(node.match[0][0].value)
  })
  // 处理require('')
  ast.find('require($_$)').each((node) => {
    sourcesList.push(node.match[0][0].value)
  })

  return sourcesList
}

export const parseCssFile = (fileText: string) => {
  const sourcesList: string[] = []
  const importRegexp = /^@import\s+['"](.*)+['"]/
  const lines = fileText.split('\r\n')
  for (const line of lines) {
    const match = line.trim().match(importRegexp)?.[1]
    if (match)
      sourcesList.push(match)
  }
  return sourcesList
}

export const parseVueFile = (fileText: string) => {
  const sourcesList: string[] = []

  // 需将Vue3 setup关键字处理才能解析
  const ast = $(fileText.replace(/<script(.*)setup(.*)>/, '<script$1$2>'), {
    parseOptions: { language: 'vue' },
  })
  const script = ast.find('<script></script>').generate().trim()

  sourcesList.push(...parseJsTsFile(script))
  sourcesList.push(...parseCssFile(fileText))

  return sourcesList
}

export const getImportSource = (filePath: string) => {
  const sourceList: string[] = []
  const fileText = readFileSync(filePath, 'utf-8')
  const fileExt = parse(filePath).ext

  if (jsExt.includes(fileExt) || tsExt.includes(fileExt))
    sourceList.push(...parseJsTsFile(fileText))
  else if (cssExt.includes(fileExt))
    sourceList.push(...parseCssFile(fileText))
  else if (vueExt.includes(fileExt))
    sourceList.push(...parseVueFile(fileText))

  return sourceList
}

export const isValidSource = (
  filePath: string,
  importSourcePath: string,
  tsconfigAlias?: string[],
) => {
  const { dir } = parse(filePath)

  // 读取tsconfig路径别名
  const importAlias = tsconfigAlias ?? []

  if (importSourcePath.includes('node_modules'))
    return true

  // 路径别名校验
  if (
    [...importAlias, ...alias].some(prefix =>
      importSourcePath.startsWith(prefix),
    )
  )
    return false

  // 模块校验
  if (
    ['', ...cssExt, ...jsExt, ...vueExt].some(ext =>
      existsSync(join(dir, `${importSourcePath}${ext}`)),
    )
  )
    return false

  return true
}

export const findGhost = async (pathList: string[], pkgPath: string) => {
  // 转换完整路径
  const absolutePath = pathList.map(path => resolve(process.cwd(), path))
  const filterPath = absolutePath.filter(path => existsSync(path))

  // 若不存在有效路径则报错
  if (!filterPath.length) {
    printErrorLogs(absolutePath, '扫描路径不存在：')
    process.exit(1)
  }
  pathList = filterPath

  // 解析pkgPath路径
  pkgPath = fg.sync(pkgPath ?? 'package.json', { absolute: true, onlyFiles: true, unique: true })[0]

  // 解析package.json
  const pkgContent = existsSync(pkgPath) && JSON.parse(readFileSync(pkgPath, 'utf-8'))
  const depList = Object.keys({
    ...pkgContent.devDependencies,
    ...pkgContent.dependencies,
  })

  // 获取待扫描路径文件
  let fileList: string[] = []
  pathList.forEach((file) => {
    fileList.push(...scanDirFile(file))
  })
  fileList = [...new Set(fileList)]

  const bar = createSingleProgressBar()

  // 读取解析路径文件里的导入资源
  const tsconfigContent = await getTsconfig()
  let packageSource: string[] = []

  bar.start(fileList.length, 0, { head: '正在扫描依赖' })

  fileList.forEach((filePath) => {
    bar.increment(1, { name: `当前正在解析文件: ${basename(filePath)}` })
    const importSource = getImportSource(filePath)
    const validSource = importSource.filter(source => isValidSource(filePath, source, tsconfigContent))
    packageSource.push(...validSource.filter(v => getPkgNameBySourcePath(v)))
  })
  // 获取去重后的导入资源列表
  packageSource = [...new Set(packageSource)]

  bar.stop()

  // 获取nodejs类型
  let typesNode = (existsSync(resolve(process.cwd(), 'node_modules/@types/node'))
    && scanDirFile(resolve(process.cwd(), 'node_modules/@types/node')))
    || nodeTypes
  typesNode = typesNode
    .map(v => v.replace(/(.*)@types\/node\/(.*)\.d\.ts/, '$2'))

  /**
   * 排除package.json依赖
   * 排除nodejs的依赖
   * 返回最后的结果
   */
  return packageSource.filter(source => (
    ![...depList, ...typesNode].includes(source)
      && isValidPkgName(source)
  ))
}

export function isExclude(file: string, excludePattern: ExcludePattern | ExcludePattern[] = excludeList) {
  const excludeList = [excludePattern].flat().filter(v => v)
  return excludeList.some(exc => (
    typeof exc === 'string'
      ? file.includes(exc)
      : exc.test(file)
  ))
}

async function getTsconfig() {
  const tsconfigPath = fg.sync('tsconfig.json', { absolute: true, onlyFiles: true, unique: true })[0]

  try {
    if (existsSync(tsconfigPath)) {
      const tsconfigText = JSON.parse(readFileSync(tsconfigPath, 'utf-8'))
      const importAlias = tsconfigText?.compilerOptions?.paths
      return Object.keys(importAlias)?.map(v => v.replace(/[\/*]*$/g, ''))
    }
  }
  catch (error) {
    console.warn('Error：解析 tsconfig.json 失败，请注意 tsconfig.json 的格式是否正确', error)
    console.warn()
  }
}

export function getPkgNameBySourcePath(pkgPath: string) {
  const paths = pkgPath
    .replace(/~/g, '')
    .replace(/.*node_modules\//, '')
    .split('/')
  return paths[0].startsWith('@') ? paths.slice(0, 2).join('/') : paths[0]
}

export function isValidPkgName(pkgName: string): boolean {
  // 检验是否为合法的第三方库
  const result = validPkgName(pkgName)
  return result.validForNewPackages
}
