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
  
  async getEntidadesData(ctx) {
    let entidades = await strapi.db
      .query("api::entidad.entidad")
      .findMany({
        where: { activo: 's'},
        populate:true
      });

      let rows=[]
      let count=1

      for (let i = 0; i < entidades.length; i++) {
        if (entidades[i].organismo.length == 0) entidades[i].organismo.push({ organismo: "-" })
        if (entidades[i].municipio.length == 0) entidades[i].municipio.push({ municipio: "-" } )
        if (entidades[i].salida == null) entidades[i].salida ={ salida: "-" } 
        if (entidades[i].prioridad == null) entidades[i].prioridad = { prioridad: "-" } 
        if (entidades[i].osde == null) entidades[i].osde = { nombre: "-" } 
        rows.push({
          name: count,
          id: entidades[i].id,
          entidad: entidades[i].entidad,
          municipio: entidades[i].municipio[0].municipio,
          trabajadores: entidades[i].cant_trabajadores,
          objeto: entidades[i].objeto_social,
          coordinador: entidades[i].nomb_coordinador,
          director: entidades[i].nomb_director,
          telefono: entidades[i].num_telefono,
          organismo: entidades[i].organismo[0].organismo,
          fuente: entidades[i].tipo_fuente,
          prioridad: entidades[i].prioridad.prioridad,
          salida: entidades[i].salida.salida,
          osde: entidades[i].osde.nombre,
          referencia: entidades[i].referencia,
          PIB: entidades[i].PIB,
          latitud: entidades[i].latitud,
          longitud: entidades[i].longitud
        });
        count++
      }

    return rows;
  }
}));
