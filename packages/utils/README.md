# @winches/utils

日常ts(typescript)工具函数 如：链式调用函数、缓存装饰器...等等 type gymnastics

## install
```sh
npm i @winches/utils -D
# or
yarn add @winches/utils -D
# or
pnpm add @winches/utils -D
```

## Usage
### chainFn (链式调用)
```ts
import { ChainFn } from '@winches/utils'

// get the last res
const lastRes = await new ChainFn()
  .add(fn1, parameter1)
  .add(fn2, parameter2)
  .get() // res2

// get the all res
const res = await new ChainFn()
  .add(fn1, parameter1)
  .add(fn2, parameter2)
  .get(true) // [res1, res2]

// chainRun (run fn2 with res1)
await new ChainFn()
  .add(fn1)
  .add(res => fn2(res[0]))
  .run()

// more api clear, catch...
```

### cacheDecorator (缓存装饰器)
```ts
import { cachingDecorator } from '@winches/utils'

function sum(a, b) {
  console.log('execute sum')
  return a + b
}

const cacheSum = cachingDecorator(sum)
console.log(cacheSum(1, 2)) // execute sum: 3
console.log(cacheSum(1, 2)) // 3
```