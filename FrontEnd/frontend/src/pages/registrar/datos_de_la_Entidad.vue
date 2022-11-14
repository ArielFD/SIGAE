<template>
  <div id="content">
    <button @click="Import">Importar</button>
    <q-card class="my-card q-ma-md bg-primary" bordered>
      <q-card-section>
        <q-table class="my-sticky-header-table" title="Datos de las Entidades" dense :rows="data.rows"
          :columns="columns" row-key="name" :selected-rows-label="getSelectedString" selection="multiple"
          v-model:selected="selected" v-model:pagination="pagination" :filter="filter">
          <template v-slot:top>
            <div style="width: 100%" class="row justify-between">
              <div class="col-3 text-h6">Datos de la entidad</div>
              <div class="col" style="max-width: 300px">
                <q-input dense debounce="400" color="primary" v-model="filter">
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <q-btn color="secondary" icon-right="archive" label="Exportar a Ecxel" no-caps @click="exportTable" />
              <q-btn color="secondary" label="Cambiar el nombre de la Entidad" no-caps @click="editNombre" />
              <q-dialog v-model="data.cardCambiar">
                <q-card class="my-card bg-primary" flat bordered>
                  <q-item>
                    <q-item-section>
                      <q-item-label><b>Editar: "Entidad"</b></q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-separator />

                  <q-card-section>
                    <div>
                      <q-input outlined dense v-model="data.entidadEdit" type="text" label="Nombre de la Entidad"
                        class="q-pa-xs" />
                    </div>
                  </q-card-section>

                  <q-separator dark />

                  <q-card-actions class="justify-end">
                    <q-btn no-caps class="text-white bg-secondary" @click="cambiarNombre">Cambiar</q-btn>
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions class="justify-end">
        <q-btn no-caps class="text-white bg-secondary" @click="data.cardCreate = true">Insertar</q-btn>
        <q-dialog v-model="data.cardCreate">
          <q-card class="my-card bg-primary" flat bordered>
            <q-item>
              <q-item-section>
                <q-item-label><b>Nueva: "Entidad"</b></q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-card-section>
              <div>
                <q-input outlined dense v-model="data.entidad" type="text" label="Nombre de la Entidad"
                  class="q-pa-xs" />
                <q-input outlined dense v-model="data.director" type="text" label="Nombre del Director"
                  class="q-pa-xs" />
                <q-input outlined dense v-model="data.coordinador" type="text" label="Nombre del Coordinador"
                  class="q-pa-xs" />
                <q-input outlined dense v-model="data.telefono" type="text" label="Telefono" class="q-pa-xs" />
                <q-input outlined dense v-model="data.trabajadores" type="number" label="Cantidad de Trabajadores"
                  class="q-pa-xs" />
                <q-select class="text-black q-pa-xs" dense outlined v-model="data.fuente" :options="data.fuentes"
                  label="Tipo de fuente" />
                <q-select class="text-black q-pa-xs" dense outlined v-model="data.municipio" :options="data.municipios"
                  label="Municipio" />
                <q-select class="text-black q-pa-xs" dense outlined v-model="data.prioridad" :options="data.prioridades"
                  label="Prioridad" />
                <q-select class="text-black q-pa-xs" dense outlined v-model="data.salida" :options="data.salidas"
                  label="Periodo de salida" />
                <q-select class="text-black q-pa-xs" dense outlined v-model="data.organismo" :options="data.organismos"
                  label="OACE" />
                <q-select class="text-black q-pa-xs" dense outlined v-model="data.osde" :options="data.osdes"
                  label="OSDE" />
                <q-input outlined dense v-model="data.PIB" type="text" label="PIB" class="q-pa-xs" />
                <q-input outlined dense v-model="data.objeto" type="textarea" hint="Objeto social" class="q-pa-xs" />
              </div>
            </q-card-section>

            <q-separator dark />

            <q-card-actions class="justify-end">
              <q-btn no-caps class="text-white bg-secondary" @click="Create">Agregar</q-btn>
              <q-btn no-caps class="text-white bg-secondary">Limpiar Campos</q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-btn no-caps class="text-white bg-secondary" @click="editFields">Editar</q-btn>
        <q-dialog v-model="data.cardEdit">
          <q-card class="my-card bg-primary" flat bordered>
            <q-item>
              <q-item-section>
                <q-item-label><b>Editar: "Entidad"</b></q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-card-section>
              <div>
                <q-input outlined dense v-model="data.entidadEdit" type="text" label="Nombre de la Entidad"
                  class="q-pa-xs" disable />
                <q-input outlined dense v-model="data.directorEdit" type="text" label="Nombre del Director"
                  class="q-pa-xs" />
                <q-input outlined dense v-model="data.coordinadorEdit" type="text" label="Nombre del Coordinador"
                  class="q-pa-xs" />
                <q-input outlined dense v-model="data.telefonoEdit" type="text" label="Telefono" class="q-pa-xs" />
                <q-input outlined dense v-model="data.trabajadoresEdit" type="number" label="Cantidad de Trabajadores"
                  class="q-pa-xs" />
                <q-select class="text-black q-pa-xs" dense outlined v-model="data.fuenteEdit" :options="data.fuentes"
                  label="Tipo de fuente" />
                <q-select class="text-black q-pa-xs" dense outlined v-model="data.municipioEdit"
                  :options="data.municipios" label="Municipio" />
                <q-select class="text-black q-pa-xs" dense outlined v-model="data.prioridadEdit"
                  :options="data.prioridades" label="Prioridad" />
                <q-select class="text-black q-pa-xs" dense outlined v-model="data.salidaEdit" :options="data.salidas"
                  label="Periodo de salida" />
                <q-select class="text-black q-pa-xs" dense outlined v-model="data.organismoEdit"
                  :options="data.organismos" label="OACE" />
                <q-select class="text-black q-pa-xs" dense outlined v-model="data.osdeEdit" :options="data.osdes"
                  label="OSDE" />
                <q-input outlined dense v-model="data.PIBEdit" type="text" label="PIB" class="q-pa-xs" />
                <q-input outlined dense v-model="data.objetoEdit" type="textarea" hint="Objeto social"
                  class="q-pa-xs" />
              </div>
            </q-card-section>

            <q-separator dark />

            <q-card-actions class="justify-end">
              <q-btn no-caps class="text-white bg-secondary" @click="Edit">Editar</q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-btn no-caps class="text-white bg-secondary" @click="Delete">Eliminar</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { api } from "boot/axios.js";
