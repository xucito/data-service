import { fromNullable } from 'folktale/maybe';
import { toDbError } from '../../../../errorHandling';
import { PgDriver } from 'db/driver';

export type GetByIdFromDb<T> = {
  name: string;
  sql: (id: T) => string;
};

export default <QueryType, QueryResultType>({
  name,
  sql,
}: GetByIdFromDb<QueryType>) => (pg: PgDriver) => (id: QueryType) =>
  pg
    .oneOrNone<QueryResultType>(sql(id))
    .map(data => fromNullable<QueryResultType>(data))
    .mapRejected(toDbError({ request: name, params: id }));
