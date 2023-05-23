'use strict';

/**
 * prioridad controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::prioridad.prioridad", ({ strapi }) => ({
    async getPrioridad(ctx) {
      let prioridads = await strapi.db
        .query("api::prioridad.prioridad")
        .findMany();
        let rows = [];
        for (let i = 0; i < prioridads.length; i++) {
          if(!prioridads[i].eliminado){
            rows.push({
              name: i + 1,
              id: prioridads[i].id,
              Nombre: prioridads[i].prioridad,
            });
          }
        }
      return rows;
    },
  }));