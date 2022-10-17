"use strict";

/**
 * organismo controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::organismo.organismo",
  ({ strapi }) => ({
    async updateUnPublishedData(ctx) {
      console.log("Estoy aqui!!!!!");
      let arr=[];
      let temp=await strapi.db.query("api::trampa-grasa.trampa-grasa").findMany({
        where: { publishedAt: null },
      });

      temp.forEach(element => {
        arr.push(element.id)
      });

      for (let temp = 0; temp < arr.length; temp++) {
        //   const element = array[temp];
        console.log(
          await strapi.db.query("api::trampa-grasa.trampa-grasa").update({
            where: { id: arr[temp] },
            data: {
              publishedAt: new Date().toISOString(),
            },
          })
        );
      }
    },
  })
);
