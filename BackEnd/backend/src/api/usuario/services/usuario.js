'use strict';

/**
 * usuario service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::usuario.usuario', ({ strapi }) =>  ({

    fetchAll(params, populate) {
        console.log("fetchAll");
        return strapi.query('plugin::users-permissions.user').findMany({ where: params, populate: ['role'] });
      },
    })
    );