import { get as getResolver } from '../../../_common/createResolver';
import { SchemaLike } from '../../../../utils/validation';

import { validateInput, validateResult } from '../../validation';
import { transformResults } from './transformResult';

import getData from './pg';
import { ServicePresetInitOptions } from 'services/presets/types';
import { NamedTypeFactory } from 'types/createNamedType';
import { identity } from 'ramda';

export type GetByIdPresetOptions<Request, ResponseRaw, ResponseTransformed> = {
  name: string;
  inputSchema: SchemaLike;
  resultSchema: SchemaLike;
  resultTypeFactory: NamedTypeFactory<ResponseTransformed>;
  transformResult: (d: ResponseRaw) => ResponseTransformed;
  sql: (qt: Request) => string;
};

export default <Request, ResponseRaw, ResponseTransformed>({
  name,
  sql,
  inputSchema,
  resultSchema,
  resultTypeFactory,
  transformResult,
}: GetByIdPresetOptions<Request, ResponseRaw, ResponseTransformed>) => ({
  pg,
  emitEvent,
}: ServicePresetInitOptions) =>
  getResolver<Request, Request, ResponseRaw, ResponseTransformed>({
    transformInput: identity,
    transformResult: transformResults<ResponseRaw, ResponseTransformed>(
      resultTypeFactory
    )(transformResult),
    validateInput: value => validateInput(inputSchema, name, value),
    validateResult: value => validateResult(resultSchema, name, value),
    dbQuery: getData<Request, ResponseRaw>({ name, sql }),
  })({ db: pg, emitEvent });
