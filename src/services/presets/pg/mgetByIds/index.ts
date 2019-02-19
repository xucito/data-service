import { identity } from 'ramda';

import createResolver from '../../../_common/createResolver';

import { validateInput, validateResult } from '../../validation';
import transformResultFn from './transformResult';

import getData from './pg';

module.exports = ({
  name,
  sql,
  inputSchema,
  resultSchema,
  resultTypeFactory,
  matchRequestResult,
  transformResult,
}) => ({ pg, emitEvent }) =>
  createResolver.mget({
    transformInput: identity,
    transformResult: transformResultFn(resultTypeFactory)(transformResult),
    validateInput: validateInput(inputSchema, name),
    validateResult: validateResult(resultSchema, name),
    dbQuery: getData({ name, sql, matchRequestResult }),
  })({ db: pg, emitEvent });
