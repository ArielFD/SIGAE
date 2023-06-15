<template>
  <div id="content" class="col-12">
    <!-- <button @click="Import">Importar</button> -->
    <q-card class="my-card q-ma-md bg-primary" id="card" bordered>
      <q-card-section>
        <q-table class="my-sticky-header-table" title="Datos de las Entidades" dense :rows="data.rows"
          :columns="columns" row-key="name" :selected-rows-label="getSelectedString" selection="multiple"
          v-model:selected="selected" v-model:pagination="pagination" :filter="filter" wrap-cells>
          <template v-slot:top>
            <div style="width: 100%" class="row justify-between">
              <div class="col-3 text-h6">Datos de la entidad</div>
              <div class="col" style="max-width: 300px">
                <q-input dense debounce="400" color="primary" v-model="filter">
                  <template v-slot:prepend v-if="filter">
                      <q-btn flat round color="secondary" icon="close" class="col-1" @click="filter=''" />
                    </template>
                    <template v-slot:prepend v-else>
                      <q-icon name="search" />
                    </template>
                </q-input>
              </div>
              <q-btn color="secondary" icon-right="archive" label="Exportar a Excel" no-caps @click="exportTable" :to="{ name: 'test' } " target='_blank'/>
              <q-btn color="secondary" label="Cambiar el nombre de la Entidad" no-caps @click="editNombre" />
              <q-dialog v-model="data.cardCambiar">
                <q-card class="my-card bg-primary" style="width: 400px" flat bordered>
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
        <q-btn no-caps class="text-white bg-secondary" @click="data.cardCreate = true, clear()">Insertar</q-btn>
        <q-dialog v-model="data.cardCreate" persistent>
          <q-card class="my-card bg-primary" flat bordered>
            <q-item>
              <q-item-section>
                <q-item-label><b>Nueva: "Entidad"</b></q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
            <form @submit.prevent.stop="onCreate">
              <q-card-section>
                <div class="row justify-between">
                  <q-input outlined dense v-model="data.entidad" type="text" label="Nombre de la Entidad"
                    class="col-12 q-pa-xs" lazy-rules :rules="alerts.inputRules" ref="entidad"/>
                  <q-input outlined dense v-model="data.director" type="text" label="Nombre del Director"
                    class="col-6 q-pa-xs" lazy-rules :rules="alerts.inputRules" ref="director"/>
                  <q-input outlined dense v-model="data.coordinador" type="text" label="Nombre del Coordinador"
                    class="col-6 q-pa-xs" lazy-rules :rules="alerts.inputRules" ref="coordinador"/>
                  <q-input outlined dense v-model="data.telefono" type="text" label="Teléfono" class="col-4 q-pa-xs" lazy-rules :rules="alerts.inputRules" ref="telefono" mask="# ### ####"/>
                  <q-input outlined dense v-model="data.trabajadores" type="number" label="Trabajadores"
                    class="col-3 q-pa-xs" lazy-rules :rules="alerts.inputRules" ref="trabajadores" min="0"/>
                  <q-input outlined dense v-model="data.PIB" type="text" label="PIB" class="col-3 q-pa-xs" lazy-rules :rules="alerts.inputRules" ref="PIB"/>
                  <q-select class="col-6 text-black q-pa-xs" dense outlined v-model="data.fuente"
                    :options="data.fuentes" label="Tipo de fuente" lazy-rules :rules="alerts.inputRules" ref="fuente"/>
                  <q-select class="col-6 text-black q-pa-xs" dense outlined v-model="data.municipio"
                    :options="data.municipios" label="Municipio" lazy-rules :rules="alerts.inputRules" ref="municipio"/>
                  <q-select class="col-6 text-black q-pa-xs" dense outlined v-model="data.prioridad"
                    :options="data.prioridades" label="Prioridad" />
                  <q-select class="col-6 text-black q-pa-xs" dense outlined v-model="data.salida"
                    :options="data.salidas" label="Periodo de salida" lazy-rules :rules="alerts.inputRules" ref="salida"/>
                  <q-select class="col-6 text-black q-pa-xs" dense outlined v-model="data.organismo"
                    :options="data.organismos" label="OACE" lazy-rules :rules="alerts.inputRules" ref="organismo"/>
                  <q-select class="col-6 text-black q-pa-xs" dense outlined v-model="data.osde" :options="data.osdes"
                    label="OSDE" lazy-rules :rules="alerts.inputRules" ref="osde"/>
                  <q-input outlined dense v-model="data.objeto" type="textarea" hint="Objeto social"
                    class="col-12 q-pa-xs q-mb-md" lazy-rules :rules="alerts.inputRules" ref="objeto"/>
                  <geo @addLatLon='addLatLon' :LatLon="data.latlon"></geo>
                </div>
              </q-card-section>

              <q-separator dark />

              <q-card-actions class="justify-end">
                <q-btn no-caps class="text-white bg-secondary" type="submit">Agregar</q-btn>
                <q-btn no-caps class="text-white bg-secondary" @click="clear" v-close-popup>Cerrar</q-btn>
              </q-card-actions>
            </form>
          </q-card>
        </q-dialog>
        <q-btn no-caps class="text-white bg-secondary" @click="editFields">Editar</q-btn>
        <q-dialog v-model="data.cardEdit" persistent>
          <q-card class="my-card bg-primary" flat bordered>
            <q-item>
              <q-item-section>
                <q-item-label><b>Editar: "Entidad"</b></q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
            <form @submit.prevent.stop="onEdit">
              <q-card-section>
                <div class="row justify-between">
                  <q-input outlined dense v-model="data.entidadEdit" type="text" readonly label="Nombre de la Entidad"
                    class="col-12 q-pa-xs" lazy-rules :rules="alerts.inputRules" ref="entidadEdit"/>
                  <q-input outlined dense v-model="data.directorEdit" type="text" label="Nombre del Director"
                    class="col-6 q-pa-xs" lazy-rules :rules="alerts.inputRules" ref="directorEdit"/>
                  <q-input outlined dense v-model="data.coordinadorEdit" type="text" label="Nombre del Coordinador"
                    class="col-6 q-pa-xs" lazy-rules :rules="alerts.inputRules" ref="coordinadorEdit"/>
                  <q-input outlined dense v-model="data.telefonoEdit" type="text" label="Teléfono"
                    class="col-4 q-pa-xs" lazy-rules :rules="alerts.inputRules" ref="telefonoEdit" mask="# ### ####"/>
                  <q-input outlined dense v-model="data.trabajadoresEdit" type="number" label="Trabajadores"
                    class="col-3 q-pa-xs" min="0"/>
                  <q-input outlined dense v-model="data.PIBEdit" type="text" label="PIB" class="col-3 q-pa-xs" lazy-rules :rules="alerts.inputRules" ref="PIBEdit"/>
                  <q-select class="col-6 text-black q-pa-xs" dense outlined v-model="data.fuenteEdit"
                    :options="data.fuentes" label="Tipo de fuente" lazy-rules :rules="alerts.inputRules" ref="fuenteEdit"/>
                  <q-select class="col-6 text-black q-pa-xs" dense outlined v-model="data.municipioEdit"
                    :options="data.municipios" label="Municipio" lazy-rules :rules="alerts.inputRules" ref="municipioEdit"/>
                  <q-select class="col-6 text-black q-pa-xs" dense outlined v-model="data.prioridadEdit"
                    :options="data.prioridades" label="Prioridad"  />
                  <q-select class="col-6 text-black q-pa-xs" dense outlined v-model="data.salidaEdit"
                    :options="data.salidas" label="Periodo de salida" lazy-rules :rules="alerts.inputRules" ref="salidaEdit"/>
                  <q-select class="col-6 text-black q-pa-xs" dense outlined v-model="data.organismoEdit"
                    :options="data.organismos" label="OACE" lazy-rules :rules="alerts.inputRules" ref="organismoEdit"/>
                  <q-select class="col-6 text-black q-pa-xs" dense outlined v-model="data.osdeEdit"
                    :options="data.osdes" label="OSDE" lazy-rules :rules="alerts.inputRules" ref="osdeEdit"/>
                  <q-input outlined dense v-model="data.objetoEdit" type="textarea" hint="Objeto social"
                    class="col-12 q-pa-xs q-mb-md" lazy-rules :rules="alerts.inputRules" ref="objetoEdit"/>
                  <geo @addLatLon='addLatLon' :LatLon="data.latlonEdit"></geo>
                </div>
              </q-card-section>

              <q-separator dark />

              <q-card-actions class="justify-end">
                <q-btn no-caps class="text-white bg-secondary" type="submit">Editar</q-btn>
                <q-btn no-caps class="text-white bg-secondary" @click="clear" v-close-popup>Cerrar</q-btn>
              </q-card-actions>
            </form>
          </q-card>
        </q-dialog>
        <q-btn no-caps class="text-white bg-secondary" @click="Delete">Eliminar</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import geo from "components/geolocOpenLayer.vue"
