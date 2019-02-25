import { compose, reject, isNil, mapObjIndexed } from 'ramda';

export const parseFilterValues = parsers => values =>
  compose(
    reject(isNil),
    mapObjIndexed((val, key) => val(values[key]))
  )(parsers);

export * from './parsers';
