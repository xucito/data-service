const pg = require('knex')({ client: 'pg' });

const select = tableName =>
  pg({ t: tableName }).select({
    tx_type: 't.tx_type',
    id: 't.id',
    time_stamp: 't.time_stamp',
  });

module.exports = { select };
