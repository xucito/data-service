export type Monoid<T> = {
  concat: (a: T, b: T) => T;
  empty: T | null;
};

export const Monoid = <T>(props: Monoid<T>) => ({
  concat: props.concat,
  empty: props.empty,
});
