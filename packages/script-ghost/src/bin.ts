#!/usr/bin/env node
import { Command } from 'commander'
import { scanGhost } from './command/ghost'

const program = new Command()

program
  .command('scanGhost [paths...]')
  .description('扫描目录或文件是否存在幽灵依赖')
  .option('-p, --pkg [pkgPath]', '需扫描的 package.json 的位置')
  .action(scanGhost)

program.parse(process.argv)
