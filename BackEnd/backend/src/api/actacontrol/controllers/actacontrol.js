"use strict";

/**
 * actacontrol controller
 */
const unparsed = require("koa-body/unparsed.js");
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::actacontrol.actacontrol",
  ({ strapi }) => ({
    async getActacontrol(ctx) {
      const data = ctx.query.filters;
      let response = await strapi.db
        .query("api::actacontrol.actacontrol")
        .findMany({
          where: {
            fechavisita: {
              $containsi: data[0],
            },
          },
          populate: {
            entidad: {
              populate: ["organismo", "osde"],
              // where: {
              //   activo: {
              //     $containsi: "s",
              //   },
              // },
            },
          },
        });

      let rows = [];
      let rowTotal = {
        name: "Total",
        cumplidas_corto: 0,
        cumplidas_largo: 0,
        cumplidas_mediano: 0,
        medidas_corto: 0,
        medidas_largo: 0,
        medidas_mediano: 0,
        totalMedidas: 0,
        totalCumplidas: 0,
        porcientoCorto: 0,
        porcientoMedio: 0,
        porcientoLargo: 0,
        porcientoTotal: 0,
        entidad: "",
        organismo: "",
      };
      let count = 1;
      for (let i = 0; i < response.length; i++) {
        let porcientoCortos = 0,
          porcientoMedios = 0,
          porcientoLargos = 0,
          porcientoTotales = 0;
        porcientoCortos =
          response[i].medidas_corto == 0
            ? parseFloat(0).toFixed(2)
            : (
                (response[i].cumplidas_corto / response[i].medidas_corto) *
                100
              ).toFixed(2);
        porcientoMedios =
          response[i].medidas_mediano == 0
            ? parseFloat(0).toFixed(2)
            : (
                (response[i].cumplidas_mediano / response[i].medidas_mediano) *
                100
              ).toFixed(2);
        porcientoLargos =
          response[i].medidas_largo == 0
            ? parseFloat(0).toFixed(2)
            : (
                (response[i].cumplidas_largo / response[i].medidas_largo) *
                100
              ).toFixed(2);
        porcientoTotales =
          response[i].medidas_corto +
            response[i].medidas_largo +
            response[i].medidas_mediano ==
          0
            ? parseFloat(0).toFixed(2)
            : (
                ((response[i].cumplidas_largo +
                  response[i].cumplidas_corto +
                  response[i].cumplidas_mediano) /
                  (response[i].medidas_corto +
                    response[i].medidas_largo +
                    response[i].medidas_mediano)) *
                100
              ).toFixed(2);

        let classTemp = {
          year: data[0],
          name: count,
          id: response[i].id,
          cumplidas_corto: response[i].cumplidas_corto,
          cumplidas_largo: response[i].cumplidas_largo,
          cumplidas_mediano: response[i].cumplidas_mediano,
          medidas_corto: response[i].medidas_corto,
          medidas_largo: response[i].medidas_largo,
          medidas_mediano: response[i].medidas_mediano,
          totalMedidas:
            response[i].medidas_corto +
            response[i].medidas_largo +
            response[i].medidas_mediano,
          totalCumplidas:
            response[i].cumplidas_largo +
            response[i].cumplidas_corto +
            response[i].cumplidas_mediano,
          porcientoCorto: porcientoCortos,
          porcientoMedio: porcientoMedios,
          porcientoLargo: porcientoLargos,
          porcientoTotal: porcientoTotales,
          entidad: response[i].entidad.entidad,
          organismo: response[i].entidad.organismo[0].organismo,
        };

        if (response[i].entidad != null) {
          if (data[1] == "Entidad" && response[i].entidad.entidad == data[2]) {
            if (response[i].entidad.organismo.length == 0)
              response[i].entidad.organismo[0] = {
                attributes: { organismo: "-" },
              };
            rows.push(classTemp);

            rowTotal.cumplidas_corto += parseInt(response[i].cumplidas_corto);
            rowTotal.cumplidas_largo += parseInt(response[i].cumplidas_largo);
            rowTotal.cumplidas_mediano += parseInt(
              response[i].cumplidas_mediano
            );
            rowTotal.medidas_corto += parseInt(response[i].medidas_corto);
            rowTotal.medidas_largo += parseInt(response[i].medidas_largo);
            rowTotal.medidas_mediano += parseInt(response[i].medidas_mediano);
            rowTotal.totalMedidas += parseInt(
              response[i].medidas_corto +
                response[i].medidas_largo +
                response[i].medidas_mediano
            );
            rowTotal.totalCumplidas += parseInt(
              response[i].cumplidas_largo +
                response[i].cumplidas_corto +
                response[i].cumplidas_mediano
            );
            rowTotal.porcientoCorto = parseInt(rowTotal.cumplidas_corto/rowTotal.medidas_corto*100).toFixed(2);
            rowTotal.porcientoMedio = parseInt(rowTotal.cumplidas_mediano/rowTotal.medidas_mediano*100).toFixed(2);
            rowTotal.porcientoLargo = parseInt(rowTotal.cumplidas_largo/rowTotal.medidas_largo*100).toFixed(2);
            rowTotal.porcientoTotal = parseInt(rowTotal.totalCumplidas/rowTotal.totalMedidas*100).toFixed(2);

            count++;
          } else if (
            data[1] == "OACE" &&
            response[i].entidad.organismo.length > 0 &&
            response[i].entidad.organismo[0].organismo == data[3]
          ) {
            if (response[i].entidad.organismo.length == 0)
              response[i].entidad.organismo[0] = {
                attributes: { organismo: "-" },
              };
            rows.push(classTemp);

            rowTotal.cumplidas_corto += parseInt(response[i].cumplidas_corto);
            rowTotal.cumplidas_largo += parseInt(response[i].cumplidas_largo);
            rowTotal.cumplidas_mediano += parseInt(
              response[i].cumplidas_mediano
            );
            rowTotal.medidas_corto += parseInt(response[i].medidas_corto);
            rowTotal.medidas_largo += parseInt(response[i].medidas_largo);
            rowTotal.medidas_mediano += parseInt(response[i].medidas_mediano);
            rowTotal.totalMedidas += parseInt(
              response[i].medidas_corto +
                response[i].medidas_largo +
                response[i].medidas_mediano
            );
            rowTotal.totalCumplidas += parseInt(
              response[i].cumplidas_largo +
                response[i].cumplidas_corto +
                response[i].cumplidas_mediano
            );
            rowTotal.porcientoCorto = parseInt(rowTotal.cumplidas_corto/rowTotal.medidas_corto*100).toFixed(2);
            rowTotal.porcientoMedio = parseInt(rowTotal.cumplidas_mediano/rowTotal.medidas_mediano*100).toFixed(2);
            rowTotal.porcientoLargo = parseInt(rowTotal.cumplidas_largo/rowTotal.medidas_largo*100).toFixed(2);
            rowTotal.porcientoTotal = parseInt(rowTotal.totalCumplidas/rowTotal.totalMedidas*100).toFixed(2);

            count++;
          } else if (
            data[1] == "OSDE" &&
            response[i].entidad.osde != null &&
            response[i].entidad.osde.nombre == data[4]
          ) {
            if (response[i].entidad.organismo.length == 0)
              response[i].entidad.organismo[0] = {
                attributes: { organismo: "-" },
              };
            rows.push(classTemp);

            rowTotal.cumplidas_corto += parseInt(response[i].cumplidas_corto);
            rowTotal.cumplidas_largo += parseInt(response[i].cumplidas_largo);
            rowTotal.cumplidas_mediano += parseInt(
              response[i].cumplidas_mediano
            );
            rowTotal.medidas_corto += parseInt(response[i].medidas_corto);
            rowTotal.medidas_largo += parseInt(response[i].medidas_largo);
            rowTotal.medidas_mediano += parseInt(response[i].medidas_mediano);
            rowTotal.totalMedidas += parseInt(
              response[i].medidas_corto +
                response[i].medidas_largo +
                response[i].medidas_mediano
            );
            rowTotal.totalCumplidas += parseInt(
              response[i].cumplidas_largo +
                response[i].cumplidas_corto +
                response[i].cumplidas_mediano
            );
            rowTotal.porcientoCorto = parseInt(rowTotal.cumplidas_corto/rowTotal.medidas_corto*100).toFixed(2);
            rowTotal.porcientoMedio = parseInt(rowTotal.cumplidas_mediano/rowTotal.medidas_mediano*100).toFixed(2);
            rowTotal.porcientoLargo = parseInt(rowTotal.cumplidas_largo/rowTotal.medidas_largo*100).toFixed(2);
            rowTotal.porcientoTotal = parseInt(rowTotal.totalCumplidas/rowTotal.totalMedidas*100).toFixed(2);

            count++;
          }
        }
      }

      return {rows,rowTotal};
    },

    async getMedidasActaControl(ctx) {
      const data = ctx.query.filters;
      let response = await strapi.db
        .query("api::actacontrol.actacontrol")
        .findMany({
          where: {
            fechavisita: {
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
        data3 = [],
        rows = [];

      for (let i = 0; i < response.length; i++) {
        if (response[i].entidad != null) {
          if (response[i].entidad.organismo.length == 0)
            response[i].entidad.organismo[0] = { organismo: "-" };
          if (response[i].entidad.osde == null) {
            response[i].entidad.osde = { nombre: "-" };
          }
          rows.push({
            medidas:
              response[i].medidas_corto +
              response[i].medidas_largo +
              response[i].medidas_mediano,
            cumplidas:
              response[i].cumplidas_largo +
              response[i].cumplidas_corto +
              response[i].cumplidas_mediano,
            organismo: response[i].entidad.organismo[0].organismo,
            osde: response[i].entidad.osde.nombre,
          });
        }
      }

      console.log(rows);
      console.log(data);

      if (data[1] == "OACE") {
        for (let index = 0; index < data[2].split(",").length; index++) {
          rows.forEach((element) => {
            if (data[2].split(",")[index] == element.organismo) {
              if (!data1[index]) {
                data1[index] = element.medidas;
              } else {
                data1[index] = data1[index] + element.medidas;
              }
              if (!data2[index]) {
                data2[index] = element.cumplidas;
              } else {
                data2[index] = data2[index] + element.cumplidas;
              }
              data3[index] = ((data2[index] / data1[index]) * 100).toFixed(2);
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
            if (data[3].split(",")[index] == element.osde) {
              if (!data1[index]) {
                data1[index] = element.medidas;
              } else {
                data1[index] = data1[index] + element.medidas;
              }
              if (!data2[index]) {
                data2[index] = element.cumplidas;
              } else {
                data2[index] = data2[index] + element.cumplidas;
              }
              data3[index] = ((data2[index] / data1[index]) * 100).toFixed(2);
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

    async getPlanMedidasActaControl(ctx) {
      const data = ctx.query.filters;
      let response = await strapi.db
        .query("api::actacontrol.actacontrol")
        .findMany({
          where: {
            fechavisita: {
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
        data3 = [],
        data4 = [];
      let rows = [];

      for (let i = 0; i < response.length; i++) {
        //Unidad de Camiones # 1
        if (response[i].entidad != null) {
          if (response[i].entidad.organismo.length == 0)
            response[i].entidad.organismo[0] = { organismo: "-" };
          if (!response[i].entidad.osde)
            response[i].entidad.osde = { nombre: "-" };
          rows.push({
            year: data.fecha_actual,
            name: i + 1,
            id: response[i].id,
            cumplidas_corto: response[i].cumplidas_corto,
            cumplidas_largo: response[i].cumplidas_largo,
            cumplidas_mediano: response[i].cumplidas_mediano,
            medidas_corto: response[i].medidas_corto,
            medidas_largo: response[i].medidas_largo,
            medidas_mediano: response[i].medidas_mediano,
            totalMedidas:
              response[i].medidas_corto +
              response[i].medidas_largo +
              response[i].medidas_mediano,
            totalCumplidas:
              response[i].cumplidas_largo +
              response[i].cumplidas_corto +
              response[i].cumplidas_mediano,
            porcientoCorto: (
              (response[i].cumplidas_corto / response[i].medidas_corto) *
              100
            ).toFixed(2),
            porcientoMedio:
              (response[i].cumplidas_mediano / response[i].medidas_mediano) *
              100,
            porcientoLargo:
              (response[i].cumplidas_largo / response[i].medidas_largo) * 100,
            porcientoTotal:
              ((response[i].cumplidas_largo +
                response[i].cumplidas_corto +
                response[i].cumplidas_mediano) /
                (response[i].medidas_corto +
                  response[i].medidas_largo +
                  response[i].medidas_mediano)) *
              100,
            entidad: response[i].entidad.entidad,
            organismo: response[i].entidad.organismo[0].organismo,
            osde: response[i].entidad.osde.nombre,
          });
        }
      }

      if(data[1]=="OACE"){
        for (let index = 0; index < data[2].split(",").length; index++) {
          rows.forEach((element) => {
            switch (data[4]) {
              case "Totales": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.totalMedidas;
                  } else {
                    data1[index] += element.totalMedidas;
                  }
                  if (!data2[index]) {
                    data2[index] = element.totalCumplidas;
                  } else {
                    data2[index] += element.totalCumplidas;
                  }
                  // if(data2[index]/data1[index]) data[2].split(",")[index]=data[2].split(",")[index]+" "+((data2[index]/data1[index])*100).toFixed(2)+"%"
                  // else data[2].split(",")[index]=data[2].split(",")[index]+" 0%"
                }
                break;
              }
              case "Corto": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.medidas_corto;
                  } else {
                    data1[index] += element.medidas_corto;
                  }
                  if (!data2[index]) {
                    data2[index] = element.cumplidas_corto;
                  } else {
                    data2[index] += element.cumplidas_corto;
                  }
                }
                break;
              }
              case "Mediano": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.medidas_mediano;
                  } else {
                    data1[index] += element.medidas_mediano;
                  }
                  if (!data2[index]) {
                    data2[index] = element.cumplidas_mediano;
                  } else {
                    data2[index] += element.cumplidas_mediano;
                  }
                }
                break;
              }
              case "Largo": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.medidas_largo;
                  } else {
                    data1[index] += element.medidas_largo;
                  }
                  if (!data2[index]) {
                    data2[index] = element.cumplidas_largo;
                  } else {
                    data2[index] += element.cumplidas_largo;
                  }
                }
                break;
              }
              // case "OACE": {
              //   if (element.organismo == data[2].split(",")[index]) {
              //     if (!data1[index]) {
              //       data1[index] = element.medidas_corto;
              //     } else {
              //       data1[index] += element.medidas_corto;
              //     }
              //     if (!data2[index]) {
              //       data2[index] = element.medidas_mediano;
              //     } else {
              //       data2[index] += element.medidas_mediano;
              //     }
              //     if (!data3[index]) {
              //       data3[index] = element.medidas_largo;
              //     } else {
              //       data3[index] += element.medidas_largo;
              //     }
              //   }
              //   break;
              // }
              // case "OSDE": {
              //   if (element.osde == data[3].split(",")[index]) {
              //     if (!data1[index]) {
              //       data1[index] = element.medidas_corto;
              //     } else {
              //       data1[index] += element.medidas_corto;
              //     }
              //     if (!data2[index]) {
              //       data2[index] = element.cumplidas_corto;
              //     } else {
              //       data2[index] += element.cumplidas_corto;
              //     }
              //     if (!data3[index]) {
              //       data3[index] = element.medidas_largo;
              //     } else {
              //       data3[index] += element.medidas_largo;
              //     }
              //   }
              //   break;
              // }
            }
          });
        }
      }else{
        for (let index = 0; index < data[3].split(",").length; index++) {
          rows.forEach((element) => {
            switch (data[4]) {
              case "Totales": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.totalMedidas;
                  } else {
                    data1[index] += element.totalMedidas;
                  }
                  if (!data2[index]) {
                    data2[index] = element.totalCumplidas;
                  } else {
                    data2[index] += element.totalCumplidas;
                  }
                  // if(data2[index]/data1[index]) data[2].split(",")[index]=data[2].split(",")[index]+" "+((data2[index]/data1[index])*100).toFixed(2)+"%"
                  // else data[2].split(",")[index]=data[2].split(",")[index]+" 0%"
                }
                break;
              }
              case "Corto": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.medidas_corto;
                  } else {
                    data1[index] += element.medidas_corto;
                  }
                  if (!data2[index]) {
                    data2[index] = element.cumplidas_corto;
                  } else {
                    data2[index] += element.cumplidas_corto;
                  }
                }
                break;
              }
              case "Mediano": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.medidas_mediano;
                  } else {
                    data1[index] += element.medidas_mediano;
                  }
                  if (!data2[index]) {
                    data2[index] = element.cumplidas_mediano;
                  } else {
                    data2[index] += element.cumplidas_mediano;
                  }
                }
                break;
              }
              case "Largo": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data1[index]) {
                    data1[index] = element.medidas_largo;
                  } else {
                    data1[index] += element.medidas_largo;
                  }
                  if (!data2[index]) {
                    data2[index] = element.cumplidas_largo;
                  } else {
                    data2[index] += element.cumplidas_largo;
                  }
                }
                break;
              }
              // case "OACE": {
              //   if (element.organismo == data[2].split(",")[index]) {
              //     if (!data1[index]) {
              //       data1[index] = element.medidas_corto;
              //     } else {
              //       data1[index] += element.medidas_corto;
              //     }
              //     if (!data2[index]) {
              //       data2[index] = element.medidas_mediano;
              //     } else {
              //       data2[index] += element.medidas_mediano;
              //     }
              //     if (!data3[index]) {
              //       data3[index] = element.medidas_largo;
              //     } else {
              //       data3[index] += element.medidas_largo;
              //     }
              //   }
              //   break;
              // }
              // case "OSDE": {
              //   if (element.osde == data[3].split(",")[index]) {
              //     if (!data1[index]) {
              //       data1[index] = element.medidas_corto;
              //     } else {
              //       data1[index] += element.medidas_corto;
              //     }
              //     if (!data2[index]) {
              //       data2[index] = element.cumplidas_corto;
              //     } else {
              //       data2[index] += element.cumplidas_corto;
              //     }
              //     if (!data3[index]) {
              //       data3[index] = element.medidas_largo;
              //     } else {
              //       data3[index] += element.medidas_largo;
              //     }
              //   }
              //   break;
              // }
            }
          });
        }
      }

      data4.push(data1);
      data4.push(data2);
      // data4.push(data3);

      return data4;
    },

    async getActaControlData(ctx) {
      const data = ctx.query.filters;
      let response = await strapi.db
        .query("api::actacontrol.actacontrol")
        .findMany({
          where: {
            fechavisita: {
              $containsi: data[0],
            },
          },
          orderBy: { fechavisita: "desc" },
          populate: true,
        });

      let rows = [];
      let count = 1;
      let tratamiento = "no";
      for (let i = 0; i < response.length; i++) {
        let residuales, trampa;
        const element = [];
        for (let index = 0; index < response[i].residuals.length; index++) {
          element.push(response[i].residuals[index].id);
        }
        if (element.length > 0) residuales = "si";
        response[i].sis_tratamiento != null &&
        response[i].sis_tratamiento.eficiencia != "" &&
        response[i].sis_tratamiento.estado != "" &&
        response[i].sis_tratamiento.idoneidad != ""
          ? (tratamiento = "si")
          : (tratamiento = "no");
        response[i].trampa_grasa != null &&
        (response[i].trampa_grasa.bien != "0" ||
          response[i].trampa_grasa.regular != "0" ||
          response[i].trampa_grasa.mal != "0")
          ? (trampa = "si")
          : (trampa = "no");
        if (
          response[i].entidad != null &&
          response[i].sis_tratamiento != null &&
          response[i].trampa_grasa != null
        ) {
          rows.push({
            name: count,
            id: response[i].id,
            atendido_por: response[i].atendido_por,
            comision_control: response[i].comision_control,
            consumo_agua: response[i].consumo_agua,
            consumo_energetico: response[i].consumo_energetico,
            cumplidas_corto: response[i].cumplidas_corto,
            cumplidas_largo: response[i].cumplidas_largo,
            cumplidas_mediano: response[i].cumplidas_mediano,
            deficiencias: response[i].deficiencias,
            diagnostico_ambiental: response[i].diagnostico_ambiental,
            fechavisita: response[i].fechavisita,
            medidas_corto: response[i].medidas_corto,
            medidas_largo: response[i].medidas_largo,
            medidas_mediano: response[i].medidas_mediano,
            observaciones: response[i].observaciones,
            politica_ambiental: response[i].politica_ambiental,
            recomendaciones: response[i].recomendaciones,
            entidad: response[i].entidad.entidad,
            idEntidad: response[i].entidad.id,
            sistema_de_tratamiento: tratamiento,
            eficiencia: response[i].sis_tratamiento.eficiencia,
            estado_tecnico: response[i].sis_tratamiento.estado,
            idoneidad: response[i].sis_tratamiento.idoneidad,
            trampa_de_grasa: trampa,
            estadoGrasaBien: response[i].trampa_grasa.bien,
            estadoGrasaRegular: response[i].trampa_grasa.regular,
            estadoGrasaMal: response[i].trampa_grasa.mal,
            residuals: element,
            residuales: residuales,
            idSist: response[i].sis_tratamiento.id,
            idTramp: response[i].trampa_grasa.id,
          });
        } else if (
          response[i].entidad != null &&
          response[i].sis_tratamiento == null &&
          response[i].trampa_grasa == null
        ) {
          rows.push({
            name: count,
            id: response[i].id,
            atendido_por: response[i].atendido_por,
            comision_control: response[i].comision_control,
            consumo_agua: response[i].consumo_agua,
            consumo_energetico: response[i].consumo_energetico,
            cumplidas_corto: response[i].cumplidas_corto,
            cumplidas_largo: response[i].cumplidas_largo,
            cumplidas_mediano: response[i].cumplidas_mediano,
            deficiencias: response[i].deficiencias,
            diagnostico_ambiental: response[i].diagnostico_ambiental,
            fechavisita: response[i].fechavisita,
            medidas_corto: response[i].medidas_corto,
            medidas_largo: response[i].medidas_largo,
            medidas_mediano: response[i].medidas_mediano,
            observaciones: response[i].observaciones,
            politica_ambiental: response[i].politica_ambiental,
            recomendaciones: response[i].recomendaciones,
            entidad: response[i].entidad.entidad,
            idEntidad: response[i].entidad.id,
            residuals: element,
            residuales: residuales,
            sistema_de_tratamiento: "no",
            eficiencia: "regular",
            estado_tecnico: "regular",
            idoneidad: "no",
            trampa_de_grasa: "no",
            estadoGrasaBien: "0",
            estadoGrasaRegular: "0",
            estadoGrasaMal: "0",
            idSist: "",
            idTramp: "",
          });
        } else if (
          response[i].entidad != null &&
          response[i].sis_tratamiento == null &&
          response[i].trampa_grasa != null
        ) {
          rows.push({
            name: count,
            id: response[i].id,
            atendido_por: response[i].atendido_por,
            comision_control: response[i].comision_control,
            consumo_agua: response[i].consumo_agua,
            consumo_energetico: response[i].consumo_energetico,
            cumplidas_corto: response[i].cumplidas_corto,
            cumplidas_largo: response[i].cumplidas_largo,
            cumplidas_mediano: response[i].cumplidas_mediano,
            deficiencias: response[i].deficiencias,
            diagnostico_ambiental: response[i].diagnostico_ambiental,
            fechavisita: response[i].fechavisita,
            medidas_corto: response[i].medidas_corto,
            medidas_largo: response[i].medidas_largo,
            medidas_mediano: response[i].medidas_mediano,
            observaciones: response[i].observaciones,
            politica_ambiental: response[i].politica_ambiental,
            recomendaciones: response[i].recomendaciones,
            entidad: response[i].entidad.entidad,
            idEntidad: response[i].entidad.id,
            residuals: element,
            residuales: residuales,
            sistema_de_tratamiento: "no",
            eficiencia: "regular",
            estado_tecnico: "regular",
            idoneidad: "no",
            trampa_de_grasa: trampa,
            estadoGrasaBien: response[i].trampa_grasa.bien,
            estadoGrasaRegular: response[i].trampa_grasa.regular,
            estadoGrasaMal: response[i].trampa_grasa.mal,
            idSist: "",
            idTramp: response[i].trampa_grasa.id,
          });
        } else if (
          response[i].entidad != null &&
          response[i].sis_tratamiento != null &&
          response[i].trampa_grasa == null
        ) {
          rows.push({
            name: count,
            id: response[i].id,
            atendido_por: response[i].atendido_por,
            comision_control: response[i].comision_control,
            consumo_agua: response[i].consumo_agua,
            consumo_energetico: response[i].consumo_energetico,
            cumplidas_corto: response[i].cumplidas_corto,
            cumplidas_largo: response[i].cumplidas_largo,
            cumplidas_mediano: response[i].cumplidas_mediano,
            deficiencias: response[i].deficiencias,
            diagnostico_ambiental: response[i].diagnostico_ambiental,
            fechavisita: response[i].fechavisita,
            medidas_corto: response[i].medidas_corto,
            medidas_largo: response[i].medidas_largo,
            medidas_mediano: response[i].medidas_mediano,
            observaciones: response[i].observaciones,
            politica_ambiental: response[i].politica_ambiental,
            recomendaciones: response[i].recomendaciones,
            entidad: response[i].entidad.entidad,
            idEntidad: response[i].entidad.id,
            residuals: element,
            residuales: residuales,
            sistema_de_tratamiento: tratamiento,
            eficiencia: response[i].sis_tratamiento.eficiencia,
            estado_tecnico: response[i].sis_tratamiento.estado,
            idoneidad: response[i].sis_tratamiento.idoneidad,
            trampa_de_grasa: "no",
            estadoGrasaBien: "0",
            estadoGrasaRegular: "0",
            estadoGrasaMal: "0",
            idSist: response[i].sis_tratamiento.id,
            idTramp: "",
          });
        }
        count++;
      }
      return rows;
    },
  })
);
