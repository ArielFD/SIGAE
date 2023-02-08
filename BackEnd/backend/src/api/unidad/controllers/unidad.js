'use strict';

/**
 * unidad controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::unidad.unidad", ({ strapi }) => ({
    async getUnidades(ctx) {
      let unidades = await strapi.db
        .query("api::unidad.unidad")
        .findMany({
          select: ["id", "unidad"],
        });
        let rows = [];
      for (let i = 0; i < unidades.length; i++) {
        rows.push({
          name: i + 1,
          id: unidades[i].id,
          Nombre: unidades[i].unidad,
        });
      }
      return rows;
    },
  }));