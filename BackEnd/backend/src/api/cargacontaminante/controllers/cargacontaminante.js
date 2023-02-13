"use strict";

/**
 * cargacontaminante controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::cargacontaminante.cargacontaminante",
  ({ strapi }) => ({
    async getCargacontaminante(ctx) {
      let response = await strapi.db
        .query("api::cargacontaminante.cargacontaminante")
        .findMany({
          populate: true,
          orderBy:{anno:'desc'}
        });
      let count = 1
      let rows = [];
      for (let i = 0; i < response.length; i++) {
        if (response[i].entidad.length > 0) {
          rows.push({
            name: count,
            id: response[i].id,
            entidad: response[i].entidad[0].entidad,
            DB05: response[i].DB05,
            DQ0: response[i].DQ0,
            Flujo: response[i].Flujo,
            Grasas_aceites: response[i].Grasas_aceites,
            Hidrocarburos: response[i].Hidrocarburos,
            NTK: response[i].NTK,
            PH: response[i].PH,
            PIB: response[i].PIB,
            PT: response[i].PT,
            ST: response[i].ST,
            S_SED: response[i].S_SED,
            TEMP: response[i].TEMP,
            anno: response[i].anno,
            COND: response[i].COND,
          });
        }
        count++;
      }

      return rows;
    },
  })
);
