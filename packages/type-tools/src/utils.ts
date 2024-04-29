/* eslint-disable max-len */

/**
 * 获取函数第二个参数类型
 */
export type GetSecondArgs<T> = T extends (_: any, arg: infer R) => any ? R : any

/**
 * 根据type类型控制Args类型是否为必传
 * 若type符合OtherType类型，则返回必传的Args类型，否则返回Args类型
 */
export type IsRequiredText<T, OtherType, Args> = 'type' extends keyof T
  ? T['type'] extends OtherType
    ? Required<Args>
    : Args
  : never

/**
 * 将传入的 T 对象里的key替换成自定义驼峰
 * 'login' => 'PrefixLogin'
 */
export type AddPrefixKeyToObject<T, Prefix extends string = ''> = {
  [P in keyof T as P extends string ? `${Prefix}${Capitalize<P>}` : P]: T[P]
}

/**
 * 联合类型转交叉类型
 *  UnionToIntersection<{ foo: string } | { bar: string }> =
 *  { foo: string } & { bar: string }
 */
export type UnionToIntersection<U> = (U extends any ? (arg: U) => any : never) extends (arg: infer I) => any ? I : never

/**
 * 获取联合类型最后的值
 * 对于交叉类型的函数推断，可以通过infer来获取交叉类型的最后一个类型
 * @example GetUnionLastValue<0 | 1 | 2> --> 2
 */
export type GetUnionLastValue<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R
  ? R
  : never

/**
 * 数组后位加类型
 */
export type Push<T extends any[], U> = [...T, U]

/**
 * 获取联合类型的长度
 * type Example = {
 *     a: '1';
 *     b: '2';
 *     c: '3';
 * };
 * 'GetUnionLength<typeof Example>'  ==> return '3' ;
 */
export type GetUnionLength<T, C extends any[] = [], K = GetUnionLastValue<T>> = [T] extends [never]
  ? C['length']
  : GetUnionLength<Exclude<T, K>, [K, ...C]>

/**
 * 添加key-value类型到指定对象中
 */
export type AppendToObject<T, U extends keyof any, V> = {
  [K in keyof T | U]: K extends keyof T ? T[K] : V
}

/**
 * 指定对象里的某个key值必选
 */
export type RequiredSomeKey<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: T[P]
}

/**
 * 计算字符串长度
 */
export type LengthOfString<T extends string, K extends String[] = []> = T extends `${infer F}${infer R}`
  ? LengthOfString<R, [F, ...K]>
  : K['length']

export type ValueOf<T> = T[keyof T]

export type NonEmptyArray<T> = [T, ...T[]]

export type MustInclude<T, U extends T[]> = [T] extends [ValueOf<U>] ? U : never

// 联合类型转数组
export type UnionToArray<T, U extends NonEmptyArray<T> = NonEmptyArray<T>> = MustInclude<T, U>

/**
 * 联合类型转元组
 * Union2Tuple<'1' | '2'> --> ['1' | '2', '1' | '2']
 */
export type Union2Tuple<T, A extends any[] = [], L = GetUnionLength<T>> = A['length'] extends L
  ? A
  : Union2Tuple<T, Push<A, T>>

/**
 * 联合类型转顺序元组
 * UnionToOrderTuple<'1' | '2'> --> ['1', '2']
 */
export type UnionToOrderTuple<T, Last = GetUnionLastValue<T>> = [T] extends [never]
  ? []
  : [...UnionToOrderTuple<Exclude<T, Last>>, Last]

/**
 * 合并两个对象key value，若key重复，则保留F类型的value
 */
export type Merge<F, S> = {
  [P in keyof F | keyof S]: P extends keyof S ? S[P] : P extends keyof F ? F[P] : never
}

/**
 * 支持保留 optional 的类型
 * @example BetterMerge<{ a: 1, b?: 2 }, { a: 2, c: 3 }> --> { a: 2, b?: 2, c: 3 }
 */
export type BetterMerge<F, S, P = Omit<F, keyof S> & S> = { [k in keyof P]: P[k]; }

