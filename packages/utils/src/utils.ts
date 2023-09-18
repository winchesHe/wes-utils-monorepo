/* eslint-disable no-console */
import fs, { existsSync } from 'fs'
import { join, parse } from 'path'
import { excludeList } from './constants'
import type { ExcludePattern } from './types'

export const flat = (arr: any[], num = 1) => {
  let i = 0
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
    i++
    if (i >= num)
      break
  }
  return arr
}

function isExclude(file: string, excludePattern: ExcludePattern | ExcludePattern[] = excludeList) {
  const excludeList = [excludePattern].flat().filter(v => v)
  return excludeList.some(exc => (
    typeof exc === 'string'
      ? file.includes(exc)
      : exc.test(file)
  ))
}

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
        console.log(filePath, '传入扫描的为单文件：')
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
    else { console.log(`路径文件读取失败：${filePath}`) }
  }
  catch (error) {
    console.log(error)
  }

  return fileArr
}

export function stringifyObj(obj: object) {
  let all = ''
  for (const [key, value] of Object.entries(obj)) {
    let str = value instanceof Function ? value.name : value
    if (typeof value === 'object')
      str = stringifyObj(value)

    all += `${key}: ${str},`
  }

  return `{${all}}`
}
