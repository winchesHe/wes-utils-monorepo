export type ExecutorFn = (...args: any) => any
export type ExcludePattern = string | RegExp
/**
 * @example 将类型 'SfTable' ---> 'sf-table'
 */
export type ToKebab<T extends string, O extends string = Uncapitalize<T>> = O extends `${infer First}${infer Rest}`
  ? First extends Capitalize<First>
    ? `-${Lowercase<First>}${ToKebab<Rest>}`
    : `${First}${ToKebab<Rest, Rest>}`
  : T;