/**
 * 联合类型的key value合并到一个对象中
 * @example UnionObjectKeysToObject<{a: 1} | {b: 2}> --> { a: 1, b: 2 }
 */
export type UnionObjectKeysToObject<
  T,
  A extends any[] = [],
  O = {},
  L = GetUnionLength<T>,
  V = GetUnionLastValue<T>,
> = A['length'] extends L ? O : UnionObjectKeysToObject<Exclude<T, V>, Push<A, V>, Merge<O, V>, L>

/**
 * 联合类型的key 联合类型的value合并到一个对象中
 * @example UnionKeyValueToObject<0 | 1 | 2, '00' | '11' | '22'> --> { 0: '00', 1: '11', 2: '22' }
 */
export type UnionKeyValueToObject<V, D, VL = GetUnionLastValue<V>, DL = GetUnionLastValue<D>, ED = Exclude<D, DL>> = [V] extends [never]
  ? {}
  : Merge<
      Record<VL extends keyof any ? VL : never, DL>,
      UnionKeyValueToObject<Exclude<V, VL>, ED extends [never] ? D : ED>
    >

/**
 * 路由参数key value获取
 * a=1&b=2&c=3 ⇒ { a:1, b:2, c:3 }
 */
export type ParseQueryStr<T extends string, O = {}> = T extends `${infer K}=${infer R}`
  ? R extends `${infer V}&${infer AR}`
    ? ParseQueryStr<AR, AppendToObject<O, K, V>>
    : R extends `${infer V}`
      ? AppendToObject<O, K, V>
      : O
  : never

/**
 * @example 将类型 'SfTable' ---> 'sf-table'
 */
export type KebabCase<T extends string, O extends string = Uncapitalize<T>> = O extends `${infer First}${infer Rest}`
  ? `${First extends Capitalize<First> ? `-${Lowercase<First>}` : First}${KebabCase<Rest, Rest>}`
  : T

/**
 * @example 'test-test' => 'TestTest'
 */
export type PascalCase<T extends string> = T extends `${infer F}-${infer R}`
  ? `${Capitalize<F>}${PascalCase<R>}`
  : Capitalize<T>

/**
 * @example 'testTest' => 'test_test'
 */
export type SnakeCase<T extends string, UC = Uncapitalize<T>> = UC extends `${infer F}${infer R}`
  ? `${F extends Uppercase<F> ? `_${Lowercase<F>}` : Lowercase<F>}${SnakeCase<R, R>}`
  : UC

/**
 * @example 'test-test' => 'testTest'
 */
export type CamelCase<T extends string> = Uncapitalize<PascalCase<T>>

/**
 * @example RequiredKey<{a?: 1, b?: 2}, a> => {a: 1, b?: 2}
 */
export type RequiredKey<T, Key extends keyof T> = {
  [K in keyof T as K extends Key ? never : K]?: T[K]
} & {
  [K in Key]-?: T[K]
}

/**
 * @example Increase<5> => 0 | 1 | 2 | 3 | 4
 * Increase<5, true> => 1 | 2 | 3 | 4 | 5
 */
type Increase<N extends number, Equal = false, Acc extends number[] = []> = Acc['length'] extends N
  ? Equal extends true
    ? Acc[number] | N
    : Acc[number]
  : Increase<N, Equal, Acc['length'] extends 0 ? Equal extends true ? [1] : [0] : [...Acc, Acc['length']] >

/**
 * @example IntRange<5, 10> => 5 | 6 | 7 | 8 | 9 | 10
 */
export type IntRange<F extends number, T extends number> = Exclude<Increase<T, true>, Increase<F>>

export type ArrayWithLength<T extends number, U extends any[] = []> = U['length'] extends T ? U : ArrayWithLength<T, [true, ...U]>

/**
 * @example GreaterThan<5, 3> => true
 */
export type GreaterThan<T extends number, U extends number> = ArrayWithLength<U> extends [...ArrayWithLength<T>, ...any] ? false : true
