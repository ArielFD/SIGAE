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