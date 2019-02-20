import { fromNullable } from 'folktale/maybe';

export const matchRequestsResults = <Request, Response>(
  matchFn: (req: Request, res: Response) => boolean,
  requests: Request[],
  results: Response[]
) => requests.map(req => fromNullable(results.find(res => matchFn(req, res))));

type QueryBuilder2 = string;
export type Filter<T> = (value: T) => (q: QueryBuilder2) => QueryBuilder2;
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
): Array<(q: QueryBuilder2) => QueryBuilder2> =>
  fsToApply.filter(fName => F[fName]).map(x => F[x](fValues[x]));
