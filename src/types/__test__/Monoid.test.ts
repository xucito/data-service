import { monoid } from '../Monoid';

describe('Monoid type should be', () => {
  it('constructed from object', () => {
    expect(monoid({ concat: (a, b) => a + b, empty: 0 })).toBeInstanceOf(
      Object
    );
  });
});
