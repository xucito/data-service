import { fromNullable } from 'folktale/maybe';

const { compose, map, filter, has, __, curryN } = require('ramda');

export const matchRequestsResults = <Request, Response>(
  matchFn: (req: Request, res: Response) => boolean,
  requests: Request[],
  results: Response[]
) => requests.map(req => fromNullable(results.find(res => matchFn(req, res))));

/**
 * filter :: Query -> QueryWithFilter
 *
 * pickBindFilters ::
 *    { [fName]: fValue -> filter } ->
 *    fName[] ->
 *    { [fName]: fValue } ->
 *    filter[]
 * */
export const pickBindFilters = curryN(3, (F, fsToApply, fValues) =>
  compose(
    map(x => F[x](fValues[x])),
    filter(has(__, fValues))
  )(fsToApply)
);
