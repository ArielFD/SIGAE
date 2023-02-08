module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/getMunicipios',
        handler: 'municipio.getMunicipios',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      }
    ]
  }