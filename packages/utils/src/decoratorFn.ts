/**
 * 缓存装饰器函数
 * @param func 需缓存的函数
 * @returns 返回缓存后的函数
 */
export function cachingDecorator(func: Function) {
  // 用map来保存缓存
  const cache = new Map()
  let returnValue: { value: any; cached: boolean } = {} as { value: any; cached: boolean }
  let hasCached = false

  const clearCache = () => {
    returnValue = { value: {}, cached: false }
    hasCached = false
    cache.clear()
  }

  return function (this: any, needCache = false, ...args: any[]) {
    // 如果设置过需要缓存，则保存缓存标识
    if (needCache)
      hasCached = true

    // 用hash来记录参数
    const key = hash(args)
    if (cache.has(key)) {
      //  如果有缓存该函数并且参数相同
      returnValue.value = cache.get(key)
      returnValue.cached = hasCached
      return { returnValue, clearCache } //  返回同样结果
    }

    // 记录第一次函数的结果
    const result = func.apply(this, args)

    // 保存下结果与函数参数
    cache.set(key, result)
    // 返回第一次的结果
    returnValue.value = result
    returnValue.cached = false
    return { returnValue, clearCache }
  }

  function hash(args: any) {
    // 参数的拼接
    return [].join.call(args) // 3,5
  }
}
