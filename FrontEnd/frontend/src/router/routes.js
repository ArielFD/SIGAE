const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "Principal",
        name:"Interfaz_principal",
        component: () => import("pages/Interfaz_principal.vue"),
      },
      //############################Registro############################
      {
        path: "Registrar/actaDeControl",
        name:"actaDeControl",
        meta: { requireAuth: true },
        component: () => import("pages/registrar/acta_de_control.vue"),
      },
      {
        path: "Registrar/riesgoTecnologico",
        name:"riesgoTecnologico",
        meta: { requireAuth: true },
        component: () => import("pages/registrar/riesgo_tecnologico.vue"),
      },
      {
        path: "Registrar/datosDeLaEntidad",
        name:"datosDeLaEntidad",
        meta: { requireAuth: true },
        component: () => import("pages/registrar/datos_de_la_Entidad.vue"),
      },
      {
        path: "Registrar/cargaContaminante",
        name:"cargaContaminante",
        meta: { requireAuth: true },
        component: () => import("pages/registrar/carga_Contaminante.vue"),
      },
      {
        path: "Registrar/desempeñoAmbiental",
        name:"desempeñoAmbiental",
        meta: { requireAuth: true },
        component: () => import("pages/registrar/desempeño_Ambiental.vue"),
      },{
        path: "Registrar/planEnfrentamiento",
        name:"planEnfrentamiento",
        meta: { requireAuth: true },
        component: () => import("pages/registrar/planEnfrentamiento.vue"),
      },
      //############################Reportes############################
      
      {
        path: "reportes/busqueda_Plan_de_Medidas",
        name:"busqueda_Plan_de_Medidas",
        meta: { requireAuth: true },
        component: () => import("pages/reportes/busqueda_Plan_de_Medidas.vue"),
      },
      {
        path: "reportes/plan_enfrentamiento",
        name:"plan_enfrentamiento",
        meta: { requireAuth: true },
        component: () => import("pages/reportes/plan_enfrentamiento.vue"),
      },
      {
        path: "reportes/desempeño_por_Ministerio",
        name:"desempeño_por_Ministerio",
        meta: { requireAuth: true },
        component: () => import("pages/reportes/desempeño_por_Ministerio.vue"),
      },
      {
        path: "reportes/residuales_por_Categoría",
        name:"residuales_por_Categoría",
        meta: { requireAuth: true },
        component: () => import("pages/reportes/residuales_por_Categoría.vue"),
      },
      {
        path: "reportes/sistema_de_Tratamiento",
        name:"sistema_de_Tratamiento",
        component: () => import("pages/reportes/sistema_de_Tratamiento.vue"),
      },
      {
        path: "reportes/trampa_de_grasa",
        name:"trampa_de_grasa",
        meta: { requireAuth: true },
        component: () => import("pages/reportes/trampa_de_grasa.vue"),
      },
      {
        path: "reportes/entidades",
        name:"entidades",
        meta: { requireAuth: true },
        component: () => import("pages/reportes/entidades_.vue"),
      },

      //############################Histogramas############################
      {
        path: "histogramas/indicadores_de_desempeño",
        name:"indicadores_de_desempeño",
        meta: { requireAuth: true },
        component: () => import("pages/histogramas/indicadores_de_desempeño.vue"),
      },
      {
        path: "histogramas/plan_de_medidas",
        name:"plan_de_medidas",
        meta: { requireAuth: true },
        component: () => import("pages/histogramas/plan_de_medidas.vue"),
      },
      {
        path: "histogramas/comparacion_cumplimento_medidas",
        name:"comparacion_cumplimento_medidas",
        meta: { requireAuth: true },
        component: () => import("pages/histogramas/comparacion_cumplimento_medidas.vue"),
      },
      {
        path: "histogramas/comparacion_cumplimento_desempeño",
        name:"comparacion_cumplimento_desempeño",
        meta: { requireAuth: true },
        component: () => import("pages/histogramas/comparacion_cumplimento_desempeño.vue"),
      },
      {
        path: "histogramas/comparacion_parametros_desempeño",
        name:"comparacion_parametros_desempeño",
        meta: { requireAuth: true },
        component: () => import("pages/histogramas/comparacion_parametros_desempeño.vue"),
      },
      {
        path: "histogramas/coordinadores_ambientales",
        name:"coordinadores_ambientales",
        meta: { requireAuth: true },
        component: () => import("pages/histogramas/coordinadores_ambientales.vue"),
      },
      {
        path: "histogramas/cumplimiento_plan_enfrentamiento",
        name:"cumplimiento_plan_enfrentamiento",
        meta: { requireAuth: true },
        component: () => import("pages/histogramas/cumplimiento_plan_enfrentamiento.vue"),
      },
      {
        path: "histogramas/desempeño_ambiental",
        name:"desempeño_ambiental",
        meta: { requireAuth: true },
        component: () => import("pages/histogramas/desempeño_ambiental.vue"),
      },

      //############################Seguridad############################
      {
        path: "seguridad/ver_trazas",
        name:"ver_trazas",
        meta: { requireAuth: true },
        component: () => import("pages/seguridad/ver_trazas.vue"),
      },
      //############################Codificadores############################
      {
        path: "codificadores/organismo",
        name:"organismo",
        meta: { requireAuth: true },
        component: () => import("pages/codificadores/organismo_.vue"),
      },
      {
        path: "codificadores/categoria",
        name:"categoria",
        meta: { requireAuth: true },
        component: () => import("pages/codificadores/categoria_.vue"),
      },
      {
        path: "codificadores/municipio",
        name:"municipio",
        meta: { requireAuth: true },
        component: () => import("pages/codificadores/municipio_.vue"),
      },
      {
        path: "codificadores/unidad",
        name:"unidad",
        meta: { requireAuth: true },
        component: () => import("pages/codificadores/unidad_.vue"),
      },
      {
        path: "codificadores/estado",
        name:"estado",
        meta: { requireAuth: true },
        component: () => import("pages/codificadores/estado_.vue"),
      },
      {
        path: "codificadores/OSDE",
        name:"osde",
        meta: { requireAuth: true },
        component: () => import("pages/codificadores/OSDE_.vue"),
      },
      {
        path: "codificadores/prioridad",
        name:"prioridad",
        meta: { requireAuth: true },
        component: () => import("pages/codificadores/prioridad_.vue"),
      },
      {
        path: "codificadores/periodoDeSalida",
        name:"periodoDeSalida",
        meta: { requireAuth: true },
        component: () => import("pages/codificadores/periodoDeSalida.vue"),
      },
      //############################Administrar############################
      {
        path: "administrar/usuario",
        name:"usuario",
        meta: { requireAuth: true },
        component: () => import("src/pages/administrar/usuario_.vue"),
      }
    ],
  },
  // {
  //   path: "/login",
  //   name:'Login',
  //   component: () => import("pages/Autentificación_al_sistema.vue"),
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
