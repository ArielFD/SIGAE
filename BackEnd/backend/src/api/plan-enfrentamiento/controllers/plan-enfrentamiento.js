"use strict";

/**
 * plan-enfrentamiento controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::plan-enfrentamiento.plan-enfrentamiento",
  ({ strapi }) => ({
    async getPlanEnfrentamiento(ctx) {
      let data = ctx.query.filters;
      let enfrentamiento = await strapi.db
        .query("api::plan-enfrentamiento.plan-enfrentamiento")
        .findMany({
          where: {
            fecha: {
              $containsi: data[0],
            },
          },
          populate: {
            entidad: {
              populate: ["organismo", "osde"],
            //   where: {
            //     activo: {
            //       $containsi: "s",
            //     },
            //   },
            },
          },
        });

      let data1 = [], data2 = [], data3 = []
      let rows=[]

      for (let i = 0; i < enfrentamiento.length; i++) {
        if (enfrentamiento[i].entidad != null) {
            if (enfrentamiento[i].entidad.organismo.length == 0) enfrentamiento[i].entidad.organismo[0] = { organismo: "-"  }
            if (enfrentamiento[i].entidad.osde == null) {
                enfrentamiento[i].entidad.osde = { nombre: "-" } 
            }
            rows.push({
                medidas: enfrentamiento[i].medidas,
                cumplidas: enfrentamiento[i].cumplidas,
                organismo: enfrentamiento[i].entidad.organismo[0].organismo,
                osde: enfrentamiento[i].entidad.osde.nombre
            });

        }
    }

    if (data[1] == "OACE") {
        for (let index = 0; index < data[2].split(",").length; index++) {
            rows.forEach(element => {
                if (data[2].split(",")[index] == element.organismo) {
                    if (!data1[index]) {
                        data1[index] = element.medidas
                    }
                    else {
                        data1[index] = data1[index] + element.medidas
                    }
                    if (!data2[index]) {
                        data2[index] = element.cumplidas
                    }
                    else {
                        data2[index] = data2[index] + element.cumplidas
                    }
                    data3[index] = (data2[index] / data1[index] * 100).toFixed(2)
                }
            });
        }

        for (let index = 0; index < data[2].split(",").length; index++) {
            if (!data3[index]) data3[index] = 0
            if (data3[index] == 'NaN') data3[index] = 0
        }
    }
    else {
        for (let index = 0; index < data[3].split(",").length; index++) {
            rows.forEach(element => {
                if (data[3].split(",")[index] == element.osde) {
                    if (!data1[index]) {
                        data1[index] = element.medidas
                    }
                    else {
                        data1[index] = data1[index] + element.medidas
                    }
                    if (!data2[index]) {
                        data2[index] = element.cumplidas
                    }
                    else {
                        data2[index] = data2[index] + element.cumplidas
                    }
                    data3[index] = (data2[index] / data1[index] * 100).toFixed(2)
                }
            });
        }

        for (let index = 0; index < data[3].split(",").length; index++) {
            if (!data3[index]) data3[index] = 0
            if (data3[index] == 'NaN') data3[index] = 0
        }

    }

      return data3;
    },

    async getPlanEnfrentamientoCumplimiento(ctx) {
        let data = ctx.query.filters;
        let enfrentamiento = await strapi.db
          .query("api::plan-enfrentamiento.plan-enfrentamiento")
          .findMany({
            where: {
              fecha: {
                $containsi: data[0],
              },
            },
            populate: {
              entidad: {
                populate: ["organismo", "osde"],
              //   where: {
              //     activo: {
              //       $containsi: "s",
              //     },
              //   },
              },
            },
          });
  
        let data1 = [], data2 = [], data3 = []
        let rows=[]
  
        for (let i = 0; i < enfrentamiento.length; i++) {
            if (enfrentamiento[i].entidad != null) {
                if (enfrentamiento[i].entidad.organismo.length == 0) enfrentamiento[i].entidad.organismo[0] =  { organismo: "-" } 
                if (enfrentamiento[i].entidad.osde == null) {
                    enfrentamiento[i].entidad.osde =  { nombre: "-" } 
                }
                rows.push({
                    medidas: enfrentamiento[i].medidas,
                    cumplidas: enfrentamiento[i].cumplidas,
                    organismo: enfrentamiento[i].entidad.organismo[0].organismo,
                    osde: enfrentamiento[i].entidad.osde.nombre
                });

            }
        }

        if (data[1] == "OACE") {
            for (let index = 0; index < data[2].split(",").length; index++) {
                rows.forEach(element => {
                    if (data[2].split(",")[index] == element.organismo) {
                        if (!data1[index]) {
                            data1[index] = element.medidas
                        }
                        else {
                            data1[index] = data1[index] + element.medidas
                        }
                        if (!data2[index]) {
                            data2[index] = element.cumplidas
                        }
                        else {
                            data2[index] = data2[index] + element.cumplidas
                        }
                    }
                });
            }

            for (let index = 0; index < data[2].split(",").length; index++) {
                if (!data1[index]) data1[index] = 0
                if (!data2[index]) data2[index] = 0
            } 
        }
        else {
            for (let index = 0; index < data[3].split(",").length; index++) {
                rows.forEach(element => {
                    if (data[3].split(",")[index] == element.osde) {
                        if (!data1[index]) {
                            data1[index] = element.medidas
                        }
                        else {
                            data1[index] = data1[index] + element.medidas
                        }
                        if (!data2[index]) {
                            data2[index] = element.cumplidas
                        }
                        else {
                            data2[index] = data2[index] + element.cumplidas
                        }
                    }
                });
            }

            for (let index = 0; index < data[3].split(",").length; index++) {
                if (!data1[index]) data1[index] = 0
                if (!data2[index]) data2[index] = 0
            }
        }
        
        data3.push({data1})
        data3.push({data2})
  
        return data3;
      },
  })
);
