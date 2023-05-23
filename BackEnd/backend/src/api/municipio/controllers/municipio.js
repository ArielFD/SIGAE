'use strict';

/**
 * municipio controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
    "api::municipio.municipio",
    ({ strapi }) => ({
      async getMunicipios(ctx) {
        let rows = [];
        let municipios = await strapi.db
          .query("api::municipio.municipio")
          .findMany();
        for (let i = 0; i < municipios.length; i++) {
          if(!municipios[i].eliminado){
            rows.push({
              name: i + 1,
              id: municipios[i].id,
              municipio: municipios[i].municipio,
            });
          }
        }
        return rows;
      },
    })
  );