import { onMounted, reactive, ref, watch } from "vue";
import { api } from "boot/axios.js";
import { useAuthStore } from "src/stores/auth-store";
import { useAlertsRulesStore } from "src/stores/alerts-rules-store";
import { exportFile, useQuasar } from 'quasar'
import { useDataStore } from "src/stores/data-store";

const dataStore = useDataStore();
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
    label: "Teléfono",
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

const entidad = ref(null);
const organismo = ref(null);
const municipio = ref(null);
// const prioridad = ref(null);
const salida = ref(null);
const osde = ref(null);
const trabajadores = ref(null);
const objeto = ref(null);
const fuente = ref(null);
const director = ref(null);
const telefono = ref(null);
const coordinador = ref(null);
const PIB = ref(null);

const entidadEdit = ref(null);
const organismoEdit = ref(null);
const municipioEdit = ref(null);
// const prioridadEdit = ref(null);
const salidaEdit = ref(null);
const osdeEdit = ref(null);
const trabajadoresEdit = ref(null);
const objetoEdit = ref(null);
const fuenteEdit = ref(null);
const directorEdit = ref(null);
const telefonoEdit = ref(null);
const coordinadorEdit = ref(null);
const PIBEdit = ref(null);

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
  latlon: [-82.374751, 23.117113],

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
  latlonEdit: [0, 0],

  organismoTemp: "",

  cardCambiar: false,
  cardEdit: false,
  cardCreate: false,

  cargaContaminante: []
});

