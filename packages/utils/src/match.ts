export function getMatchArray(key: string, target: string) {
  const mixinReg = new RegExp(`\\s*${key}:\\s\\[([\\w\\W]*?)\\]\\s*`)

  if (mixinReg.test(target)) {
    return (
      target
        .match(mixinReg)?.[1]
        ?.split(/,\n/)
        .map(i => i.trim().replace(/[`'"]/g, ''))
        .filter(Boolean) ?? []
    )
  }

  return []
}
