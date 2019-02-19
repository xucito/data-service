import createNamedType, { NamedTypeFactory } from './createNamedType';
import { Maybe } from 'folktale/maybe';
import Interval from './Interval';

export const fromMaybe = <T>(factory: NamedTypeFactory<T>, mb: Maybe<T>) =>
  mb.matchWith({
    Just: ({ value }) => factory(value),
    Nothing: () => factory(),
  });

export type TransactionData = {};

export const Asset = createNamedType('asset');
export const Alias = createNamedType('alias');
export const Candle = createNamedType('candle');
export const Pair = createNamedType('pair');
export const Transaction = createNamedType<TransactionData>('transaction');
export { List } from './List';
export { Interval };
