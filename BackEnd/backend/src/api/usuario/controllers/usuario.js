'use strict';

/**
 * usuario controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::usuario.usuario'
, ({ strapi }) =>  ({

async find(ctx, next, { populate } = {}) {
    console.log("fetchAll");
    const users = await strapi.service('api::usuario.usuario').fetchAll(ctx.query.filters, populate);
    console.log("Usuario",users);
    ctx.body = users
  },

async findOne(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized();
    }

    ctx.body = user
  },
})
);