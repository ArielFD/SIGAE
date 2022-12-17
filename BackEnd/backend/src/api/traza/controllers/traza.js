"use strict";

/**
 * traza controller
 */
const { exec } = require("child_process");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::traza.traza", ({ strapi }) => ({
  async backup(ctx) {
    let date=new Date()
    date=date.getDate()+""+(date.getMonth()+1)+""+date.getFullYear()
    const cmd = await ejecutar(
      `PGPASSWORD='America1992' pg_dump -U postgres -Fc SIGAE > ../Database/backup_SIGAE_${date}.sql`
    );
    console.log("Usuario", cmd);
    ctx.body = cmd;
  },
}));

function ejecutar(params) {
  return new Promise((resolve, reject) => {
    exec(params, (error, stdout, stderr) => {
      if (error) {
        // console.log(`error: ${error.message}`);
        reject(error.message);
      }
      if (stderr) {
        // console.log(`stderr: ${stderr}`);
        reject(stderr);
      }
      // console.log(`stdout: ${stdout}`);
      resolve(stdout+"Backup Completed");
    });
  });
}