import { useAuthStore } from "src/stores/auth-store";
import { useAlertsRulesStore } from "src/stores/alerts-rules-store";
import { exportFile, useQuasar } from 'quasar'
import { jsPDF } from "jspdf";

const doc = new jsPDF();
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 17,
});
const $q = useQuasar();
const auth = useAuthStore();
const alerts = useAlertsRulesStore();
const selected = ref([]);
const filter = ref('');
const columns = [
  {
    name: "No",
    required: true,
    align: "center",
    label: "No",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "entidad",
    align: "center",
    label: "Entidad",
    field: "entidad",
    sortable: true,
  },
  {
    name: "organismo",
    align: "center",
    label: "OACE",
    field: "organismo",
    sortable: true,
  },
  {
    name: "osde",
    align: "center",
    label: "OSDE",
    field: "osde",
    sortable: true,
  },
  {
    name: "prioridad",
    align: "center",
    label: "Prioridad",
    field: "prioridad",
    sortable: true,
  },
  {
    name: "salida",
    align: "center",
    label: "Periodo de salida",
    field: "salida",
    sortable: true,
  },
  {
    name: "municipio",
    align: "center",
    label: "Municipio",
    field: "municipio",
    sortable: true,
  },
  {
    name: "fuente",
    align: "center",
    label: "Fuente",
    field: "fuente",
    sortable: true,
  },
  {
    name: "director",
    align: "center",
    label: "Director",
    field: "director",
    sortable: true,
  },
  {
    name: "telefono",
    align: "center",
    label: "Telefono",
    field: "telefono",
    sortable: true,
  },
  {
    name: "coordinador",
    align: "center",
    label: "Coordinador",
    field: "coordinador",
    sortable: true,
  },
  {
    name: "PIB",
    align: "center",
    label: "PIB",
    field: "PIB",
    sortable: true,
  }];

