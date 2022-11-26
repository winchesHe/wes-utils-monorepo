import { resolve } from 'path'
import { printSuccessLogs } from 'utils/log'
import { getScanPath } from '../inquirer/path'
import type { ScanOptions } from '../types'
import { findGhost } from '../utils'

export const scanGhost = async (pathList: string[], options: ScanOptions) => {
  // 未传路径的时候获取路径
  if (!pathList.length)
    pathList = await getScanPath()

  // 获取package.json的路径
  const pkgPath = options.pkg
    ? resolve(process.cwd(), options.pkg)
    : resolve(process.cwd(), 'package.json')

  // 寻找指定路径下的幽灵依赖
  const ghostList = await findGhost(pathList, pkgPath)

  printSuccessLogs(`${ghostList.length}👻`, '找到幽灵依赖数量：')
  printSuccessLogs(ghostList, '幽灵依赖列表：')
}
