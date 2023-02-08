'use strict';

/**
 * prioridad controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::prioridad.prioridad", ({ strapi }) => ({
    async getPrioridad(ctx) {
      let prioridads = await strapi.db
        .query("api::prioridad.prioridad")
        .findMany({
          select: ["id", "prioridad"],
        });
        let rows = [];
        for (let i = 0; i < prioridads.length; i++) {
          rows.push({
            name: i + 1,
            id: prioridads[i].id,
            Nombre: prioridads[i].prioridad,
          });
        }
      return rows;
    },
  }));