let data = reactive({
  rows: [],
  entidad: "",
  organismo: "",
  organismos: [],
  objOrganismo: [],
  municipio: "",
  municipios: [],
  objMunicipio: [],
  prioridad: "",
  prioridades: [],
  objPrioridad: [],
  salida: "",
  salidas: [],
  objSalida: [],
  osde: "",
  osdes: [],
  objOsde: [],
  trabajadores: "",
  objeto: "",
  fuente: "",
  director: "",
  telefono: "",
  coordinador: "",
  PIB: "",
  fuentes: ["Directa", "Indirecta"],

  entidadEdit: "",
  organismoEdit: "",
  municipioEdit: "",
  trabajadoresEdit: "",
  objetoEdit: "",
  fuenteEdit: "",
  directorEdit: "",
  telefonoEdit: "",
  coordinadorEdit: "",
  salidaEdit: "",
  prioridadEdit: "",
  osdeEdit: "",
  PIBEdit: "",

  organismoTemp: "",

  cardCambiar: false,
  cardEdit: false,
  cardCreate: false,

  cargaContaminante: []
});

onMounted(() => {
  getEntidades()
  getMunicipios()
  getOrganismos()
  getPrioridad()
  getSalida()
  //getContaminantes()

});

//=========================Para importar PIB desde carga contaminante=================================
// function Import(params) {
//   data.rows.forEach(element => {
//     data.cargaContaminante.forEach(elementCarga => {
//       if (elementCarga.entidad == element.entidad) {
//         const dataRest = {
//           data: {
//             PIB: elementCarga.PIB
//           },
//         };

//         const authorization = {
//           headers: {
//             Authorization: `Bearer ${auth.jwt}`,
//           },
//         };

//         api
//           .put(`/entidads/${element.id}`, dataRest, authorization)
//           .then(function (response) {
//             ////console.log(response);
//           })
//           .catch(function (error) {
//             console.log(error.response);
//           });
//       }
//     });
//   });
// }

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0
    ? formatFn(val, row)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

function exportTable() {
  // naive encoding to csv format
  const content = [columns.map(col => wrapCsvValue(col.label))].concat(
    data.rows.map(row => columns.map(col => wrapCsvValue(
      typeof col.field === 'function'
        ? col.field(row)
        : row[col.field === void 0 ? col.name : col.field],
      col.format,
      row
    )).join(','))
  ).join('\r\n')

  const status = exportFile(
    'table-export.xls',
    content,
    'text/csv'
  )

  var elementHTML = document.querySelector("#content")
  doc.html(elementHTML, {
    callback: function (doc) {
      doc.save("sample.pdf")
    },
    x: 5,
    y: 5,
    width: 170,
    windowWidth: 2000
  })

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning'
    })
  }
}

function editNombre(params) {
  (data.entidadEdit = selected.value[0].entidad),
    (data.directorEdit = selected.value[0].director),
    (data.coordinadorEdit = selected.value[0].coordinador),
    (data.telefonoEdit = selected.value[0].telefono),
    (data.trabajadoresEdit = selected.value[0].trabajadores),
    (data.fuenteEdit = selected.value[0].fuente),
    (data.municipioEdit = selected.value[0].municipio),
    (data.organismoEdit = selected.value[0].organismo),
    (data.objetoEdit = selected.value[0].objeto),
    (data.prioridadEdit = selected.value[0].prioridad),
    (data.salidaEdit = selected.value[0].salida),
    (data.osdeEdit = selected.value[0].osde),
    (data.PIBEdit = selected.value[0].PIB),
    (data.cardCambiar = true);
}

