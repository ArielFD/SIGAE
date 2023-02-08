"use strict";

/**
 * entidad controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::entidad.entidad", ({ strapi }) => ({
  async getEntidades(ctx) {
    let entidades = await strapi.db
      .query("api::entidad.entidad")
      .findMany({
        select: ["id", "entidad"],
        where: { activo: 's'},
      });
    return entidades;
  },
}));
