module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/getSalidas',
        handler: 'salida.getSalidas',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      }
    ]
  }