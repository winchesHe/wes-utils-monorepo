#!/usr/bin/env node
import { Command } from 'commander'
import pkg from '../package.json'
import { scanGhost } from './command/ghost'

const program = new Command()
program.version(pkg.version)

program
  .command('scan [paths...]')
  .description('扫描目录或文件是否存在幽灵依赖')
  .option('-p, --pkg [pkgPath]', '需扫描的 package.json 的位置')
  .action(scanGhost)

program.parse(process.argv)
