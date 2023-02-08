module.exports = {
    routes: [
      // {
      //   method: 'GET',
      //   path: '/getOrganismo',
      //   handler: 'organismo.updateUnPublishedData',
      //   config: {
      //       auth:false,
      //     policies: [],
      //     prefix: "",
      //     description: "This is a test endpoint",
      //   }
      // },
      {
        method: 'GET',
        path: '/getOrganismos',
        handler: 'organismo.getOrganismos',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      },
      {
        method: 'GET',
        path: '/getOrganismosOsde',
        handler: 'organismo.getOrganismosOsde',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      }
    ]
  }