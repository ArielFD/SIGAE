module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/getResidualId/:residual_id',
        handler: 'residual.getResidualId',
        config: {
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      },
    ]
  }