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

