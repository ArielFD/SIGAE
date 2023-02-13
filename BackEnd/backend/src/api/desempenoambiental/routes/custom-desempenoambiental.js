module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/getDesempeno',
        handler: 'desempenoambiental.getDesempeno',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      },
      {
        method: 'GET',
        path: '/getDesempenoIndicadores',
        handler: 'desempenoambiental.getDesempenoIndicadores',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      },
      {
        method: 'GET',
        path: '/getDesempenoComparacion',
        handler: 'desempenoambiental.getDesempenoComparacion',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      },
      {
        method: 'GET',
        path: '/getIndicadoresDesempeno',
        handler: 'desempenoambiental.getIndicadoresDesempeno',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      },
      {
        method: 'GET',
        path: '/getDesempenoData',
        handler: 'desempenoambiental.getDesempenoData',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      },
      {
        method: 'GET',
        path: '/getDesempenoId/:desempeno_id',
        handler: 'desempenoambiental.getDesempenoId',
        config: {
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      },
    ]
  }