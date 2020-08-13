const { of: taskOf } = require('folktale/concurrency/task');

const { createPgDriver } = require('../../../db');
const { loadConfig } = require('../../../loadConfig');
const options = loadConfig();
const create = require('..').default;

const amountAsset = 'TN';
const priceAsset = '4bXds5VEHFQth6AhpF1k6rjvNKzaMf1Yz2Wab9pn9msD';

describe('Candles', () => {
  const service = create({
    drivers: { pg: createPgDriver(options) },
    emitEvent: () => () => null,
    validatePair: () => taskOf(undefined),
  });

  describe('search all candles between 2017-04-12 00:00:00 and 2017-04-12 23:59:59', () => {
    it('should return all Candles correctly for each 1h', done => {
      service
        .search({
          amountAsset,
          priceAsset,
          timeStart: new Date('2017-04-12T00:00:00.000Z'),
          timeEnd: new Date('2017-04-12T23:59:59.999Z'),
          interval: '1h',
          matcher: options.matcher.defaultMatcherAddress,
        })
        .run()
        .listen({
          onResolved: value => {
            expect(value).toMatchSnapshot();
            done();
          },
          onRejected: done.fail,
        });
    });

    it('should return all Candles correctly for each 1d', done => {
      service
        .search({
          amountAsset,
          priceAsset,
          timeStart: new Date('2017-04-12T00:00:00.000Z'),
          timeEnd: new Date('2017-04-12T23:59:59.999Z'),
          interval: '1d',
          matcher: options.matcher.defaultMatcherAddress,
        })
        .run()
        .listen({
          onResolved: value => {
            expect(value).toMatchSnapshot();
            done();
          },
          onRejected: done.fail,
        });
    });
  });
});
