const { compose } = require('ramda');

const createSql = require('../../_common/sql/index');

const { select, selectOnFiltered } = require('./query');
const { filters, filtersOrder } = require('./filters');

const queryAfterFilters = {
  get: selectOnFiltered,
  mget: selectOnFiltered,
  search: (q, fValues) =>
    compose(filters.sortOuter(fValues.sort), selectOnFiltered)(q),
};

module.exports = createSql({
  query: select,
  filters,
  filtersOrder,
  queryAfterFilters,
});
