# @winches/ghost

幽灵依赖扫描工具 scan ghost in project

## Usage
### Global CLI(命令行注册)
```sh
npm i -g @winches/ghost
pnpm add -g @winches/ghost
yarn add -g @winches/ghost
```

### scan
```sh
# 默认在项目目录下选择文件扫描 
ghost scan
```

set scan `dir` or `file`
```sh
ghost scan packages/pkg1/src
```

set `package.json` path to compare

```sh
ghost scan src -p otherDir/package.json
```


### Local Use (本地使用)
```sh
npm i @winches/ghost -D
# or
yarn add @winches/ghost -D
# or
pnpm add @winches/ghost -D
```


#### Usage Template (本地使用示例)
```ts
import { findGhost } from '@winches/ghost'

const phantomDependency = findGhost(
  path.join(__dirname, 'src'),
  path.join(process.cwd(), 'package.json')
)
```

## More Info
```sh
ghost --help

ghost scan --help

ghost -v
```