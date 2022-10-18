const routes = [
  {
    path: "/",
    meta: { requireAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "Interfaz_principal",
        component: () => import("pages/Interfaz_principal.vue"),
      },
      //############################Registro############################
      {
        path: "Registrar/actaDeControl",
        name:"actaDeControl",
        component: () => import("pages/registrar/acta_de_control.vue"),
      },
      {
        path: "Registrar/riesgoTecnologico",
        name:"riesgoTecnologico",
        component: () => import("pages/registrar/riesgo_tecnologico.vue"),
      },
      {
        path: "Registrar/datosDeLaEntidad",
        name:"datosDeLaEntidad",
        component: () => import("pages/registrar/datos_de_la_Entidad.vue"),
      },
      {
        path: "Registrar/cargaContaminante",
        name:"cargaContaminante",
        component: () => import("pages/registrar/carga_Contaminante.vue"),
      },
      {
        path: "Registrar/desempeñoAmbiental",
        name:"desempeñoAmbiental",
        component: () => import("pages/registrar/desempeño_Ambiental.vue"),
      },{
        path: "Registrar/planEnfrentamiento",
        name:"planEnfrentamiento",
        component: () => import("pages/registrar/planEnfrentamiento.vue"),
      },
      //############################Reportes############################
      {
        path: "reportes/busqueda_Plan_de_Medidas",
        name:"busqueda_Plan_de_Medidas",
        component: () => import("pages/reportes/busqueda_Plan_de_Medidas.vue"),
      },
      {
        path: "reportes/desempeño_por_Ministerio",
        name:"desempeño_por_Ministerio",
        component: () => import("pages/reportes/desempeño_por_Ministerio.vue"),
      },
      {
        path: "reportes/residuales_por_Categoría",
        name:"residuales_por_Categoría",
        component: () => import("pages/reportes/residuales_por_Categoría.vue"),
      },
      {
        path: "reportes/sistema_de_Tratamiento",
        name:"sistema_de_Tratamiento",
        component: () => import("pages/reportes/sistema_de_Tratamiento.vue"),
      },
      {
        path: "reportes/histogramas",
        name:"histogramas",
        component: () => import("pages/reportes/histogramas_.vue"),
      },
      {
        path: "reportes/entidades",
        name:"entidades",
        component: () => import("pages/reportes/entidades_.vue"),
      },
      //############################Seguridad############################
      {
        path: "seguridad/ver_trazas",
        name:"ver_trazas",
        component: () => import("pages/seguridad/ver_trazas.vue"),
      },
      //############################Codificadores############################
      {
        path: "codificadores/organismo",
        name:"organismo",
        component: () => import("pages/codificadores/organismo_.vue"),
      },
      {
        path: "codificadores/categoria",
        name:"categoria",
        component: () => import("pages/codificadores/categoria_.vue"),
      },
      {
        path: "codificadores/municipio",
        name:"municipio",
        component: () => import("pages/codificadores/municipio_.vue"),
      },
      {
        path: "codificadores/unidad",
        name:"unidad",
        component: () => import("pages/codificadores/unidad_.vue"),
      },
      {
        path: "codificadores/estado",
        name:"estado",
        component: () => import("pages/codificadores/estado_.vue"),
      },
      {
        path: "codificadores/OSDE",
        name:"osde",
        component: () => import("pages/codificadores/OSDE_.vue"),
      },
      {
        path: "codificadores/prioridad",
        name:"prioridad",
        component: () => import("pages/codificadores/prioridad_.vue"),
      },
      {
        path: "codificadores/periodoDeSalida",
        name:"periodoDeSalida",
        component: () => import("pages/codificadores/periodoDeSalida.vue"),
      },
      //############################Administrar############################
      {
        path: "administrar/usuario",
        name:"usuario",
        component: () => import("src/pages/administrar/usuario_.vue"),
      }
    ],
  },
  {
    path: "/login",
    name:'Login',
    component: () => import("pages/Autentificación_al_sistema.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
