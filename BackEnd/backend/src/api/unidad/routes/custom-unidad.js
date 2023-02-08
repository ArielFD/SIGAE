module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/getUnidades',
        handler: 'unidad.getUnidades',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      }
    ]
  }