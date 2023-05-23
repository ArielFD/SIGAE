'use strict';

/**
 * estado controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController(
    "api::estado.estado",
    ({ strapi }) => ({
      async getEstados(ctx) {
        let rows = [];
        let estados = await strapi.db
          .query("api::estado.estado")
          .findMany();
        for (let i = 0; i < estados.length; i++) {
          if(!estados[i].eliminado){
            rows.push({
              name: i + 1,
              id: estados[i].id,
              estado: estados[i].estado,
            });
          }
        }
        return rows;
      },
    })
  );