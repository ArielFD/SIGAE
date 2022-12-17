module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/backup',
        handler: 'traza.backup',
        config: {
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      }
    ]
  }
