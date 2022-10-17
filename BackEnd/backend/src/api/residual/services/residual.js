'use strict';

/**
 * residual service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::residual.residual');
