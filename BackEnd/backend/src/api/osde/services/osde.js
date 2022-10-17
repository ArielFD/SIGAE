'use strict';

/**
 * osde service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::osde.osde');
