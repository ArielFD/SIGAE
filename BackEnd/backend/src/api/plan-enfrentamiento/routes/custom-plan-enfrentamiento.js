module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/getPlanEnfrentamiento',
        handler: 'plan-enfrentamiento.getPlanEnfrentamiento',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      },
      {
        method: 'GET',
        path: '/getPlanEnfrentamientoCumplimiento',
        handler: 'plan-enfrentamiento.getPlanEnfrentamientoCumplimiento',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      },
      {
        method: 'GET',
        path: '/getPlanEnfrentamientoData',
        handler: 'plan-enfrentamiento.getPlanEnfrentamientoData',
        config: {
            auth:false,
          policies: [],
          prefix: "",
          description: "This is a test endpoint",
        }
      }
    ]
  }