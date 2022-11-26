import { existsSync, readdirSync } from 'fs'
import inquirer from 'inquirer'
import { printErrorLogs } from 'utils/log'
import { excludeList } from '../constant'
import { isExclude } from '../utils'

function getScanDir() {
  const dir = process.cwd()

  try {
    if (existsSync(dir)) {
      return readdirSync(dir).filter((file) => {
        return !isExclude(file, excludeList)
      })
    }
  }
  catch (error) {
    printErrorLogs(error)
  }
}

export const getScanPath = async () => {
  const pathName = {
    type: 'checkbox',
    name: 'path',
    message: '请选中需要扫描的文件或目录: ',
    choices: getScanDir(),
    validate: (value: string[]) => {
      if (!value.length)
        return '必须选中一个文件或目录扫描'

      return true
    },
  }
  return (await inquirer.prompt([pathName])).path
}
