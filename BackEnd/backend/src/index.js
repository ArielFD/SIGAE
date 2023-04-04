'use strict';
// import knex from 'knex'

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // async function updateUnPublishedElements(ctx) {
    //   console.log("Estoy aqui!!!!!");
    //   let arr=[];
    //   let temp=await strapi.db.query("api::unidad.unidad").findMany({
    //     where: { publishedAt: null },
    //   });

    //   temp.forEach(element => {
    //     arr.push(element.id)
    //   });

    //   console.log(arr);

    //   for (let temp = 0; temp < arr.length; temp++) {
    //     //   const element = array[temp];
    //     console.log(
    //       await strapi.db.query("api::unidad.unidad").update({
    //         where: { id: arr[temp] },
    //         data: {
    //           publishedAt: new Date().toISOString(),
    //         },
    //       })
    //     );
    //   }
    // }
  },
};
