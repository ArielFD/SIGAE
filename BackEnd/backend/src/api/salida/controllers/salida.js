'use strict';

/**
 * salida controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::salida.salida", ({ strapi }) => ({
    async getSalidas(ctx) {
      let salidas = await strapi.db
        .query("api::salida.salida")
        .findMany({
          select: ["id", "salida"],
        });
        let rows = [];
        for (let i = 0; i < salidas.length; i++) {
          rows.push({
            name: i + 1,
            id: salidas[i].id,
            Nombre: salidas[i].salida,
          });
        }
      return rows;
    },
  }));