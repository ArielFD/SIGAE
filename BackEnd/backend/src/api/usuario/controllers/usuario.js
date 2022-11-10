'use strict';

/**
 * usuario controller
 */

// var ip=require('ip')
  // console.log(ip.address());
  //console.log(local);

  // var os=require('os')
  // var networkInterfaces=os.networkInterfaces()
  // console.log(networkInterfaces);

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