import { curry } from 'ramda';

export type EncodeItem = {
  timestamp: Date;
  id: string;
};

export const encode = curry((sort: string, item: EncodeItem) =>
  Buffer.from(`${item.timestamp.toISOString()}::${item.id}::${sort}`).toString(
    'base64'
  )
);

// TODO: return complex type
export const decode = (cursor: string) =>
  Buffer.from(cursor, 'base64')
    .toString('utf8')
    .split('::');
