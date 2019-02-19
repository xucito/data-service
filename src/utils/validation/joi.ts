import * as JoiRaw from 'joi';

import { BigNumber } from '@waves/data-entities';
import * as Cursor from '../../services/_common/pagination/cursor';
import { base58 as base58Regex, interval as intervalRegex } from '../regex';
import Interval from '../../types/Interval';

export declare type JoiType = typeof JoiRaw;

export interface ExtendedObjectSchema extends JoiRaw.ObjectSchema {
  bignumber(): this;
  int64(): this;
}

export interface ExtendedStringSchema extends JoiRaw.StringSchema {
  cursor(): this;
  base58(): this;
  period(): this;
  accept(v: string[]): this;
  max(v: string): this;
  max(v: number): this;
  min(v: string): this;
  min(v: number): this;
  divisibleBy(v: string): this;
}

export interface PeriodSchema extends JoiRaw.StringSchema {
  accept(): this;
  max(): this;
  divisibleBy(): this;
}

export interface ExtendedSchema extends JoiType {
  object(): ExtendedObjectSchema;
  string(): ExtendedStringSchema;
  period(): PeriodSchema;
}

export * from 'joi';
export default <ExtendedSchema>JoiRaw.extend([
  {
    base: JoiRaw.string(),
    name: 'string',
    language: {
      base58: 'must be a valid base58 string',
      period: {
        value: 'must be a valid interval value',
        accept: 'must be in accepted',
        divisibleBy: 'must be divisible by divider',
        min: 'must be more then min',
        max: 'must be less then max',
      },
    },
    rules: [
      {
        name: 'base58',
        validate(_, value, state, options) {
          // assert base64
          if (
            JoiRaw.string()
              .regex(base58Regex)
              .validate(value).error
          ) {
            return this.createError('string.base58', { value }, state, options);
          }
          return value;
        },
      },
      {
        name: 'cursor',
        validate(_, value, state, options) {
          // assert base64
          if (
            JoiRaw.string()
              .base64({ paddingRequired: false })
              .validate(value).error
          ) {
            return this.createError('string.base64', { value }, state, options);
          }

          const [ts, id, sort] = Cursor.decode(value);
          if (!ts || !id || !sort) {
            // Generate an error, state and options need to be passed
            return this.createError('string.cursor', { value }, state, options);
          }
          return value; // Everything is OK
        },
      },
      {
        name: 'period',
        validate(_, value, state, options) {
          if (
            JoiRaw.string()
              .regex(intervalRegex)
              .validate(value).error
          ) {
            return this.createError(
              'string.period.value',
              { value },
              state,
              options
            );
          }

          return value;
        },
      },
      {
        name: 'accept',
        params: {
          accept: JoiRaw.array(),
        },
        validate(params, value, state, options) {
          const interval = Interval.from(value);

          return interval.matchWith({
            Ok: ({ value: i }) =>
              params.accept.indexOf(i.unit) === -1
                ? this.createError(
                    'string.period.accept',
                    { value },
                    state,
                    options
                  )
                : value,
            Error: ({ value: e }) =>
              this.createError(
                'string.period.accept',
                { value, e },
                state,
                options
              ),
          });
        },
      },
      {
        name: 'divisibleBy',
        params: {
          divisibleBy: JoiRaw.string().regex(intervalRegex),
        },
        validate(params, value, state, options) {
          const interval = Interval.from(value);
          const divisibleByInterval = Interval.from(params.divisibleBy);

          return interval.matchWith({
            Ok: ({ value: i }) =>
              divisibleByInterval.matchWith({
                Ok: ({ value: d }) =>
                  i.div(d) % 1 !== 0
                    ? this.createError(
                        'string.period.divisibleBy',
                        { value },
                        state,
                        options
                      )
                    : value,
                Error: ({ value: e }) =>
                  this.createError(
                    'string.period.divisibleBy',
                    { value, e },
                    state,
                    options
                  ),
              }),
            Error: ({ value: e }) =>
              this.createError(
                'string.period.interval',
                { value, e },
                state,
                options
              ),
          });
        },
      },
      {
        name: 'min',
        params: {
          min: JoiRaw.string().regex(intervalRegex),
        },
        validate(params, value, state, options) {
          const interval = Interval.from(value);
          const minInterval = Interval.from(params.min);

          return interval.matchWith({
            Ok: ({ value: i }) =>
              minInterval.matchWith({
                Ok: ({ value: d }) =>
                  d.length > i.length
                    ? this.createError(
                        'string.period.minInterval',
                        { value },
                        state,
                        options
                      )
                    : value,
                Error: ({ value: e }) =>
                  this.createError(
                    'string.period.minInterval',
                    { value, e },
                    state,
                    options
                  ),
              }),
            Error: ({ value: e }) =>
              this.createError(
                'string.period.interval',
                { value, e },
                state,
                options
              ),
          });
        },
      },
      {
        name: 'max',
        params: {
          max: JoiRaw.string().regex(intervalRegex),
        },
        validate(params, value, state, options) {
          const interval = Interval.from(value);
          const maxInterval = Interval.from(params.max);

          return interval.matchWith({
            Ok: ({ value: i }) =>
              maxInterval.matchWith({
                Ok: ({ value: d }) =>
                  d.length < i.length
                    ? this.createError(
                        'string.period.maxInterval',
                        { value },
                        state,
                        options
                      )
                    : value,
                Error: ({ value: e }) =>
                  this.createError(
                    'string.period.maxInterval',
                    { value, e },
                    state,
                    options
                  ),
              }),
            Error: ({ value: e }) =>
              this.createError(
                'string.period.interval',
                { value, e },
                state,
                options
              ),
          });
        },
      },
    ],
  },
  {
    base: JoiRaw.object(),
    name: 'object',
    language: {
      bignumber: {
        int64: 'The number {{value}} is outside int64 range',
      },
    },
    rules: [
      {
        name: 'bignumber',
        validate(_, value, state, options) {
          if (!(value instanceof BigNumber)) {
            return this.createError(
              'object.type',
              { type: BigNumber },
              state,
              options
            );
          }
          return value;
        },
      },
      {
        name: 'int64',
        validate(_, value, state, options) {
          const BOUNDS = {
            LOWER: new BigNumber('-9223372036854775808'),
            UPPER: new BigNumber('9223372036854775807'),
          };

          if (
            !(value instanceof BigNumber) ||
            value.isLessThan(BOUNDS.LOWER) ||
            value.isGreaterThan(BOUNDS.UPPER)
          ) {
            return this.createError(
              'object.bignumber.int64',
              { value: value.toString() },
              state,
              options
            );
          }
          return value;
        },
      },
    ],
  },
]);
