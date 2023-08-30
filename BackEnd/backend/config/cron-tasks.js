// module.exports = {
//     '*/1 * * * *': async () => {
//       // fetch articles to publish
//       const draftOrganismoToPublish = await strapi.api.organismo.services.organismo.find({
//         _publicationState: 'preview', // preview returns both draft and published entries
//         published_at_null: true,      // so we add another condition here to filter entries that have not been published
//         publish_at_lt: new Date(),
//       });

//       // update published_at of articles
//       await Promise.all(draftOrganismoToPublish.map(organismo => {
//         return strapi.api.organismo.services.organismo.update(
//           { id: organismo.id },
//           { published_at: new Date() }
//         );
//       }));
//     },
//   };

const cron = require("node-cron");
const { exec } = require("child_process");

cron.schedule("54 13 * * *", async () => {
  const date = new Date();
  const dateString = `${date.getDate()}${
    date.getMonth() + 1
  }${date.getFullYear()}`;
  const customBackupPath =
    "F:\\Trabajo\\Visual Studio Proyects\\FullStack proyects\\SIGAE\\SIGAE\\BackEnd\\backend\\database"; // Cambia esta ruta
  const filePath = `${customBackupPath}\\backup_SIGAE_${dateString}.sql`;

  try {
    await backupDatabase(filePath);
  } catch (error) {
    console.error("Error en el respaldo:", error);
  }
});

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
