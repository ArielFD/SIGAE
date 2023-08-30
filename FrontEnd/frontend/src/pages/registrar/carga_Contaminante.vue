<template>
  <div class="col-12">
    <q-card class="my-card q-ma-md bg-primary" bordered>
      <q-card-section>
        <q-table
          class="my-sticky-header-table"
          title="Carga contaminante"
          dense
          :rows="data.rows"
          :columns="columns"
          row-key="name"
          :selected-rows-label="getSelectedString"
          selection="single"
          v-model:selected="selected"
          v-model:pagination="pagination"
          :filter="filter"
          wrap-cells
        >
          <template v-slot:top>
            <div style="width: 100%" class="row justify-between">
              <div class="col-3 text-h6">Carga contaminante</div>
              <div class="col-6" style="max-width: 300px">
                <q-input dense debounce="400" color="primary" v-model="filter">
                  <template v-slot:prepend v-if="filter">
                    <q-btn
                      flat
                      round
                      color="secondary"
                      icon="close"
                      class="col-1"
                      @click="filter = ''"
                    />
                  </template>
                  <template v-slot:prepend v-else>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions class="justify-end">
        <q-btn
          no-caps
          class="text-white bg-secondary"
          @click="(data.cardCreate = true), clear()"
          >Insertar</q-btn
        >
        <q-dialog v-model="data.cardCreate" persistent>
          <q-card class="my-card bg-primary" flat bordered>
            <q-item>
              <q-item-section>
                <q-item-label><b>Nueva: "Carga Contaminante"</b></q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
            <form @submit.prevent.stop="onCreate">
              <q-card-section>
                <div>
                  <div class="row">
                    <q-select
                      class="col-8 q-mr-xl text-black"
                      use-input
                      input-debounce="0"
                      dense
                      outlined
                      v-model="model"
                      :options="options"
                      @filter="filterFn"
                      label="Entidad"
                      lazy-rules
                      :rules="alerts.inputRules"
                      ref="modelo"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data.año"
                      type="number"
                      hint="Año"
                      class="col-2"
                    />
                  </div>
                  <div class="column items-start">
                    <q-input
                      outlined
                      dense
                      v-model="data._DB05"
                      type="number"
                      step="0.01"
                      label="DB0₅(mg/l)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data._DQ0"
                      type="number"
                      step="0.01"
                      label="DQ0(mg/l)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data._PT"
                      type="number"
                      step="0.01"
                      label="PT(mg/l)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data._NTK"
                      type="number"
                      step="0.01"
                      label="NTK(mg/l)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data._ST"
                      type="number"
                      step="0.01"
                      label="ST(mg/l)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data._SSED"
                      type="number"
                      step="0.01"
                      label="S.SED(mg/l)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data._PH"
                      type="number"
                      step="0.01"
                      label="pH(U)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data._TEMP"
                      type="number"
                      step="0.01"
                      label="TEMP(⁰C)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data._COND"
                      type="number"
                      step="0.01"
                      label="COND(µS/cm)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data.Hidrocarburos"
                      type="number"
                      step="0.01"
                      label="Hidrocarburos(mg/l)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data.Flujo"
                      type="number"
                      step="0.01"
                      label="Flujo(m³/día)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data.Grasas"
                      type="number"
                      step="0.01"
                      label="Grasas y aceites(mg/l)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                  </div>
                </div>
              </q-card-section>

              <q-separator dark />

              <q-card-actions class="justify-end">
                <q-btn no-caps class="text-white bg-secondary" type="submit"
                  >Agregar</q-btn
                >
                <q-btn
                  no-caps
                  class="text-white bg-secondary"
                  @click="clear"
                  v-close-popup
                  >Cerrar</q-btn
                >
              </q-card-actions>
            </form>
          </q-card>
        </q-dialog>
        <q-btn no-caps class="text-white bg-secondary" @click="editFields"
          >Editar</q-btn
        >
        <q-dialog v-model="data.cardEdit" persistent>
          <q-card class="my-card bg-primary" flat bordered>
            <q-item>
              <q-item-section>
                <q-item-label><b>Editar: "Carga Contaminante"</b></q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
            <form @submit.prevent.stop="onEdit">
              <q-card-section>
                <div>
                  <div class="row">
                    <q-select
                      class="col-8 q-mr-xl text-black"
                      use-input
                      input-debounce="0"
                      dense
                      outlined
                      v-model="data.entidadEdit"
                      :options="options"
                      @filter="filterFn"
                      label="Entidad"
                      lazy-rules
                      :rules="alerts.inputRules"
                      ref="modeloEdit"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data.añoEdit"
                      type="number"
                      hint="Año"
                      class="col-2"
                    />
                  </div>
                  <div class="column items-start">
                    <q-input
                      outlined
                      dense
                      v-model="data._DB05Edit"
                      type="number"
                      step="0.01"
                      label="DB0₅(mg/l)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data._DQ0Edit"
                      type="number"
                      step="0.01"
                      label="DQ0(mg/l)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data._PTEdit"
                      type="number"
                      step="0.01"
                      label="PT(mg/l)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data._NTKEdit"
                      type="number"
                      step="0.01"
                      label="NTK(mg/l)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data._STEdit"
                      type="number"
                      step="0.01"
                      label="ST(mg/l)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data._SSEDEdit"
                      type="number"
                      step="0.01"
                      label="S.SED(mg/l)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data._PHEdit"
                      type="number"
                      step="0.01"
                      label="pH(U)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data._TEMPEdit"
                      type="number"
                      step="0.01"
                      label="TEMP(⁰C)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data._CONDEdit"
                      type="number"
                      step="0.01"
                      label="COND(µS/cm)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data.HidrocarburosEdit"
                      type="number"
                      step="0.01"
                      label="Hidrocarburos(mg/l)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data.FlujoEdit"
                      type="number"
                      step="0.01"
                      label="Flujo(m³/día)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                    <q-input
                      outlined
                      dense
                      v-model="data.GrasasEdit"
                      type="number"
                      step="0.01"
                      label="Grasas y aceites(mg/l)"
                      class="col-2 q-pa-xs"
                      min="0.00"
                    />
                  </div>
                </div>
              </q-card-section>

              <q-separator dark />

              <q-card-actions class="justify-end">
                <q-btn no-caps class="text-white bg-secondary" type="submit"
                  >Editar</q-btn
                >
                <q-btn
                  no-caps
                  class="text-white bg-secondary"
                  @click="clear"
                  v-close-popup
                  >Cerrar</q-btn
                >
              </q-card-actions>
            </form>
          </q-card>
        </q-dialog>
        <q-btn no-caps class="text-white bg-secondary" @click="Delete"
          >Eliminar</q-btn
        >
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { api } from "boot/axios.js";
import { useAuthStore } from "src/stores/auth-store";
import { useAlertsRulesStore } from "src/stores/alerts-rules-store";
import { useQuasar } from "quasar";
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
    name: "anno",
    align: "center",
    label: "Año",
    field: "anno",
    sortable: true,
  },
  {
    name: "DB05",
    align: "center",
    label: "DB0₅",
    field: "DB05",
    sortable: true,
  },
  {
    name: "DQ0",
    align: "center",
    label: "DQ0",
    field: "DQ0",
    sortable: true,
  },
  {
    name: "PT",
    align: "center",
    label: "PT",
    field: "PT",
    sortable: true,
  },
  {
    name: "NTK",
    align: "center",
    label: "NTK",
    field: "NTK",
    sortable: true,
  },
  {
    name: "S_SED",
    align: "center",
    label: "SSED",
    field: "S_SED",
    sortable: true,
  },
  {
    name: "PH",
    align: "center",
    label: "pH",
    field: "PH",
    sortable: true,
  },
  {
    name: "TEMP",
    align: "center",
    label: "TEMP",
    field: "TEMP",
    sortable: true,
  },
  {
    name: "COND",
    align: "center",
    label: "COND",
    field: "COND",
    sortable: true,
  },
  {
    name: "Hidrocarburos",
    align: "center",
    label: "Hidrocarburos",
    field: "Hidrocarburos",
    sortable: true,
  },
  {
    name: "Flujo",
    align: "center",
    label: "Flujo",
    field: "Flujo",
    sortable: true,
  },
  {
    name: "Grasas_aceites",
    align: "center",
    label: "Grasas y Aceites",
    field: "Grasas_aceites",
    sortable: true,
  },
];

