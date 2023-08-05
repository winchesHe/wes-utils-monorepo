export function hexToRgb(hexColor: string) {
  if (hexColor.includes('rgb'))
    return hexColor

  // 去除可能存在的 # 号
  if (hexColor.startsWith('#'))
    hexColor = hexColor.slice(1)

  // 处理缩写形式
  if (hexColor.length === 3) {
    hexColor = hexColor
      .split('')
      .map(char => char + char)
      .join('')
  }

  // 将十六进制颜色值转换为对应的十进制值
  const red = parseInt(hexColor.substring(0, 2), 16)
  const green = parseInt(hexColor.substring(2, 2), 16)
  const blue = parseInt(hexColor.substring(4, 2), 16)

  // 返回 RGB 格式的颜色值
  return `rgb(${red}, ${green}, ${blue})`
}

/**
 * 生成 RGB 渐变值的列表
 * @param {string} startColor 初始 RGB 值，形如 "rgb(r, g, b)"
 * @param {number} length 渐变的长度（包含初始值和结束值）
 * @returns {string[]} 包含渐变 RGB 值的数组
 */
export function smoothRGBGradient
  <T extends boolean>(
  startColor: string, length: number, withoutRGB: T,
): T extends true ? number[][] : string[] {
  const startRGB = startColor.match(/\d+/g)!.map(Number)
  // 基于 startColor 生成目标颜色
  const targetRGB = length <= 10
    ? [addValue(startRGB[0]), addValue(startRGB[1], 75), addValue(startRGB[2], 75)]
    : [addValue(startRGB[0], 125), addValue(startRGB[1], 75), addValue(startRGB[2], 75)]

  const gradient = []
  for (let i = 0; i < length; i++) {
    const progress = i / (length - 1)
    const interpolatedRGB = [
      getInterpolatedValue(startRGB[0], targetRGB[0], progress),
      getInterpolatedValue(startRGB[1], targetRGB[1], progress),
      getInterpolatedValue(startRGB[2], targetRGB[2], progress),
    ]
    if (withoutRGB)
      gradient.push(interpolatedRGB)
    else
      gradient.push(`rgb(${interpolatedRGB.join(', ')})`)
  }

  return gradient as T extends true ? number[][] : string[]

  /**
   * 插值算法：根据进度在 start 和 target 之间插值
   */
  function getInterpolatedValue(start: number, target: number, progress: number) {
    return Math.round(start + (target - start) * progress)
  }

  function addValue(color: number, value = 50) {
    const result = color + value
    return result > 255 ? 255 : result
  }
}
