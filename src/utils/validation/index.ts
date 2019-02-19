import JoiRaw, { SchemaLike, ValidationError } from './joi';
import { Error, Ok } from 'folktale/result';

export type ValidationErrorFactory<ErrorType, T> = (
  e: ValidationError,
  value: T
) => ErrorType;

export const validate = <ErrorType, T>(
  schema: SchemaLike,
  errorFactory: ValidationErrorFactory<ErrorType, T>,
  value: T
) => {
  const { error } = JoiRaw.validate(value, schema, { convert: false });
  return error
    ? Error<ErrorType, T>(errorFactory(error, value))
    : Ok<ErrorType, T>(value);
};

export * from './joi';
