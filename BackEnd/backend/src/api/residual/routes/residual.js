'use strict';

/**
 * residual router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::residual.residual');
