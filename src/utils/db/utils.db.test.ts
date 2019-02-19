import { fromNullable } from 'folktale/maybe';
import { matchRequestsResults } from '.';

const matchFn = (req: number, res: number) => res === req * 10;

describe('Batch query results should', () => {
  it('match ordering of requests', () => {
    expect(
      matchRequestsResults(matchFn, [10, 20, 30], [300, 200, 100])
    ).toEqual([100, 200, 300].map(fromNullable));
  });

  it('insert nulls if no matching response found', () => {
    expect(matchRequestsResults(matchFn, [10, 20, 30], [300, 100])).toEqual(
      [100, null, 300].map(fromNullable)
    );
    expect(matchRequestsResults(matchFn, [10, 20, 30], [])).toEqual(
      [null, null, null].map(fromNullable)
    );
  });

  it('ignore results not matching any request', () => {
    expect(matchRequestsResults(matchFn, [10, 20, 30], [300, 900])).toEqual(
      [null, null, 300].map(fromNullable)
    );
  });
});
