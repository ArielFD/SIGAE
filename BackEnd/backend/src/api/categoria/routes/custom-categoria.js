module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/getCategoria',
        handler: 'categoria.getCategoria',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      }
    ]
  }