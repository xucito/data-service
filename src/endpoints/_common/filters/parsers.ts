import { identity, defaultTo } from 'ramda';

import { parseDate } from '../../../utils/parseDate';
import { parseArrayQuery } from '../../utils/parseArrayQuery';

const dateOrNull = (str: string): Date =>
  parseDate(str).getOrElse(new Date(str));

export const timeStart = dateOrNull;
export const timeEnd = dateOrNull;
export const limit = (v?: string) => parseInt(defaultTo('100')(v));
export const sort = defaultTo('desc');
export const after = identity;
export const ids = parseArrayQuery;
