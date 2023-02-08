module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/getEstados',
        handler: 'estado.getEstados',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      }
    ]
  }