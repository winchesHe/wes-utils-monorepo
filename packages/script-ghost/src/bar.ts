/* eslint-disable max-len */
import { MultiBar, Presets, SingleBar } from 'cli-progress'
import c from 'picocolors'

export function createSingleProgressBar() {
  return new SingleBar({
    clearOnComplete: true,
    hideCursor: true,
    format: `${c.green('{head}')} ${c.green('{bar}')} | {percentage}% || {value}/{total} || time: {duration}s | ${c.gray('{name}')}`,
    linewrap: false,
    barsize: 40,
  }, Presets.shades_classic)
}

export function createMultiProgressBar() {
  return new MultiBar({
    clearOnComplete: true,
    hideCursor: true,
    format: `${c.green('{head}')} ${c.green('{bar}')} | {percentage}% || {value}/{total} || time: {duration}s | ${c.gray('{name}')}`,
    linewrap: false,
    barsize: 40,
  }, Presets.shades_classic)
}
