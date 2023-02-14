"use strict";

/**
 * desempenoambiental controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::desempenoambiental.desempenoambiental",
  ({ strapi }) => ({
    async getDesempeno(ctx) {
      let data = ctx.query.filters;
      let desempeño = await strapi.db
        .query("api::desempenoambiental.desempenoambiental")
        .findMany({
          where: {
            anno: {
              $containsi: data[0],
            },
          },
          populate: {
            entidad: {
              populate: ["organismo", "osde"],
              //   where: {
              //     activo: {
              //       $containsi: "s",
              //     },
              //   },
            },
          },
        });

      let data1 = [],
        data2 = [],
        data3 = [];
      let rows = [];

      for (let i = 0; i < desempeño.length; i++) {
        if (desempeño[i].entidad.length > 0) {
          if (desempeño[i].entidad[0].organismo.length == 0)
            desempeño[i].entidad.organismo[0] = { organismo: "-" };
          if (desempeño[i].entidad[0].osde == null) {
            desempeño[i].entidad[0].osde = { nombre: "-" };
          }

          rows.push({
            coordinador: desempeño[i].exist_coordinador,
            diagnostico: desempeño[i].exist_diagnostico,
            politica: desempeño[i].exist_politica,
            indicadores: desempeño[i].exist_indicadores,
            plan: desempeño[i].exist_plan_accion,
            legislacion: desempeño[i].exist_legislacion,
            capacitacion: desempeño[i].exist_plan_capacitacion,
            acciones: desempeño[i].exist_accionespml,
            programa: desempeño[i].exist_program_gestionambiental,
            recurso: desempeño[i].exist_recurso_financiero,
            aprovechamiento: desempeño[i].aprovechamiento_economico,
            sistema: desempeño[i].exist_sistem_tratamiento,
            carga: desempeño[i].disminucion_carga_contaminante,
            organismo: desempeño[i].entidad[0].organismo[0].organismo,
            oace: desempeño[i].entidad[0].osde.nombre,
          });
        }
      }

      for (let index = 0; index < data[1].split(",").length; index++) {
        rows.forEach((element) => {
          if ("Coordinador" == data[1].split(",")[index]) {
            if (!data1[index]) {
              data1[index] = element.coordinador;
            } else {
              data1[index] += element.coordinador;
            }
            if (!data2[index]) {
              data2[index] = 1;
            } else {
              data2[index] += 1;
            }
            data3[index] = ((data1[index] / data2[index]) * 100).toFixed(2);
          }
          if ("Diagnostico" == data[1].split(",")[index]) {
            if (!data1[index]) {
              data1[index] = element.diagnostico;
            } else {
              data1[index] += element.diagnostico;
            }
            if (!data2[index]) {
              data2[index] = 1;
            } else {
              data2[index] += 1;
            }
            data3[index] = ((data1[index] / data2[index]) * 100).toFixed(2);
          }
          if ("Politica" == data[1].split(",")[index]) {
            if (!data1[index]) {
              data1[index] = element.politica;
            } else {
              data1[index] += element.politica;
            }
            if (!data2[index]) {
              data2[index] = 1;
            } else {
              data2[index] += 1;
            }
            data3[index] = ((data1[index] / data2[index]) * 100).toFixed(2);
          }
          if ("Indicadores" == data[1].split(",")[index]) {
            if (!data1[index]) {
              data1[index] = element.indicadores;
            } else {
              data1[index] += element.indicadores;
            }
            if (!data2[index]) {
              data2[index] = 1;
            } else {
              data2[index] += 1;
            }
            data3[index] = ((data1[index] / data2[index]) * 100).toFixed(2);
          }
          if ("Plan de accion" == data[1].split(",")[index]) {
            if (!data1[index]) {
              data1[index] = element.plan;
            } else {
              data1[index] += element.plan;
            }
            if (!data2[index]) {
              data2[index] = 1;
            } else {
              data2[index] += 1;
            }
            data3[index] = ((data1[index] / data2[index]) * 100).toFixed(2);
          }
          if ("Legislacion" == data[1].split(",")[index]) {
            if (!data1[index]) {
              data1[index] = element.legislacion;
            } else {
              data1[index] += element.legislacion;
            }
            if (!data2[index]) {
              data2[index] = 1;
            } else {
              data2[index] += 1;
            }
            data3[index] = ((data1[index] / data2[index]) * 100).toFixed(2);
          }
          if ("Plan de capacitacion" == data[1].split(",")[index]) {
            if (!data1[index]) {
              data1[index] = element.capacitacion;
            } else {
              data1[index] += element.capacitacion;
            }
            if (!data2[index]) {
              data2[index] = 1;
            } else {
              data2[index] += 1;
            }
            data3[index] = ((data1[index] / data2[index]) * 100).toFixed(2);
          }
          if ("Acciones PML" == data[1].split(",")[index]) {
            if (!data1[index]) {
              data1[index] = element.acciones;
            } else {
              data1[index] += element.acciones;
            }
            if (!data2[index]) {
              data2[index] = 1;
            } else {
              data2[index] += 1;
            }
            data3[index] = ((data1[index] / data2[index]) * 100).toFixed(2);
          }
          if ("Programa de gestion ambiental" == data[1].split(",")[index]) {
            if (!data1[index]) {
              data1[index] = element.programa;
            } else {
              data1[index] += element.programa;
            }
            if (!data2[index]) {
              data2[index] = 1;
            } else {
              data2[index] += 1;
            }
            data3[index] = ((data1[index] / data2[index]) * 100).toFixed(2);
          }
          if ("recursos financieros" == data[1].split(",")[index]) {
            if (!data1[index]) {
              data1[index] = element.recurso;
            } else {
              data1[index] += element.recurso;
            }
            if (!data2[index]) {
              data2[index] = 1;
            } else {
              data2[index] += 1;
            }
            data3[index] = ((data1[index] / data2[index]) * 100).toFixed(2);
          }
          if ("Aprovechamiento Economico" == data[1].split(",")[index]) {
            if (!data1[index]) {
              data1[index] = element.aprovechamiento;
            } else {
              data1[index] += element.aprovechamiento;
            }
            if (!data2[index]) {
              data2[index] = 1;
            } else {
              data2[index] += 1;
            }
            data3[index] = ((data1[index] / data2[index]) * 100).toFixed(2);
          }
          if ("Sistema de tratamiento" == data[1].split(",")[index]) {
            if (!data1[index]) {
              data1[index] = element.sistema;
            } else {
              data1[index] += element.sistema;
            }
            if (!data2[index]) {
              data2[index] = 1;
            } else {
              data2[index] += 1;
            }
            data3[index] = ((data1[index] / data2[index]) * 100).toFixed(2);
          }
          if ("Carga contaminante" == data[1].split(",")[index]) {
            if (!data1[index]) {
              data1[index] = element.carga;
            } else {
              data1[index] += element.carga;
            }
            if (!data2[index]) {
              data2[index] = 1;
            } else {
              data2[index] += 1;
            }
            data3[index] = ((data1[index] / data2[index]) * 100).toFixed(2);
          }
        });
      }

      for (let index = 0; index < data[1].split(",").length; index++) {
        if (!data3[index]) data3[index] = 0;
        if (data3[index] == "NaN") data3[index] = 0;
      }

      return data3;
    },

    async getDesempenoIndicadores(ctx) {
      let data = ctx.query.filters;
      let desempeño = await strapi.db
        .query("api::desempenoambiental.desempenoambiental")
        .findMany({
          where: {
            anno: {
              $containsi: data[0],
            },
          },
          populate: {
            entidad: {
              populate: ["organismo", "osde"],
              //   where: {
              //     activo: {
              //       $containsi: "s",
              //     },
              //   },
            },
          },
        });

      let data1 = [],
        data2 = [],
        data3 = [];
      let rows = [];

      for (let i = 0; i < desempeño.length; i++) {
        if (desempeño[i].entidad.length > 0) {
          if (desempeño[i].entidad[0].organismo.length == 0)
            desempeño[i].entidad.organismo[0] = { organismo: "-" };
          if (desempeño[i].entidad[0].osde == null) {
            desempeño[i].entidad[0].osde = { nombre: "-" };
          }

          rows.push({
            coordinador: desempeño[i].exist_coordinador,
            diagnostico: desempeño[i].exist_diagnostico,
            politica: desempeño[i].exist_politica,
            indicadores: desempeño[i].exist_indicadores,
            plan: desempeño[i].exist_plan_accion,
            legislacion: desempeño[i].exist_legislacion,
            capacitacion: desempeño[i].exist_plan_capacitacion,
            acciones: desempeño[i].exist_accionespml,
            programa: desempeño[i].exist_program_gestionambiental,
            recurso: desempeño[i].exist_recurso_financiero,
            aprovechamiento: desempeño[i].aprovechamiento_economico,
            sistema: desempeño[i].exist_sistem_tratamiento,
            carga: desempeño[i].disminucion_carga_contaminante,
            organismo: desempeño[i].entidad[0].organismo[0].organismo,
            osde: desempeño[i].entidad[0].osde.nombre,
          });
        }
      }

      console.log(data);

      if (data[1] == "OACE") {
        console.log("here");
        for (let index = 0; index < data[2].split(",").length; index++) {
          rows.forEach((element) => {
            switch (data[4]) {
              case "Coordinador": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.coordinador;
                  } else {
                    data1[index] += element.coordinador;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Diagnostico": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.diagnostico;
                  } else {
                    data1[index] += element.diagnostico;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Politica": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.politica;
                  } else {
                    data1[index] += element.politica;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Indicadores": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.indicadores;
                  } else {
                    data1[index] += element.indicadores;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Plan de accion": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.plan;
                  } else {
                    data1[index] += element.plan;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Legislacion": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.legislacion;
                  } else {
                    data1[index] += element.legislacion;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Plan de capacitacion": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.capacitacion;
                  } else {
                    data1[index] += element.capacitacion;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Acciones PML": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.acciones;
                  } else {
                    data1[index] += element.acciones;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Programa de gestion ambiental": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.programa;
                  } else {
                    data1[index] += element.programa;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "recursos financieros": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.recurso;
                  } else {
                    data1[index] += element.recurso;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Aprovechamiento Economico": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.aprovechamiento;
                  } else {
                    data1[index] += element.aprovechamiento;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Sistema de tratamiento": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.sistema;
                  } else {
                    data1[index] += element.sistema;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Carga contaminante": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.carga;
                  } else {
                    data1[index] += element.carga;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
            }
          });
        }
      } else {
        for (let index = 0; index < data[3].split(",").length; index++) {
          rows.forEach((element) => {
            switch (data[4]) {
              case "Coordinador": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.coordinador;
                  } else {
                    data1[index] += element.coordinador;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Diagnostico": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.diagnostico;
                  } else {
                    data1[index] += element.diagnostico;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Politica": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.politica;
                  } else {
                    data1[index] += element.politica;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Indicadores": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.indicadores;
                  } else {
                    data1[index] += element.indicadores;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Plan de accion": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.plan;
                  } else {
                    data1[index] += element.plan;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Legislacion": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.legislacion;
                  } else {
                    data1[index] += element.legislacion;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Plan de capacitacion": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.capacitacion;
                  } else {
                    data1[index] += element.capacitacion;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Acciones PML": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.acciones;
                  } else {
                    data1[index] += element.acciones;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Programa de gestion ambiental": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.programa;
                  } else {
                    data1[index] += element.programa;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "recursos financieros": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.recurso;
                  } else {
                    data1[index] += element.recurso;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Aprovechamiento Economico": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.aprovechamiento;
                  } else {
                    data1[index] += element.aprovechamiento;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Sistema de tratamiento": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.sistema;
                  } else {
                    data1[index] += element.sistema;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Carga contaminante": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.carga;
                  } else {
                    data1[index] += element.carga;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
            }
          });
        }
      }

      return data3;
    },

    async getDesempenoComparacion(ctx) {
      let data = ctx.query.filters;
      let desempeño = await strapi.db
        .query("api::desempenoambiental.desempenoambiental")
        .findMany({
          where: {
            anno: {
              $containsi: data[0],
            },
          },
          populate: {
            entidad: {
              populate: ["organismo", "osde"],
              //   where: {
              //     activo: {
              //       $containsi: "s",
              //     },
              //   },
            },
          },
        });

      let data1 = [],
        data2 = [],
        data3 = [];
      let rows = [];

      for (let i = 0; i < desempeño.length; i++) {
        if (desempeño[i].entidad.length > 0) {
          if (desempeño[i].entidad[0].organismo.length == 0)
            desempeño[i].entidad.organismo[0] = { organismo: "-" };
          if (desempeño[i].entidad[0].osde == null) {
            desempeño[i].entidad[0].osde = { nombre: "-" };
          }
          rows.push({
            total:
              desempeño[i].disminucion_carga_contaminante +
              desempeño[i].exist_sistem_tratamiento +
              desempeño[i].aprovechamiento_economico +
              desempeño[i].exist_recurso_financiero +
              desempeño[i].exist_program_gestionambiental +
              desempeño[i].exist_accionespml +
              desempeño[i].exist_plan_capacitacion +
              desempeño[i].exist_legislacion +
              desempeño[i].exist_plan_accion +
              desempeño[i].exist_coordinador +
              desempeño[i].exist_diagnostico +
              desempeño[i].exist_politica +
              desempeño[i].exist_indicadores,
            organismo: desempeño[i].entidad[0].organismo[0].organismo,
            osde: desempeño[i].entidad[0].osde.nombre,
          });
        }
      }
      if (data[1] == "OACE") {
        for (let index = 0; index < data[2].split(",").length; index++) {
          rows.forEach((element) => {
            if (data[2].split(",")[index] == element.organismo) {
              if (!data1[index]) {
                data1[index] = element.total;
              } else {
                data1[index] = data1[index] + element.total;
              }
              if (!data2[index]) {
                data2[index] = 13;
              } else {
                data2[index] = data2[index] + 13;
              }
            }
          });
        }

        for (let index = 0; index < data[2].split(",").length; index++) {
          data3[index] = ((data1[index] / data2[index]) * 100).toFixed(2);
          if (data3[index] == "NaN") data3[index] = 0;
        }
      } else {
        for (let index = 0; index < data[3].split(",").length; index++) {
          rows.forEach((element) => {
            if (data[3].split(",")[index] == element.osde) {
              if (!data1[index]) {
                data1[index] = element.total;
              } else {
                data1[index] = data1[index] + element.total;
              }
              if (!data2[index]) {
                data2[index] = 13;
              } else {
                data2[index] = data2[index] + 13;
              }
            }
          });
        }

        for (let index = 0; index < data[3].split(",").length; index++) {
          data3[index] = ((data1[index] / data2[index]) * 100).toFixed(2);
          if (data3[index] == "NaN") data3[index] = 0;
        }
      }

      return data3;
    },

    async getIndicadoresDesempeno(ctx) {
      let data = ctx.query.filters;
      let desempeño = await strapi.db
        .query("api::desempenoambiental.desempenoambiental")
        .findMany({
          where: {
            anno: {
              $containsi: data[0],
            },
          },
          populate: {
            entidad: {
              populate: ["organismo", "osde"],
              //   where: {
              //     activo: {
              //       $containsi: "s",
              //     },
              //   },
            },
          },
        });

      let data1 = [],
        data2 = [],
        data3 = [];
      let rows = [];

      for (let i = 0; i < desempeño.length; i++) {
        if (desempeño[i].entidad.length > 0) {
          if (desempeño[i].entidad[0].organismo.length == 0)
            desempeño[i].entidad.organismo[0] = { organismo: "-" };
          if (desempeño[i].entidad[0].osde == null) {
            desempeño[i].entidad[0].osde = { nombre: "-" };
          }

          rows.push({
            coordinador: desempeño[i].exist_coordinador,
            diagnostico: desempeño[i].exist_diagnostico,
            politica: desempeño[i].exist_politica,
            indicadores: desempeño[i].exist_indicadores,
            plan: desempeño[i].exist_plan_accion,
            legislacion: desempeño[i].exist_legislacion,
            capacitacion: desempeño[i].exist_plan_capacitacion,
            acciones: desempeño[i].exist_accionespml,
            programa: desempeño[i].exist_program_gestionambiental,
            recurso: desempeño[i].exist_recurso_financiero,
            aprovechamiento: desempeño[i].aprovechamiento_economico,
            sistema: desempeño[i].exist_sistem_tratamiento,
            carga: desempeño[i].disminucion_carga_contaminante,
            organismo: desempeño[i].entidad[0].organismo[0].organismo,
            osde: desempeño[i].entidad[0].osde.nombre,
          });
        }
      }

      if (data[1] == "OACE") {
        for (let index = 0; index < data[2].split(",").length; index++) {
          rows.forEach((element) => {
            switch (data[4]) {
              case "Coordinador": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.coordinador;
                  } else {
                    data1[index] += element.coordinador;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Diagnostico": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.diagnostico;
                  } else {
                    data1[index] += element.diagnostico;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Politica": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.politica;
                  } else {
                    data1[index] += element.politica;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Indicadores": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.indicadores;
                  } else {
                    data1[index] += element.indicadores;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Plan de accion": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.plan;
                  } else {
                    data1[index] += element.plan;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Legislacion": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.legislacion;
                  } else {
                    data1[index] += element.legislacion;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Plan de capacitacion": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.capacitacion;
                  } else {
                    data1[index] += element.capacitacion;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Acciones PML": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.acciones;
                  } else {
                    data1[index] += element.acciones;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Programa de gestion ambiental": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.programa;
                  } else {
                    data1[index] += element.programa;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "recursos financieros": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.recurso;
                  } else {
                    data1[index] += element.recurso;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Aprovechamiento Economico": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.aprovechamiento;
                  } else {
                    data1[index] += element.aprovechamiento;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Sistema de tratamiento": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.sistema;
                  } else {
                    data1[index] += element.sistema;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Carga contaminante": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.carga;
                  } else {
                    data1[index] += element.carga;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
            }
          });
        }

        for (let index = 0; index < data[2].split(",").length; index++) {
          if (!data3[index]) data3[index] = 0;
          if (data3[index] == "NaN") data3[index] = 0;
        }
      } else {
        for (let index = 0; index < data[3].split(",").length; index++) {
          rows.forEach((element) => {
            switch (data[4]) {
              case "Coordinador": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.coordinador;
                  } else {
                    data1[index] += element.coordinador;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Diagnostico": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.diagnostico;
                  } else {
                    data1[index] += element.diagnostico;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Politica": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.politica;
                  } else {
                    data1[index] += element.politica;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Indicadores": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.indicadores;
                  } else {
                    data1[index] += element.indicadores;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Plan de accion": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.plan;
                  } else {
                    data1[index] += element.plan;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Legislacion": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.legislacion;
                  } else {
                    data1[index] += element.legislacion;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Plan de capacitacion": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.capacitacion;
                  } else {
                    data1[index] += element.capacitacion;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Acciones PML": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.acciones;
                  } else {
                    data1[index] += element.acciones;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Programa de gestion ambiental": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.programa;
                  } else {
                    data1[index] += element.programa;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "recursos financieros": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.recurso;
                  } else {
                    data1[index] += element.recurso;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Aprovechamiento Economico": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.aprovechamiento;
                  } else {
                    data1[index] += element.aprovechamiento;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Sistema de tratamiento": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.sistema;
                  } else {
                    data1[index] += element.sistema;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
              case "Carga contaminante": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.carga;
                  } else {
                    data1[index] += element.carga;
                  }
                  if (!data2[index]) {
                    data2[index] = 1;
                  } else {
                    data2[index] += 1;
                  }
                  data3[index] = ((data1[index] / data2[index]) * 100).toFixed(
                    2
                  );
                }
                break;
              }
            }
          });
        }

        for (let index = 0; index < data[3].split(",").length; index++) {
          if (!data3[index]) data3[index] = 0;
          if (data3[index] == "NaN") data3[index] = 0;
        }
      }

      return data3;
    },

    async getDesempenoData(ctx) {
      let data = ctx.query.filters;
      let desempeño = await strapi.db
        .query("api::desempenoambiental.desempenoambiental")
        .findMany({
          where: {
            anno: {
              $containsi: data[0],
            },
          },
          populate: {
            entidad: true,
          },
        });

      let rows = [],
        count = 1;

      for (let i = 0; i < desempeño.length; i++) {
        if (desempeño[i].entidad.length > 0) {
          rows.push({
            name: count.toString(),
            id: desempeño[i].id,
            entidad: desempeño[i].entidad[0].entidad,
            coordinador: desempeño[i].exist_coordinador,
            diagnostico: desempeño[i].exist_diagnostico,
            politica: desempeño[i].exist_politica,
            indicadores: desempeño[i].exist_indicadores,
            plan: desempeño[i].exist_plan_accion,
            legislacion: desempeño[i].exist_legislacion,
            capacitacion: desempeño[i].exist_plan_capacitacion,
            acciones: desempeño[i].exist_accionespml,
            programa: desempeño[i].exist_program_gestionambiental,
            recurso: desempeño[i].exist_recurso_financiero,
            aprovechamiento: desempeño[i].aprovechamiento_economico,
            sistema: desempeño[i].exist_sistem_tratamiento,
            anno: desempeño[i].anno,
            carga: desempeño[i].disminucion_carga_contaminante,
            observaciones: desempeño[i].observaciones,
            total: (
              desempeño[i].disminucion_carga_contaminante +
              desempeño[i].exist_sistem_tratamiento +
              desempeño[i].aprovechamiento_economico +
              desempeño[i].exist_recurso_financiero +
              desempeño[i].exist_program_gestionambiental +
              desempeño[i].exist_accionespml +
              desempeño[i].exist_plan_capacitacion +
              desempeño[i].exist_legislacion +
              desempeño[i].exist_plan_accion +
              desempeño[i].exist_coordinador +
              desempeño[i].exist_diagnostico +
              desempeño[i].exist_politica +
              desempeño[i].exist_indicadores
            ).toString(),
          });
        //   if(rows[i]){
        //       Object.keys(rows[i]).forEach(function (key) {
        //         if (rows[i][key] != null || rows[i][key] != undefined) {
        //           if (rows[i][key] === 1) {
        //             rows[i][key] = "si";
        //           } else if (rows[i][key] === 0) {
        //             rows[i][key] = "no";
        //           }
        //         }
        //       });
        //   }
        //   else{
        //     console.log(i);
        //     console.log(rows[i]);
        //   }
        }
        count++;
      }

      for (let i = 0; i < rows.length; i++) {
        Object.keys(rows[i]).forEach(function (key) {
            if (rows[i][key] != null || rows[i][key] != undefined) {
              if (rows[i][key] === 1) {
                rows[i][key] = "si";
              } else if (rows[i][key] === 0) {
                rows[i][key] = "no";
              }
            }
          });
      }

      return rows;
    },

    async getDesempenoId(ctx) {
      let data = ctx.query.filters;
      const { desempeno_id } = ctx.params;
      let desempeño = await strapi.db
        .query("api::desempenoambiental.desempenoambiental")
        .findMany({
          where: {
            anno: {
              $containsi: data[0],
            },
          },
          populate: {
            entidad: true,
          },
        });

      let rows = [];
      let count = 1;

      for (let i = 0; i < desempeño.length; i++) {
        if (
          desempeño[i].entidad.length > 0 &&
          desempeño[i].entidad[0].id == desempeno_id
        ) {
          rows.push({
            name: count.toString(),
            id: desempeño[i].id,
            entidad: desempeño[i].entidad[0].entidad,
            coordinador: desempeño[i].exist_coordinador,
            diagnostico: desempeño[i].exist_diagnostico,
            politica: desempeño[i].exist_politica,
            indicadores: desempeño[i].exist_indicadores,
            plan: desempeño[i].exist_plan_accion,
            legislacion: desempeño[i].exist_legislacion,
            capacitacion: desempeño[i].exist_plan_capacitacion,
            acciones: desempeño[i].exist_accionespml,
            programa: desempeño[i].exist_program_gestionambiental,
            recurso: desempeño[i].exist_recurso_financiero,
            aprovechamiento: desempeño[i].aprovechamiento_economico,
            sistema: desempeño[i].exist_sistem_tratamiento,
            anno: desempeño[i].anno,
            carga: desempeño[i].disminucion_carga_contaminante,
            observaciones: desempeño[i].observaciones,
            total: (
              desempeño[i].disminucion_carga_contaminante +
              desempeño[i].exist_sistem_tratamiento +
              desempeño[i].aprovechamiento_economico +
              desempeño[i].exist_recurso_financiero +
              desempeño[i].exist_program_gestionambiental +
              desempeño[i].exist_accionespml +
              desempeño[i].exist_plan_capacitacion +
              desempeño[i].exist_legislacion +
              desempeño[i].exist_plan_accion +
              desempeño[i].exist_coordinador +
              desempeño[i].exist_diagnostico +
              desempeño[i].exist_politica +
              desempeño[i].exist_indicadores
            ).toString(),
          });
        }
        count++;
      }

      return rows;
    },
  })
);
