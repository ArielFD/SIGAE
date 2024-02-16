"use strict";

/**
 * traza controller
 */
const { exec } = require("child_process");
const path = require("path");
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::traza.traza", ({ strapi }) => ({
  // async backup(ctx) {
  //   let date=new Date()
  //   date=date.getDate()+""+(date.getMonth()+1)+""+date.getFullYear()
  //   const cmd = await ejecutar(
  //     `PGPASSWORD='America1992' pg_dump -U postgres -Fc SIGAE > ../Database/backup_SIGAE_${date}.sql`
  //   );
  //   console.log("Usuario", cmd);
  //   ctx.body = cmd;
  // },

  async backup(ctx) {
    const date = new Date();
    const dateString = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`;
    const customBackupPath = "../../../../database"; // Cambia esta ruta
    // const filePath = `${__dirname}\\${customBackupPath}\\backup_SIGAE_${dateString}.sql`;
    const filePath = path.join(
      __dirname,
      customBackupPath,
      `backup_SIGAE_${dateString}.sql`
    );

    try {
      const response=await backupDatabase(filePath);
      console.log(response);
      ctx.status = 200;
      ctx.body = "Backup Completed";
    } catch (error) {
      console.error("Error en el respaldo:", error);
      ctx.status = 500;
      ctx.body = "Backup Failed";
    }
  },
}));

// function ejecutar(params) {
//   return new Promise((resolve, reject) => {
//     exec(params, (error, stdout, stderr) => {
//       if (error) {
//         // console.log(`error: ${error.message}`);
//         reject(error.message);
//       }
//       if (stderr) {
//         // console.log(`stderr: ${stderr}`);
//         reject(stderr);
//       }
//       // console.log(`stdout: ${stdout}`);
//       resolve(stdout+"Backup Completed");
//     });
//   });
// }

async function backupDatabase(filePath) {
  const pgDumpPath = "pg_dump"; // Assuming 'pg_dump' is in your PATH
  const pgPassword = "America1992"; // Cambia esto con tu contraseña

  // Configura la variable de entorno PGPASSWORD con la contraseña
  process.env.PGPASSWORD = pgPassword;

  const cmd = `"${pgDumpPath}" -U postgres -Fc SIGAE > "${filePath}"`;

  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      // Restaura la variable de entorno PGPASSWORD a su valor original
      delete process.env.PGPASSWORD;

      if (error) {
        reject(error.message);
      } else if (stderr) {
        reject(stderr);
      } else {
        resolve();
      }
    });
  });
}
