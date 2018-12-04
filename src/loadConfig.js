const checkEnv = require('check-env');

const { memoizeWith, always } = require('ramda');

const loadConfig = () => {
  // assert all necessary env vars are set
  checkEnv(['PGHOST', 'PGDATABASE', 'PGUSER', 'PGPASSWORD']);

  return {
    port: parseInt(process.env.PORT) || 3000,
    postgresHost: process.env.PGHOST,
    postgresPort: parseInt(process.env.PGPORT) || 5432,
    postgresDatabase: process.env.PGDATABASE,
    postgresUser: process.env.PGUSER,
    postgresPassword: process.env.PGPASSWORD,
    postgresPoolSize: parseInt(process.env.PGPOOLSIZE) || 20,

    redisPort: parseInt(process.env.REDIS_PORT) || undefined,
    redisHost: process.env.REDIS_HOST,
    redisPassword: process.env.REDIS_PASSWORD,

    logLevel: process.env.LOG_LEVEL || 'info',

    candlesUpdateInterval: process.env.CANDLES_UPDATE_INTERVAL_MS || 2500,
    candlesUpdateTimeout: process.env.CANDLES_UPDATE_TIMEOUT_MS || 20000,
    candlesTruncateTable: process.env.CANDLES_TRUNCATE_TABLE || false,
    candlesTableName: process.env.CANDLES_TABLE_NAME || 'candles',
  };
};

module.exports = memoizeWith(always('config'), loadConfig);
