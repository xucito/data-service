import { reject, isNil, mapObjIndexed } from 'ramda';

export type Parser<T> = (value: string) => T;

// export const parseFilterValues = <Parsers extends Record<string, Parser<any>>>(
//   parsers: Parsers
// ) => (
//   values: {
//     [K in keyof Parsers]?: Parsers[K] extends Parser<infer R> ? R : never
//   }
// ) => reject(isNil, mapObjIndexed((val, key) => val(values[key]), parsers));

type T1 = { q: number, w: string };
type T2 = keyof T1;
type T3 = Record<keyof T1, string>;
type T4 = { [K in keyof T3]: T1[K] };

type T5 = { q: string, e: string };
type T6 = keyof T1 & keyof T5;

export const parseFilterValues = <Parsers extends Record<string, Parser<any>>>(
  parsers: Parsers
) => (
  values: { [K in keyof Parsers]?: string }
): ({ [K in keyof typeof values]: Parsers[K] extends Parser<infer R> ? R : never }) => null
  // reject(isNil, mapObjIndexed((val, key) => val(values[key]), parsers));


const parsers = {
  q: (s: string) => 2,
  w: (s: string) => '2',
}

const t = parseFilterValues(parsers)({ q: "qwe" });

export * from './parsers';
