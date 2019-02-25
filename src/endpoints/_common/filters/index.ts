import { reject, isNil, mapObjIndexed } from 'ramda';

export type Parser<T> = (value: string) => T;

export const parseFilterValues = <Parsers extends Record<string, Parser<any>>>(
  parsers: Parsers
) => (
  values: {
    [K in keyof Parsers]: Parsers[K] extends Parser<infer R> ? R : never
  }
) => reject(isNil, mapObjIndexed((val, key) => val(values[key]), parsers));

export * from './parsers';
