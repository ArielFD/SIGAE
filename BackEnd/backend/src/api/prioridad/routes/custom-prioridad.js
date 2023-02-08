module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/getPrioridad',
        handler: 'prioridad.getPrioridad',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      }
    ]
  }