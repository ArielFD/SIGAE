"use strict";

/**
 * categoria controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::categoria.categoria",
  ({ strapi }) => ({
    async getCategoria(ctx) {
      let rows = [];
      let categoria = await strapi.db
        .query("api::categoria.categoria")
        .findMany();
      for (let i = 0; i < categoria.length; i++) {
        if(!categoria[i].eliminado){
          rows.push({
            name: i + 1,
            id: categoria[i].id,
            categoria: categoria[i].categoria,
          });
        }
      }
      return rows;
    },
  })
);
