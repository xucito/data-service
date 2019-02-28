import { fromNullable } from 'folktale/maybe';
import { QueryBuilder } from 'knex';

export const matchRequestsResults = <Request, Response>(
  matchFn: (req: Request, res: Response) => boolean,
  requests: Request[],
  results: Response[]
) => requests.map(req => fromNullable(results.find(res => matchFn(req, res))));

export type Filter<T> = (value: T) => (q: QueryBuilder) => QueryBuilder;

export const pickBindFilters = <
  Filters extends Record<string, Filter<any>>,
  FiltersToApply extends (keyof Filters)[]
>(
  F: Filters,
  fsToApply: FiltersToApply,
  fValues: {
    [K in typeof fsToApply[number]]: Filters[K] extends Filter<infer R>
      ? R
      : never
  }
): Array<(q: QueryBuilder) => QueryBuilder> =>
  fsToApply.filter(fName => F[fName]).map(x => F[x](fValues[x]));
