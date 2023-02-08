"use strict";

/**
 * osde controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::osde.osde", ({ strapi }) => ({
  async getOsdes(ctx) {
    let osdes = await strapi.db
      .query("api::osde.osde")
      .findMany({ populate: { oace: true } });
    let rows = [];
    for (let i = 0; i < osdes.length; i++) {
      if (osdes[i].oace == null) {
        rows.push({
          name: i + 1,
          id: osdes[i].id,
          Nombre: osdes[i].nombre,
        });
      } else {
        rows.push({
          name: i + 1,
          id: osdes[i].id,
          Nombre: osdes[i].nombre,
          Oace: osdes[i].oace.organismo,
        });
      }
    }
    return rows;
  },
}));
