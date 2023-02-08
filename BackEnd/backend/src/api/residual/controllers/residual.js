'use strict';

/**
 * residual controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::residual.residual", ({ strapi }) => ({
    async getResidualId(ctx) {
      const {residual_id} = ctx.params;
      console.log(residual_id);
      let residual = await strapi.db
        .query("api::residual.residual")
        .findOne({
            where: { id: residual_id},
            populate:['categorias','unidads']
        })
        console.log(residual);
        if (residual.categorias.length == 0) residual.categorias.push({ categoria: "-" } )
        if (residual.unidads.length == 0) residual.unidads.push({ unidad: "-" } )
        let entidades
        entidades={
          name: residual.categorias[0].categoria,
          id: residual.id,
          unidad: residual.unidads[0].unidad,
          aprovechamiento: residual.aprovechamiento_cant,
          cantidadGenerada: residual.cantidad,
          disposicionFinal: residual.disposicion,
          fecha: residual.fecha_residual,
          tipoResidual: residual.tipo_residual
        }
      return entidades;
    },
  }));