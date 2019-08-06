import * as JoiRaw from './joi';
import { Error as errorResult, Ok as okResult } from 'folktale/result';
import { Task, of as taskOf } from 'folktale/concurrency/task';

import { SchemaLike, ValidationError } from 'joi';
import { Monoid } from '../../types/monoid';
import { concatAll } from '../../utils/fp';

export const validate = <ErrorType, T>(
  schema: SchemaLike,
  errorFactory: (e: ValidationError, value: T) => ErrorType,
  value: T
) => {
  const { error } = JoiRaw.validate(value, schema, { convert: false });
  return error
    ? errorResult<ErrorType, T>(errorFactory(error, value))
    : okResult<ErrorType, T>(value);
};

export const Joi = JoiRaw;

export type Validator<TErr extends Error, T> = (value: T) => Task<TErr, T>;

export function getValidationMonoid<TErr extends Error, T>(): Monoid<Validator<TErr, T>> {

  return {
    empty: taskOf,
    concat: (a: Validator<TErr, T>, b: Validator<TErr, T>) =>
      (data: T) => a(data).chain(b)
  }
}

export function getCompoundValidator<TErr extends Error, T>(
  validators: Array<Validator<TErr, T>>
): Validator<TErr, T> {
  
  return concatAll<Validator<TErr, T>>(
    getValidationMonoid()
  )(validators);
}
  
