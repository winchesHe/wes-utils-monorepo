import type { ExecutorFn } from './types'
import { flat } from './utils'

export class ChainFn {
  resList: any[]
  executorList: any[]
  errorList: any[]

  constructor(
    executor?: ExecutorFn,
    args?: any,
      resList: any[] = [],
      executorList: any[] = [],
      errorList: any[] = [],
  ) {
    this.resList = resList
    this.executorList = executorList
    this.errorList = errorList
    args = flat([args])

    // 添加执行函数
    executor && this.executorList.push([executor, args])
  }

  public add(onResFn: ExecutorFn, ...args: any[]): ChainFn {
    args = flat([args])
    return new ChainFn(onResFn, args, this.resList, this.executorList, this.errorList)
  }

  public catch(callBack: Function) {
    if (this.errorList.length)
      return callBack.apply(this, this.errorList)
  }

  public async run(onResFn?: Function, ...args: any[]): Promise<ChainFn> {
    await this.getValue()
    args = flat([args])

    if (onResFn) {
      try {
        const returnValue = await this.executeSync(onResFn, [this.resList, ...args])
        returnValue && this.resList.push(returnValue)
      }
      catch (error) {
        this.errorList.push(error)
      }
    }

    return new ChainFn(undefined, undefined, this.resList, this.executorList, this.errorList)
  }

  public clear() {
    return new ChainFn(undefined, undefined, [], [], [])
  }

  public async get(allRes = false): Promise<any> {
    await this.getValue()
    return allRes ? this.resList : this.resList[this.resList.length - 1]
  }

  private async getValue() {
    for (let index = 0; index < this.executorList.length; index++) {
      const [executor, args, isDo = false] = this.executorList[index]
      const useRes = executor.name === ''

      if (isDo)
        continue
      try {
        const value = useRes
          ? await this.executeSync(executor, [this.resList])
          : await this.executeSync(executor, args)
        this.resList.push(value)
        this.executorList[index].push(true)
      }
      catch (error) {
        this.errorList.push(error)
      }
    }
  }

  private async executeSync(executor: Function, args: any[]) {
    return executor instanceof Promise
      ? await (executor as any).apply(this, args)
      : executor.apply(this, args)
  }
}
