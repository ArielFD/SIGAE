"use strict";

/**
 * organismo controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::organismo.organismo",
  ({ strapi }) => ({
    // async updateUnPublishedData(ctx) {
    //   console.log("Estoy aqui!!!!!");
    //   let arr = [];
    //   let temp = await strapi.db
    //     .query("api::trampa-grasa.trampa-grasa")
    //     .findMany({
    //       where: { publishedAt: null },
    //     });

    //   temp.forEach((element) => {
    //     arr.push(element.id);
    //   });

    //   for (let temp = 0; temp < arr.length; temp++) {
    //     //   const element = array[temp];
    //     console.log(
    //       await strapi.db.query("api::trampa-grasa.trampa-grasa").update({
    //         where: { id: arr[temp] },
    //         data: {
    //           publishedAt: new Date().toISOString(),
    //         },
    //       })
    //     );
    //   }
    // },
    async getOrganismos(ctx) {
      let organismos = await strapi.db
        .query("api::organismo.organismo")
        .findMany({ select: ["id", "organismo","eliminado"] });
        let rows = [];
        for (let i = 0; i < organismos.length; i++) {
          if(!organismos[i].eliminado){
            rows.push({
              name: i + 1,
              id: organismos[i].id,
              organismo: organismos[i].organismo,
            });
          }
        }
      return rows;
    },

    async getOrganismosOsde(ctx) {
      let organismos = await strapi.db
        .query("api::organismo.organismo")
        .findMany({ populate: { osdes: true } });
      console.log(organismos);
      let rows = [];
      for (let i = 0; i < organismos.length; i++) {
        if(!organismos[i].eliminado){
          let arr = []
          let arrEdit = []
          for (let index = 0; index < organismos[i].osdes.length; index++) {
            const element = organismos[i].osdes[index].nombre;
            const id = organismos[i].osdes[index].id;
            arr.push(element)
            arrEdit.push({ id })
          }
          rows.push({
            name: i + 1,
            id: organismos[i].id,
            Nombre: organismos[i].organismo,
            Osde: arr.join(", "),
            arrOsde: arrEdit
          });
        }
      }
      return rows;
    },
  })
);
