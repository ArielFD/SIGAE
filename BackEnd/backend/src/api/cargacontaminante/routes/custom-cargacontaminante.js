module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/getCargacontaminante',
        handler: 'cargacontaminante.getCargacontaminante',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      },
      {
        method: 'GET',
        path: '/getContaminantes',
        handler: 'cargacontaminante.getContaminantes',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      },
    ]
  }