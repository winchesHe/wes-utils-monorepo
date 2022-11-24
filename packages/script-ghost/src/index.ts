import fs, { existsSync } from 'fs'
import { join, parse } from 'path'
import { printErrorLogs, printWarnLogs } from 'utils/log'

export const scanDirFile = (filePath: string,
  extList: string[] = [],
  exclude: ExcludePattern | ExcludePattern[] = [
    'node_modules',
    '.md',
    '.vscode',
    '.git',
    '.DS_Store',
    '.json',
  ],
) => {
  const fileArr: string[] = []

  try {
    if (existsSync(filePath)) {
      // 传入单文件时判断
      if (fs.statSync(filePath).isFile()) {
        fileArr.push(filePath)
        printWarnLogs('请传入文件目录而非单文件')
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

function isExclude(file: string, excludePattern: ExcludePattern | ExcludePattern[]) {
  const excludeList = [excludePattern].flat().filter(v => v)
  return excludeList.some(exc => (
    typeof exc === 'string'
      ? file.includes(exc)
      : exc.test(file)
  ))
}
