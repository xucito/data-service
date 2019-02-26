import { reject, isNil, mapObjIndexed } from 'ramda';

export type Parser<T> = (value: string) => T;

export const parseFilterValues = <
  Parsers extends Record<string, (s: string) => any>
>(
  parsers: Parsers
) => <ValuesKeys extends keyof Parsers>(
  values: Partial<Record<ValuesKeys, string>>
): { [K in ValuesKeys]: ReturnType<Parsers[K]> } => values.map(v => v);
// mapObjIndexed((val: string, key) => val(values[key]), parsers);
// reject(isNil, mapObjIndexed((val, key) => val(values[key]), parsers));

export * from './parsers';
