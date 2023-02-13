module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/getEntidades',
        handler: 'entidad.getEntidades',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      },
      {
        method: 'GET',
        path: '/getEntidadesData',
        handler: 'entidad.getEntidadesData',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      }
    ]
  }