module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/getActacontrol',
        handler: 'actacontrol.getActacontrol',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      },
      {
        method: 'GET',
        path: '/getMedidasActaControl',
        handler: 'actacontrol.getMedidasActaControl',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      },
      {
        method: 'GET',
        path: '/getPlanMedidasActaControl',
        handler: 'actacontrol.getPlanMedidasActaControl',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      },
      {
        method: 'GET',
        path: '/getActaControlData',
        handler: 'actacontrol.getActaControlData',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      },
    ]
  }