const stringOptions = [];
const model = ref([]);
const options = ref(stringOptions);

const modelo = ref(null);
const modeloEdit = ref(null);

let data = reactive({
  fecha_actual: new Date(),
  rows: [],
  _DB05: "0",
  _DQ0: "0",
  _PT: "0",
  _NTK: "0",
  _ST: "0",
  _SSED: "0",
  _PH: "0",
  _TEMP: "0",
  _COND: "0",
  Hidrocarburos: "0",
  Flujo: "0",
  Grasas: "0",
  año: "0",

  _DB05Edit: "0",
  _DQ0Edit: "0",
  _PTEdit: "0",
  _NTKEdit: "0",
  _STEdit: "0",
  _SSEDEdit: "0",
  _PHEdit: "0",
  _TEMPEdit: "0",
  _CONDEdit: "0",
  HidrocarburosEdit: "0",
  FlujoEdit: "0",
  GrasasEdit: "0",
  añoEdit: "0",
  entidadEdit: "",

  entidades: [],
  tempEntidad: "",
  identidadEdit: "",

  cardEdit: false,
  cardCreate: false,
});

function clear(params) {
  (data._DB05 = "0"),
    (data._DQ0 = "0"),
    (data._PT = "0"),
    (data._NTK = "0"),
    (data._ST = "0"),
    (data._SSED = "0"),
    (data._PH = "0"),
    (data._TEMP = "0"),
    (data._COND = "0"),
    (data.Hidrocarburos = "0"),
    (data.Flujo = "0"),
    (data.Grasas = "0"),
    (data.año = data.fecha_actual);
  model.value = [];
}