function cambiarNombre(params) {

  const dataRest = {
    data: {
      activo: "n"
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .put(`/entidads/${selected.value[0].id}`, dataRest, authorization)
    .then(function (response) {
      ////console.log(response);
      getEntidades();
    })
    .catch(function (error) {
      console.log(error);
    });

  let idMunicipio = []
  let idOrganismo = []
  let idPrioridad = {}
  let idSalida = {}
  let idOsde = {}
  data.objMunicipio.forEach(element => {
    if (element.municipio == data.municipioEdit) idMunicipio = [{ id: element.id }]
  });
  data.objOrganismo.forEach(element => {
    if (element.organismo == data.organismoEdit) idOrganismo = [{ id: element.id }]
  });
  data.objPrioridad.forEach(element => {
    if (element.prioridad == data.prioridadEdit) idPrioridad = { id: element.id }
  });
  data.objSalida.forEach(element => {
    if (element.salida == data.salidaEdit) idSalida = { id: element.id }
  });
  data.objOsde.forEach(element => {
    if (element.osde == data.osdeEdit) idOsde = { id: element.id }
  })
  if (selected.value[0].referencia == "-") selected.value[0].referencia = ""
  const dataCambiar = {
    data: {
      prioridad: idPrioridad,
      salida: idSalida,
      osde: idOsde,
      organismo: idOrganismo,
      municipio: idMunicipio,
      entidad: data.entidadEdit,
      nomb_coordinador: data.coordinadorEdit,
      nomb_director: data.directorEdit,
      num_telefono: data.telefonoEdit,
      cant_trabajadores: data.trabajadoresEdit,
      tipo_fuente: data.fuenteEdit,
      objeto_social: data.objetoEdit,
      PIB: data.PIBEdit,
      activo: "s",
      referencia: `${selected.value[0].referencia}<${selected.value[0].id}>`
    },
  };

  api
    .post(`/entidads`, dataCambiar, authorization)
    .then(function (response) {
      ////console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function editFields(params) {
  (data.entidadEdit = selected.value[0].entidad),
    (data.directorEdit = selected.value[0].director),
    (data.coordinadorEdit = selected.value[0].coordinador),
    (data.telefonoEdit = selected.value[0].telefono),
    (data.trabajadoresEdit = selected.value[0].trabajadores),
    (data.fuenteEdit = selected.value[0].fuente),
    (data.municipioEdit = selected.value[0].municipio),
    (data.organismoEdit = selected.value[0].organismo),
    (data.objetoEdit = selected.value[0].objeto),
    (data.prioridadEdit = selected.value[0].prioridad),
    (data.salidaEdit = selected.value[0].salida),
    (data.osdeEdit = selected.value[0].osde),
    (data.PIBEdit = selected.value[0].PIB),
    (data.cardEdit = true);
}

function Edit(params) {
  let idMunicipio = []
  let idOrganismo = []
  let idPrioridad = {}
  let idSalida = {}
  let idOsde = {}
  data.objMunicipio.forEach(element => {
    if (element.municipio == data.municipioEdit) idMunicipio = [{ id: element.id }]
  });
  data.objOrganismo.forEach(element => {
    if (element.organismo == data.organismoEdit) idOrganismo = [{ id: element.id }]
  });
  data.objPrioridad.forEach(element => {
    if (element.prioridad == data.prioridadEdit) idPrioridad = { id: element.id }
  });
  data.objSalida.forEach(element => {
    if (element.salida == data.salidaEdit) idSalida = { id: element.id }
  });
  data.objOsde.forEach(element => {
    if (element.osde == data.osdeEdit) idOsde = { id: element.id }
  });
  const dataRest = {
    data: {
      prioridad: idPrioridad,
      salida: idSalida,
      osde: idOsde,
      organismo: idOrganismo,
      municipio: idMunicipio,
      entidad: data.entidadEdit,
      nomb_coordinador: data.coordinadorEdit,
      nomb_director: data.directorEdit,
      num_telefono: data.telefonoEdit,
      cant_trabajadores: data.trabajadoresEdit,
      tipo_fuente: data.fuenteEdit,
      objeto_social: data.objetoEdit,
      PIB: data.PIBEdit
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .put(`/entidads/${selected.value[0].id}`, dataRest, authorization)
    .then(function (response) {
      ////console.log(response);
      getEntidades();
    })
    .catch(function (error) {
      console.log(error.response);
    });
}

function Create() {
  let idMunicipio = []
  let idOrganismo = []
  let idPrioridad = {}
  let idSalida = {}
  let idOsde = {}
  data.objMunicipio.forEach(element => {
    if (element.municipio == data.municipio) idMunicipio = [{ id: element.id }]
  });
  data.objOrganismo.forEach(element => {
    if (element.organismo == data.organismo) idOrganismo = [{ id: element.id }]
  });
  data.objPrioridad.forEach(element => {
    if (element.prioridad == data.prioridad) idPrioridad = { id: element.id }
  });
  data.objSalida.forEach(element => {
    if (element.salida == data.salida) idSalida = { id: element.id }
  });
  data.objOsde.forEach(element => {
    if (element.osde == data.osde) idOsde = { id: element.id }
  });
  const dataRest = {
    data: {
      prioridad: idPrioridad,
      salida: idSalida,
      osde: idOsde,
      organismo: idOrganismo,
      municipio: idMunicipio,
      entidad: data.entidad,
      nomb_coordinador: data.coordinador,
      nomb_director: data.director,
      num_telefono: data.telefono,
      cant_trabajadores: data.trabajadores,
      tipo_fuente: data.fuente,
      objeto_social: data.objeto,
      PIB: data.PIB,
      activo: "s"
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .post("/entidads", dataRest, authorization)
    .then(function (response) {
      ////console.log(response);
      getEntidades();
    })
    .catch(function (error) {
      console.log(error.response);
    });
}

watch(() => data.organismo, (value) => {
  console.log("entro1");
  data.osde = ""
  data.osdes = []
  data.objOrganismo.forEach(element => {
    if (element.organismo == value) {
      api
        .get(`/organismos/${element.id}?populate=%2A`, {
          headers: {
            Authorization: "Bearer " + auth.jwt,
          },
        })
        .then(function (response) {
          //console.log(response);
          for (let i = 0; i < response.data.data.attributes.osdes.data.length; i++) {
            data.objOsde.push({
              id: response.data.data.attributes.osdes.data[i].id,
              osde: response.data.data.attributes.osdes.data[i].attributes.nombre
            });
            data.osdes.push(response.data.data.attributes.osdes.data[i].attributes.nombre)
          }

        })
        .catch(function (error) {
          console.log(error);
        });
    }
  });
})

watch(() => data.organismoEdit, (value) => {
  console.log("entro2");
  data.osdeEdit = ""
  data.osdes = []
  data.objOrganismo.forEach(element => {
    if (element.organismo == value) {
      api
        .get(`/organismos/${element.id}?populate=%2A`, {
          headers: {
            Authorization: "Bearer " + auth.jwt,
          },
        })
        .then(function (response) {
          //console.log(response);
          for (let i = 0; i < response.data.data.attributes.osdes.data.length; i++) {
            data.objOsde.push({
              id: response.data.data.attributes.osdes.data[i].id,
              osde: response.data.data.attributes.osdes.data[i].attributes.nombre
            });
            data.osdes.push(response.data.data.attributes.osdes.data[i].attributes.nombre)
            data.osdeEdit = selected.value[0].osde
          }

        })
        .catch(function (error) {
          console.log(error);
        });
    }
  });
})


function Delete(params) {
  for (let index = 0; index < selected.value.length; index++) {
    api
      .delete(`/entidads/${selected.value[index].id}`, {
        headers: {
          Authorization: "Bearer " + auth.jwt,
        },
      })
      .then(function (response) {
        getEntidades()
      })
      .catch(function (error) {
        console.log(error);
      });

  }
  selected.value = []
}

async function getMunicipios(params) {
  let count = 1
  for (let index = 1; index < 2; index++) {
    await api
      .get(`/municipios?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100`, {
        headers: {
          Authorization: "Bearer " + auth.jwt,
        },
      })
      .then(function (response) {
        ////console.log(response);
        for (let i = 0; i < response.data.data.length; i++) {
          data.objMunicipio.push({
            id: response.data.data[i].id,
            municipio: response.data.data[i].attributes.municipio
          });
          data.municipios.push(response.data.data[i].attributes.municipio)
          count++
        }
      })
      .catch(function (error) {
        console.log(error.response);
      });
  }
}

async function getOrganismos(params) {
  let count = 1
  for (let index = 1; index < 2; index++) {
    await api
      .get(`/organismos?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100`, {
        headers: {
          Authorization: "Bearer " + auth.jwt,
        },
      })
      .then(function (response) {
        //console.log(response);
        for (let i = 0; i < response.data.data.length; i++) {
          data.objOrganismo.push({
            id: response.data.data[i].id,
            organismo: response.data.data[i].attributes.organismo
          });
          data.organismos.push(response.data.data[i].attributes.organismo)
          count++
        }
      })
      .catch(function (error) {
        console.log(error.response);
      });
  }
}

async function getPrioridad(params) {
  let count = 1
  for (let index = 1; index < 2; index++) {
    await api
      .get(`/prioridads?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100`, {
        headers: {
          Authorization: "Bearer " + auth.jwt,
        },
      })
      .then(function (response) {
        ////console.log(response);
        for (let i = 0; i < response.data.data.length; i++) {
          data.objPrioridad.push({
            id: response.data.data[i].id,
            prioridad: response.data.data[i].attributes.prioridad
          });
          data.prioridades.push(response.data.data[i].attributes.prioridad)
          count++
        }
      })
      .catch(function (error) {
        console.log(error.response);
      });
  }
}

async function getSalida(params) {
  let count = 1
  for (let index = 1; index < 2; index++) {
    await api
      .get(`/salidas?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100`, {
        headers: {
          Authorization: "Bearer " + auth.jwt,
        },
      })
      .then(function (response) {
        ////console.log(response);
        for (let i = 0; i < response.data.data.length; i++) {
          data.objSalida.push({
            id: response.data.data[i].id,
            salida: response.data.data[i].attributes.salida
          });
          data.salidas.push(response.data.data[i].attributes.salida)
          count++
        }
      })
      .catch(function (error) {
        console.log(error.response);
      });
  }
}

async function getOSDE(params) {
  let count = 1
  for (let index = 1; index < 2; index++) {
    await api
      .get(`/osdes?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100`, {
        headers: {
          Authorization: "Bearer " + auth.jwt,
        },
      })
      .then(function (response) {
        ////console.log(response);
        for (let i = 0; i < response.data.data.length; i++) {
          data.objOsde.push({
            id: response.data.data[i].id,
            osde: response.data.data[i].attributes.nombre
          });
          data.osdes.push(response.data.data[i].attributes.nombre)
          count++
        }
      })
      .catch(function (error) {
        console.log(error.response);
      });
  }
}

async function getEntidades(params) {
  data.rows = [];
  let count = 1
  for (let index = 1; index < 3; index++) {
    await api
      .get(`/entidads?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100&filters[activo][$eq]=s`, {
        headers: {
          Authorization: "Bearer " + auth.jwt,
        },
      })
      .then(function (response) {
        //console.log(response);
        for (let i = 0; i < response.data.data.length; i++) {
          if (response.data.data[i].attributes.organismo.data.length == 0) response.data.data[i].attributes.organismo.data.push({ attributes: { organismo: "-" } })
          if (response.data.data[i].attributes.municipio.data.length == 0) response.data.data[i].attributes.municipio.data.push({ attributes: { municipio: "-" } })
          if (response.data.data[i].attributes.salida.data == null) response.data.data[i].attributes.salida.data = { attributes: { salida: "-" } }
          if (response.data.data[i].attributes.prioridad.data == null) response.data.data[i].attributes.prioridad.data = { attributes: { prioridad: "-" } }
          if (response.data.data[i].attributes.osde.data == null) response.data.data[i].attributes.osde.data = { attributes: { nombre: "-" } }
          data.rows.push({
            name: count,
            id: response.data.data[i].id,
            entidad: response.data.data[i].attributes.entidad,
            municipio: response.data.data[i].attributes.municipio.data[0].attributes.municipio,
            trabajadores: response.data.data[i].attributes.cant_trabajadores,
            objeto: response.data.data[i].attributes.objeto_social,
            coordinador: response.data.data[i].attributes.nomb_coordinador,
            director: response.data.data[i].attributes.nomb_director,
            telefono: response.data.data[i].attributes.num_telefono,
            organismo: response.data.data[i].attributes.organismo.data[0].attributes.organismo,
            fuente: response.data.data[i].attributes.tipo_fuente,
            prioridad: response.data.data[i].attributes.prioridad.data.attributes.prioridad,
            salida: response.data.data[i].attributes.salida.data.attributes.salida,
            osde: response.data.data[i].attributes.osde.data.attributes.nombre,
            referencia: response.data.data[i].attributes.referencia,
            PIB: response.data.data[i].attributes.PIB,
          });
          count++
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

// async function getContaminantes(params) {
//   data.rows = [];
//   let count = 1
//   for (let index = 1; index < 3; index++) {
//     await api
//       .get(`/cargacontaminantes?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100&sort[0]=anno%3Adesc`, {
//         headers: {
//           Authorization: "Bearer " + auth.jwt,
//         },
//       })
//       .then(function (response) {
//         ////console.log(response);
//         for (let i = 0; i < response.data.data.length; i++) {
//           if (response.data.data[i].attributes.entidad.data.length > 0) {
//             data.cargaContaminante.push({
//               name: count,
//               id: response.data.data[i].id,
//               entidad: response.data.data[i].attributes.entidad.data[0].attributes.entidad,
//               PIB: response.data.data[i].attributes.PIB
//             });
//           }
//           count++
//         }
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   }
// }

function getSelectedString() {
  return selected.value.length === 0
    ? ""
    : `${selected.value.length} record${selected.value.length > 1 ? "s" : ""
    } selected of ${data.rows.length}`;
}

</script>

