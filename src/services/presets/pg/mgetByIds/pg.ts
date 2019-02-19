import { PgDriver } from 'db/driver';
import { matchRequestsResults } from '../../../../utils/db/index';
import { toDbError } from '../../../../errorHandling';

export type MgetByIdsFromDb = {
  name: string;
  sql: (id: string[]) => string;
  matchRequestResult: any;
};

export default <QueryResultType>({
  matchRequestResult,
  name,
  sql,
}: MgetByIdsFromDb) => (pg: PgDriver) => (ids: string[]) =>
  pg
    .any<QueryResultType>(sql(ids))
    .map(matchRequestsResults(matchRequestResult, ids))
    .mapRejected(toDbError({ request: name, params: ids }));
