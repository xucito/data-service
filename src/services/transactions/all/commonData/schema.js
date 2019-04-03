const Joi = require('../../../../utils/validation/joi');

const commonFilters = require('../../../presets/pg/searchWithPagination/commonFilterSchemas');

const result = Joi.object().keys({
  tx_type: Joi.number()
    .min(1)
    .max(15)
    .required(),
  time_stamp: Joi.date().required(),
  id: Joi.string()
    .base58()
    .required(),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,

    sender: Joi.string().base58(),
    assetId: Joi.string().base58(),
    address: Joi.string().base58(),
  })
  .without('sender', ['assetId', 'address'])
  .required();

module.exports = { result, inputSearch };
