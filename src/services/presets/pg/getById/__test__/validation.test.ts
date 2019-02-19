import { of as taskOf, Task } from 'folktale/concurrency/task';
import { of as maybeOf } from 'folktale/maybe';
import { always, identity } from 'ramda';

import Joi, { SchemaLike } from '../../../../../utils/validation/joi';

import { TransactionData, Transaction } from '../../../../../types';
import getByIdPreset from '..';
import { inputGet as input } from '../inputSchema';
import { PgDriver } from 'db/driver';
import { AppError, ResolverError } from '../../../../../errorHandling';
import { NamedType } from 'types/createNamedType';

const createService = (resultSchema: SchemaLike) =>
  getByIdPreset<string, string, TransactionData>({
    name: 'some_name',
    sql: identity,
    inputSchema: input,
    resultSchema,
    transformResult: d => ({}),
    resultTypeFactory: Transaction,
  })({
    pg: { oneOrNone: id => taskOf(maybeOf(id)) } as PgDriver,
    emitEvent: always(identity),
  });

const assertValidationError = (
  done: (text?: string) => void,
  r: (req: string) => Task<AppError, NamedType<TransactionData>>,
  v?: any
) =>
  r(v)
    .run()
    .promise()
    .then(() => done('Wrong branch, error'))
    .catch(e => {
      expect(e.type).toBe('ValidationError');
      done();
    });

describe('getById', () => {
  describe('input validation', () => {
    // passing result validation
    const service = createService(Joi.any());

    it('fails if id param is not provided', done =>
      assertValidationError(done, service));
    it('fails if id param is not a string', done => {
      assertValidationError(done, service, null);
      assertValidationError(done, service, 1);
      assertValidationError(done, service, {});
      assertValidationError(done, service, []);
    });
    it('passes if id param is a string', done =>
      service('someidgoeshere2942415')
        .run()
        .listen({
          onResolved: x => {
            expect(x.__type).toBe('transaction');
            done();
          },
        }));
  });

  describe('result validation', () => {
    // failing result validation
    const service = createService(Joi.any().valid('qweasd'));

    it('applies schema correctly', done =>
      service('someidgoeshere2942415')
        .run()
        .listen({
          onRejected: e => {
            expect(e).toBeInstanceOf(ResolverError);
            done();
          },
        }));
  });
});