function clear(params) {
  data.entidad= "",
  data.organismo= "",
  data.municipio= "",
  data.prioridad= "",
  data.salida= "",
  data.osde= "",
  data.trabajadores= "",
  data.objeto= "",
  data.fuente= "",
  data.director= "",
  data.telefono= "",
  data.coordinador= "",
  data.PIB= "",
  data.latlon= [-82.374751, 23.117113]
}

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

function addLatLon(params) {
  data.latlon[0] = params[0]
  data.latlon[1] = params[1]
  data.latlonEdit[0] = params[0]
  data.latlonEdit[1] = params[1]
}

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
    (data.latlonEdit[0] = selected.value[0].longitud),
    (data.latlonEdit[1] = selected.value[0].latitud),
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
    if (element.Nombre == data.prioridadEdit) idPrioridad = { id: element.id }
  });
  data.objSalida.forEach(element => {
    if (element.Nombre == data.salidaEdit) idSalida = { id: element.id }
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
      longitud: data.latlonEdit[0],
      latitud: data.latlonEdit[1],

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
    (data.latlonEdit[0] = selected.value[0].longitud),
    (data.latlonEdit[1] = selected.value[0].latitud),
    (data.cardEdit = true);
}

function Edit(params) {
  let idMunicipio = null
  let idOrganismo = null
  let idPrioridad = null
  let idSalida = null
  let idOsde = null
  data.objMunicipio.forEach(element => {
    if (element.municipio == data.municipioEdit) idMunicipio =  element.id 
  });
  data.objOrganismo.forEach(element => {
    if (element.organismo == data.organismoEdit) idOrganismo = element.id
  });
  data.objPrioridad.forEach(element => {
    if (element.Nombre == data.prioridadEdit) idPrioridad = element.id 
  });
  data.objSalida.forEach(element => {
    if (element.Nombre == data.salidaEdit) idSalida = element.id 
  });
  data.objOsde.forEach(element => {
    if (element.osde == data.osdeEdit) idOsde = element.id 
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
      PIB: data.PIBEdit,
      latitud: data.latlonEdit[1],
      longitud: data.latlonEdit[0],
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
      data.cardEdit = false
      alerts.alerts[1].message = "Entidad editada";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Entidad editada", "Satisfactorio")
      getEntidades();
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo editando la entidad";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Entidad editada", "Fallo")
      console.log(error);
    });

    selected.value = []
}

function Create() {
  let idMunicipio = null
  let idOrganismo = null
  let idPrioridad = null
  let idSalida = null
  let idOsde = null
  data.objMunicipio.forEach(element => {
    if (element.municipio == data.municipio) idMunicipio = element.id 
  });
  data.objOrganismo.forEach(element => {
    if (element.organismo == data.organismo) idOrganismo = element.id
  });
  data.objPrioridad.forEach(element => {
    if (element.Nombre == data.prioridad) idPrioridad =element.id 
  });
  data.objSalida.forEach(element => {
    if (element.Nombre == data.salida) idSalida = element.id 
  });
  data.objOsde.forEach(element => {
    if (element.osde == data.osde) idOsde =  element.id 
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
      activo: "s",
      longitud: data.latlon[0],
      latitud: data.latlon[1]
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
      data.cardCreate = false
      alerts.alerts[1].message = "Entidad creada";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Entidad creada", "Satisfactorio")
      getEntidades();
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo creando la entidad";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Entidad creada", "Fallo")
      console.log(error);
    });
}

