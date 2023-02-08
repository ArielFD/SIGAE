module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/getOsdes',
        handler: 'osde.getOsdes',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      }
    ]
  }