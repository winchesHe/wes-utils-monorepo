# @winches/type-tools

ts(typescript) 工具函数 泛型 ts工具

## install
```sh
npm i @winches/type-tools -D
# or
yarn add @winches/type-tools -D
# or
pnpm add @winches/type-tools -D
```

## Usage

### get the union length
```ts
import type { GetUnionLastValue } from '@winches/type-tools'

interface union {
  a: 'a'
  b: 'b'
  c: 'c'
}
type unionLength = GetUnionLastValue<keyof union> // 3
```

### add prefix key to object
```ts
import type { AddPrefixKeyToObject } from '@winches/type-tools'

interface union {
  ab: 'a'
  bc: 'b'
  cd: 'c'
}
type prefixUnion = AddPrefixKeyToObject<union, 'prefix'> // { prefixAb: 'a', ... }
```

### union to tuple
```ts
import type { Union2Tuple } from '@winches/type-tools'

type tuple = Union2Tuple<'a' | 'b' | 'c'> // ['a'|'b'|'c', 'a'|'b'|'c', 'a'|'b'|'c']
```

### union to array
```ts
import type { UnionToArray } from '@winches/type-tools'

type array = UnionToArray<'a' | 'b' | 'c'> // ['a'|'b'|'c', ...('a'|'b'|'c')[]]
```

### the keyof unionObject to new type interface (获取联合对象里的key值到新对象类型)
```ts
import type { UnionObjectKeysToObject } from '../dist'

type obj = {
  key1: 'v1'
  key2: 'v2'
} | {
  key3: 'v3'
  key1: 'v1'
}
type ObjKeyType = UnionObjectKeysToObject<obj> // { key1: 'v1'; key2: 'v2'; key3: 'v3' }
```

### parse query parameter
```ts
import type { ParseQueryStr } from '../dist'

type QueryStr = ParseQueryStr<'a=1'> // { a: 1 }
type QueryStr2 = ParseQueryStr<'a=1&b=2'> // { a: 1; b: 2 }
```