watch(() => data.organismo, (value) => {
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
          data.osde=data.osdes[0]
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  });
})

watch(() => data.organismoEdit, (value) => {
  // data.osdeEdit = ""
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
          // data.osdeEdit=data.osdes[0]
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  });
})


function Delete(params) {
  const dataRest = {
    data: {
      activo: "c",
    },
  };
  for (let index = 0; index < selected.value.length; index++) {
    api
      .put(`/entidads/${selected.value[index].id}`,dataRest, {
        headers: {
          Authorization: "Bearer " + auth.jwt,
        },
      })
      .then(function (response) {
        alerts.alerts[1].message = "Entidad eliminada";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Entidad eliminada", "Satisfactorio")
        getEntidades()
      })
      .catch(function (error) {
        alerts.alerts[0].message = "Fallo eliminando la Entidad";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Entidad eliminada", "Fallo")
        console.log(error);
      });

  }
  selected.value = []
}

async function getMunicipios(params) {
  data.objMunicipio=dataStore.municipio
  for (let index = 0; index < data.objMunicipio.length; index++) {
    data.municipios.push(data.objMunicipio[index].municipio);
  }
  
}

async function getOrganismos(params) {
  data.objOrganismo=dataStore.organismo
  for (let index = 0; index < data.objOrganismo.length; index++) {
    data.organismos.push(data.objOrganismo[index].organismo);
  }
}

async function getPrioridad(params) {
  data.objPrioridad=dataStore.prioridad
  for (let index = 0; index < data.objPrioridad.length; index++) {
    data.prioridades.push(data.objPrioridad[index].Nombre);
  }
}

async function getSalida(params) {
  data.objSalida=dataStore.salida
  for (let index = 0; index < data.objSalida.length; index++) {
    data.salidas.push(data.objSalida[index].Nombre);
  }
}

async function getOSDE(params) {
  data.objOsde=dataStore.osde
  for (let index = 0; index < data.objOsde.length; index++) {
    data.osdes.push(data.objOsde[index].nombre);
  }
}

async function getEntidades(params) {
  selected.value = []
    data.rows = [];

    await api
        .get(`/getEntidadesData`, {
            headers: {
                Authorization: "Bearer " + auth.jwt,
            },
        })
        .then(function (response) {
            data.rows = response.data
        }).catch(function (error) {
            console.log(error);
        });
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

function onCreate() {

  entidad.value.validate();
  organismo.value.validate();
  municipio.value.validate();
  // prioridad.value.validate();
  salida.value.validate();
  // osde.value.validate();
  trabajadores.value.validate();
  objeto.value.validate();
  fuente.value.validate();
  director.value.validate();
  telefono.value.validate();
  coordinador.value.validate();
  PIB.value.validate();

  if (entidad.value.hasError || organismo.value.hasError || municipio.value.hasError ||
    salida.value.hasError || osde.value.hasError || trabajadores.value.hasError ||
    objeto.value.hasError || fuente.value.hasError || director.value.hasError ||
    telefono.value.hasError || coordinador.value.hasError || PIB.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Create();
  }
}

function onEdit() {
  entidadEdit.value.validate();
  organismoEdit.value.validate();
  municipioEdit.value.validate();
  // prioridadEdit.value.validate();
  salidaEdit.value.validate();
  // osdeEdit.value.validate();
  // trabajadoresEdit.value.validate();
  objetoEdit.value.validate();
  fuenteEdit.value.validate();
  directorEdit.value.validate();
  telefonoEdit.value.validate();
  coordinadorEdit.value.validate();
  PIBEdit.value.validate();

  if (entidadEdit.value.hasError || organismoEdit.value.hasError || municipioEdit.value.hasError ||
    salidaEdit.value.hasError || osdeEdit.value.hasError  ||
    objetoEdit.value.hasError || fuenteEdit.value.hasError || directorEdit.value.hasError ||
    telefonoEdit.value.hasError || coordinadorEdit.value.hasError || PIBEdit.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Edit();
  }
}

</script>

