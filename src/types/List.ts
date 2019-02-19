export type List<T> = {
  __type: 'list';
  data: T[];
  [key: string]: any;
};

export const List = <T>(items: T[] = [], meta: any = {}): List<T> => ({
  __type: 'list',
  ...meta,
  data: items,
});