function filterFn(val, update) {
  if (val === "") {
    update(() => {
      options.value = stringOptions;

      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = stringOptions.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
}

onMounted(() => {
  getYear();
  getContaminantes();
  getEntidad();
});

function getYear(params) {
  data.fecha_actual = data.fecha_actual.getFullYear();
  data.año = data.fecha_actual;
}

function editFields(params) {
  (data._DB05Edit = selected.value[0].DB05),
    (data._DQ0Edit = selected.value[0].DQ0),
    (data._PTEdit = selected.value[0].PT),
    (data._NTKEdit = selected.value[0].NTK),
    (data._STEdit = selected.value[0].STE),
    (data._SSEDEdit = selected.value[0].S_SED),
    (data._PHEdit = selected.value[0].PH),
    (data._TEMPEdit = selected.value[0].TEMP),
    (data._CONDEdit = selected.value[0].COND),
    (data.HidrocarburosEdit = selected.value[0].Hidrocarburos),
    (data.FlujoEdit = selected.value[0].Flujo),
    (data.GrasasEdit = selected.value[0].Grasas_aceites),
    (data.añoEdit = selected.value[0].anno),
    (data.entidadEdit = selected.value[0].entidad),
    (data.cardEdit = true);
}

function Edit(params) {
  data.entidades.forEach((element) => {
    if (element.entidad == data.entidadEdit) {
      data.identidadEdit = [{ id: element.id }];
    }
  });

  const dataRest = {
    data: {
      COND: data._CONDEdit,
      DB05: data._DB05Edit,
      DQ0: data._DQ0Edit,
      Flujo: data.FlujoEdit,
      Grasas_aceites: data.GrasasEdit,
      Hidrocarburos: data.HidrocarburosEdit,
      NTK: data._NTKEdit,
      PH: data._PHEdit,
      PT: data._PTEdit,
      ST: data._STEdit,
      S_SED: data._SSEDEdit,
      TEMP: data._TEMPEdit,
      anno: data.añoEdit,
      entidad: data.identidadEdit,
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .put(`/cargacontaminantes/${selected.value[0].id}`, dataRest, authorization)
    .then(function (response) {
      ////console.log(response);
      data.cardEdit = false;
      alerts.alerts[1].message = "Carga contaminate editada";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Carga contaminate editada", "Satisfactorio");
      getContaminantes();
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo editando la Carga contaminate";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Carga contaminate editada", "Fallo");
      console.log(error);
    });

  selected.value = [];
}

function Create() {
  data.entidades.forEach((element) => {
    if (element.entidad == model.value) data.tempEntidad = [{ id: element.id }];
  });
  const dataRest = {
    data: {
      COND: data._COND,
      DB05: data._DB05,
      DQ0: data._DQ0,
      Flujo: data.Flujo,
      Grasas_aceites: data.Grasas,
      Hidrocarburos: data.Hidrocarburos,
      NTK: data._NTK,
      PH: data._PH,
      PT: data._PT,
      ST: data._ST,
      S_SED: data._SSED,
      TEMP: data._TEMP,
      anno: data.año,
      entidad: data.tempEntidad,
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .post("/cargacontaminantes", dataRest, authorization)
    .then(function (response) {
      ////console.log(response);
      data.cardCreate = false;
      alerts.alerts[1].message = "Carga contaminate creada";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Carga contaminate creada", "Satisfactorio");
      getContaminantes();
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo creando la Carga contaminate";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Carga contaminate creada", "Fallo");
      console.log(error);
    });
}

function Delete(params) {
  for (let index = 0; index < selected.value.length; index++) {
    api
      .delete(`/cargacontaminantes/${selected.value[index].id}`, {
        headers: {
          Authorization: "Bearer " + auth.jwt,
        },
      })
      .then(function (response) {
        alerts.alerts[1].message = "Carga contaminate eliminada";
        $q.notify(alerts.alerts[1]);
        auth.postTraza("Carga contaminate eliminada", "Satisfactorio");
        getContaminantes();
      })
      .catch(function (error) {
        alerts.alerts[0].message = "Fallo eliminando la Carga contaminate";
        $q.notify(alerts.alerts[0]);
        auth.postTraza("Carga contaminate eliminada", "Fallo");
        console.log(error);
      });
  }
  selected.value = [];
}

function getEntidad(params) {
  data.entidades = dataStore.entidad;
  data.entidades.forEach((element) => {
    stringOptions.push(element.entidad);
  });
}

async function getContaminantes(params) {
  selected.value = [];
  data.rows = [];

  await api
    .get(`/getCargacontaminante`, {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      data.rows = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getSelectedString() {
  return selected.value.length === 0
    ? ""
    : `${selected.value.length} record${
        selected.value.length > 1 ? "s" : ""
      } selected of ${data.rows.length}`;
}

function onCreate() {
  modelo.value.validate();

  if (data._DB05 == 0) data._DB05 = "-";
  if (data._DQ0 == 0) data._DQ0 = "-";
  if (data._PT == 0) data._PT = "-";
  if (data._NTK == 0) data._NTK = "-";
  if (data._ST == 0) data._ST = "-";
  if (data._SSED == 0) data._SSED = "-";
  if (data._PH == 0) data._PH = "-";
  if (data._TEMP == 0) data._TEMP = "-";
  if (data._COND == 0) data._COND = "-";
  if (data.Hidrocarburos == 0) data.Hidrocarburos = "-";
  if (data.Flujo == 0) data.Flujo = "-";
  if (data.Grasas == 0) data.Grasas = "-";

  if (modelo.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Create();
  }
}

function onEdit() {
  modeloEdit.value.validate();

  if (data._DB05Edit == 0) data._DB05Edit = "-";
  if (data._DQ0Edit == 0) data._DQ0Edit = "-";
  if (data._PTEdit == 0) data._PTEdit = "-";
  if (data._NTKEdit == 0) data._NTKEdit = "-";
  if (data._STEdit == 0) data._STEdit = "-";
  if (data._SSEDEdit == 0) data._SSEDEdit = "-";
  if (data._PHEdit == 0) data._PHEdit = "-";
  if (data._TEMPEdit == 0) data._TEMPEdit = "-";
  if (data._CONDEdit == 0) data._CONDEdit = "-";
  if (data.HidrocarburosEdit == 0) data.HidrocarburosEdit = "-";
  if (data.FlujoEdit == 0) data.FlujoEdit = "-";
  if (data.GrasasEdit == 0) data.GrasasEdit = "-";

  if (modeloEdit.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Edit();
  }
}
</script>

