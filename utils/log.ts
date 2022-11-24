/* eslint-disable no-console */
import c from 'picocolors'

export function printSuccessLogs(text: any, head?: any) {
  console.log()
  console.log(c.inverse(c.bold(c.green(` ${head ?? '成功：'} `))) + c.green(` ${text}`))
}

export function printErrorLogs(text: any, head?: any) {
  console.error()
  console.error(c.inverse(c.bold(c.red(` ${head ?? '失败：'} `))) + c.red(` ${text}`))
}
export function printWarnLogs(text: any, head?: any) {
  console.warn()
  console.warn(c.inverse(c.bold(c.yellow(` ${head ?? '警告：'} `))) + c.yellow(` ${text}`))
}
