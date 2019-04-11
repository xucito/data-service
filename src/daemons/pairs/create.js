const logTaskProgress = require('../utils/logTaskProgress');
const sql = require('./sql');

/** loop :: Object -> Task a b */
const loop = ({ logTask, pg, tableName }) => {
  const logMessages = {
    start: timeStart => ({
      message: '[PAIRS] update started',
      timeStart,
    }),
    error: (e, timeTaken) => ({
      message: '[PAIRS] update error',
      elapsedTime: timeTaken,
      error: e instanceof Error ? e : new Error(e), // Error.toString() -> e.message
    }),
    success: (results, timeTaken) => ({
      message: '[PAIRS] update success',
      elapsedTime: timeTaken,
      rows: results[2].count
    }),
  };

  return logTask(
    logMessages,
    pg.tx(t =>
      t.batch([
        t.none(sql.truncateTable(tableName)),
        t.none(sql.fillTable(tableName)),
        t.one('select count_affected_rows() as count'),
      ])
    )
  );
};

module.exports = ({ logger, pg, tableName }) => {
  const unsafeLogTaskProgress = logTaskProgress(logger);

  return {
    loop: () => loop({ logTask: unsafeLogTaskProgress, pg, tableName }),
  };
};
