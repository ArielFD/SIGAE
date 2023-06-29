"use strict";

/**
 * cargacontaminante controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::cargacontaminante.cargacontaminante",
  ({ strapi }) => ({
    async getCargacontaminante(ctx) {
      let response = await strapi.db
        .query("api::cargacontaminante.cargacontaminante")
        .findMany({
          populate: true,
          orderBy: { anno: "desc" },
        });
      let count = 1;
      let rows = [];
      for (let i = 0; i < response.length; i++) {
        if (response[i].entidad.length > 0) {
          rows.push({
            name: count,
            id: response[i].id,
            entidad: response[i].entidad[0].entidad,
            DB05: response[i].DB05,
            DQ0: response[i].DQ0,
            Flujo: response[i].Flujo,
            Grasas_aceites: response[i].Grasas_aceites,
            Hidrocarburos: response[i].Hidrocarburos,
            NTK: response[i].NTK,
            PH: response[i].PH,
            PIB: response[i].PIB,
            PT: response[i].PT,
            ST: response[i].ST,
            S_SED: response[i].S_SED,
            TEMP: response[i].TEMP,
            anno: response[i].anno,
            COND: response[i].COND,
          });
        }
        count++;
      }

      return rows;
    },
    async getContaminantes(ctx) {
      let data = ctx.query.filters;
      
      let data1 = [],
        data2 = [],
        data3 = [];
      let rows = [];
      
      let response = await strapi.db
        .query("api::cargacontaminante.cargacontaminante")
        .findMany({
          populate: {
            entidad: {
              populate: ["organismo", "osde"],
              }
            },
          orderBy: { anno: "asc" },
        });

      let temp={}
      for (let i = 0; i < response.length; i++) {
        if (response[i].entidad.length > 0) {
          if (response[i].entidad[0].organismo.length == 0)
          response[i].entidad.organismo[0] = { organismo: "-" };
          if (response[i].entidad[0].osde == null) {
            response[i].entidad[0].osde = { nombre: "-" };
          }
          temp={
            id: response[0].id,
            entidad: response[0].entidad[0].entidad,
            DB05: response[0].DB05,
            DQ0: response[0].DQ0,
            Flujo: response[0].Flujo,
            Grasas_aceites: response[0].Grasas_aceites,
            Hidrocarburos: response[0].Hidrocarburos,
            NTK: response[0].NTK,
            PH: response[0].PH,
            PIB: response[0].PIB,
            PT: response[0].PT,
            ST: response[0].ST,
            S_SED: response[0].S_SED,
            TEMP: response[0].TEMP,
            anno: response[0].anno,
            COND: response[0].COND,
            organismo: response[0].entidad[0].organismo[0].organismo,
            osde: response[0].entidad[0].osde.nombre,
          }

          if(response[i].DB05=="-" || response[i].DB05=="NSD" || response[i].DB05=="nds" || response[i].DB05=="nsd") response[i].DB05=temp.DB05
          else temp.DB05=response[i].DB05
          if(response[i].DQ0=="-" || response[i].DQ0=="NSD"|| response[i].DQ0=="nds"|| response[i].DQ0=="nsd") response[i].DQ0=temp.DQ0
          else temp.DQ0=response[i].DQ0
          if(response[i].Grasas_aceites=="-" || response[i].Grasas_aceites=="NSD"|| response[i].Grasas_aceites=="nds"|| response[i].Grasas_aceites=="nsd") response[i].Grasas_aceites=temp.Grasas_aceites
          else temp.Grasas_aceites=response[i].Grasas_aceites
          if(response[i].Hidrocarburos=="-" || response[i].Hidrocarburos=="NSD"|| response[i].Hidrocarburos=="nds"|| response[i].Hidrocarburos=="nsd") response[i].Hidrocarburos=temp.Hidrocarburos
          else temp.Hidrocarburos=response[i].Hidrocarburos
          if(response[i].NTK=="-" || response[i].NTK=="NSD"|| response[i].NTK=="nds"|| response[i].NTK=="nsd") response[i].NTK=temp.NTK
          else temp.NTK=response[i].NTK
          if(response[i].PH=="-" || response[i].PH=="NSD"|| response[i].PH=="nds"|| response[i].PH=="nsd") response[i].PH=temp.PH
          else temp.PH=response[i].PH
          if(response[i].PT=="-" || response[i].PT=="NSD"|| response[i].PT=="nds"|| response[i].PT=="nsd") response[i].PT=temp.PT
          else temp.PT=response[i].PT
          if(response[i].ST=="-" || response[i].ST=="NSD"|| response[i].ST=="nds"|| response[i].ST=="nsd") response[i].ST=temp.ST
          else temp.ST=response[i].ST
          if(response[i].S_SED=="-" || response[i].S_SED=="NSD"|| response[i].S_SED=="nds"|| response[i].S_SED=="nsd") response[i].S_SED=temp.S_SED
          else temp.S_SED=response[i].S_SED
          if(response[i].TEMP=="-" || response[i].TEMP=="NSD"|| response[i].TEMP=="nds"|| response[i].TEMP=="nsd") response[i].TEMP=temp.TEMP
          else temp.TEMP=response[i].TEMP
          if(response[i].COND=="-" || response[i].COND=="NSD"|| response[i].COND=="nds"|| response[i].COND=="nsd") response[i].COND=temp.COND
          else temp.COND=response[i].COND

          rows.push({
            id: response[i].id,
            entidad: response[i].entidad[0].entidad,
            DB05: parseFloat(response[i].DB05),
            DQ0: parseFloat(response[i].DQ0),
            Flujo: parseFloat(10),
            Grasas_aceites: parseFloat(response[i].Grasas_aceites),
            Hidrocarburos: parseFloat(response[i].Hidrocarburos),
            NTK: parseFloat(response[i].NTK),
            PH: parseFloat(response[i].PH),
            PIB: response[i].PIB,
            PT: parseFloat(response[i].PT),
            ST: parseFloat(response[i].ST),
            S_SED: parseFloat(response[i].S_SED),
            TEMP: parseFloat(response[i].TEMP),
            anno: response[i].anno,
            COND: parseFloat(response[i].COND),
            organismo: response[i].entidad[0].organismo[0].organismo,
            osde: response[i].entidad[0].osde.nombre,
          });
        }
      }

      const filteredRows = rows.filter(row => row.anno == data[0]);
      console.log(filteredRows);

      let test=parseFloat("353,8 mg L-1")
      console.log(test);
      if (data[1] == "OACE") {
        for (let index = 0; index < data[2].split(",").length; index++) {
          filteredRows.forEach((element) => {
            switch (data[4]) {
              case "DB05": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data3[index]) {
                    data3[index] = calculoFlujo(element.DB05,element.Flujo);
                  } else {
                    data3[index] += calculoFlujo(element.DB05,element.Flujo);
                  }
                }
                break;
              }
              case "DQ0": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data3[index]) {
                    data3[index] = calculoFlujo(element.DQ0,element.Flujo);
                  } else {
                    data3[index] += calculoFlujo(element.DQ0,element.Flujo);
                  }
                }
                break;
              }
              case "PT": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data3[index]) {
                    data3[index] = calculoFlujo(element.PT,element.Flujo);
                  } else {
                    data3[index] += calculoFlujo(element.PT,element.Flujo);
                  }
                }
                break;
              }
              case "NTK": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data3[index]) {
                    data3[index] = calculoFlujo(element.NTK,element.Flujo);
                  } else {
                    data3[index] += calculoFlujo(element.NTK,element.Flujo);
                  }
                }
                break;
              }
              case "ST": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data3[index]) {
                    data3[index] = calculoFlujo(element.ST,element.Flujo);
                  } else {
                    data3[index] += calculoFlujo(element.ST,element.Flujo);
                  }
                }
                break;
              }
              case "Hidrocarburos": {
                if (element.organismo == data[2].split(",")[index]) {
                  if (!data3[index]) {
                    data3[index] = calculoFlujo(element.Hidrocarburos,element.Flujo);
                  } else {
                    data3[index] += calculoFlujo(element.Hidrocarburos,element.Flujo);
                  }
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
          filteredRows.forEach((element) => {
            switch (data[4]) {
              case "DB05": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data3[index]) {
                    data3[index] = calculoFlujo(element.DB05,element.Flujo);
                  } else {
                    data3[index] += calculoFlujo(element.DB05,element.Flujo);
                  }
                }
                break;
              }
              case "DQ0": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data3[index]) {
                    data3[index] = calculoFlujo(element.DQ0,element.Flujo);
                  } else {
                    data3[index] += calculoFlujo(element.DQ0,element.Flujo);
                  }
                }
                break;
              }
              case "PT": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data3[index]) {
                    data3[index] = calculoFlujo(element.PT,element.Flujo);
                  } else {
                    data3[index] += calculoFlujo(element.PT,element.Flujo);
                  }
                }
                break;
              }
              case "NTK": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data3[index]) {
                    data3[index] = calculoFlujo(element.NTK,element.Flujo);
                  } else {
                    data3[index] += calculoFlujo(element.NTK,element.Flujo);
                  }
                }
                break;
              }
              case "ST": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data3[index]) {
                    data3[index] = calculoFlujo(element.ST,element.Flujo);
                  } else {
                    data3[index] += calculoFlujo(element.ST,element.Flujo);
                  }
                }
                break;
              }
              case "Hidrocarburos": {
                if (element.osde == data[3].split(",")[index]) {
                  if (!data3[index]) {
                    data3[index] = calculoFlujo(element.Hidrocarburos,element.Flujo);
                  } else {
                    data3[index] += calculoFlujo(element.Hidrocarburos,element.Flujo);
                  }
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
    }
  })
);

function calculoFlujo(carga,flujo) {
  return ((carga*flujo)*313/1000000).toFixed(2)
}