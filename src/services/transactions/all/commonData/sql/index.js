const { where } = require('../../../../../utils/db/knex/index');
const createSql = require('../../../_common/sql');

const { select, selectByAsset } = require('./query');

const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrders = require('../../../_common/sql/filtersOrder');
const address = where('address');
const assetId = where('asset');

const selectSearchMethod = request => {
  switch (true) {
    case request.assetId && !request.address:
      return selectByAsset();
    // case !request.assetId && request.address:
    //   return selectByAddress();
    // case request.assetId && request.address:
    //   return selectByAssetAndAddress();
    default:
      return select('txs');
  }
};

module.exports = request =>
  createSql({
    query: selectSearchMethod(request),
    filters: { ...commonFilters, address, assetId },
    filtersOrder: [...commonFiltersOrders, 'address', 'assetId'],
  });
