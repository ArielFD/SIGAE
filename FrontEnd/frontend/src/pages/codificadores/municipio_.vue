<template>
  <div>
    <q-card class="my-card q-ma-md bg-primary" bordered >
      <q-card-section>
        <q-table title="Municipios" :rows="dataStore.municipio" :columns="columns" row-key="name" dense
          :selected-rows-label="getSelectedString" selection="single" v-model:selected="selected"
          v-model:pagination="pagination" />
      </q-card-section>

      <q-card-actions class="justify-end">
        <q-btn no-caps class="text-white bg-secondary" @click="data.cardCreate = true">Insertar</q-btn>
        <q-dialog v-model="data.cardCreate">
          <q-card class="my-card bg-primary">
            <q-card-section>
              <div class="text-h6">Nuevo Municipio</div>
            </q-card-section>
            <form @submit.prevent.stop="onCreate">
              <q-card-section class="q-pa-sm">
                <q-input outlined dense v-model="data.nameMunicipio" label="Nombre del Municipio" class="my-input"
                  lazy-rules :rules="alerts.inputRules" ref="nameMunicipio" />
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn flat color="secondary" label="Crear" type="submit" />
              </q-card-actions>
            </form>
          </q-card>
        </q-dialog>
        <q-btn no-caps class="text-white bg-secondary" @click="editFields">Editar</q-btn>
        <q-dialog v-model="data.cardEdit">
          <q-card class="my-card bg-primary">
            <q-card-section>
              <div class="text-h6">Editar Municipio</div>
            </q-card-section>
            <form @submit.prevent.stop="onEdit">
              <q-card-section class="q-pa-sm">
                <q-input outlined dense v-model="data.municipioEdit" label="Nombre del Municipio" class="my-input"
                  lazy-rules :rules="alerts.inputRules" ref="municipioEdit" />
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn flat color="secondary" label="Editar" type="submit" />
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
  rowsPerPage: 10,
});

const $q = useQuasar();
const auth = useAuthStore();
const alerts = useAlertsRulesStore();
const selected = ref([]);
const columns = [
  {
    name: "No",
    required: true,
    label: "No",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "municipio",
    align: "center",
    label: "Municipio",
    field: "municipio",
    sortable: true,
  },
];

const nameMunicipio = ref(null);
const municipioEdit = ref(null);

let data = reactive({
  nameMunicipio: "",
  idMunicipio: "",
  noMunicipio: "",
  rows: [],

  municipioEdit: "",
  cardEdit: false,
  cardCreate: false,
});

onMounted(() => {
  getMunicipios();
});

function editFields(params) {
  (data.municipioEdit = selected.value[0].municipio), (data.cardEdit = true);
}

function Edit(params) {
  const dataRest = {
    data: {
      municipio: data.municipioEdit,
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .put(`/municipios/${selected.value[0].id}`, dataRest, authorization)
    .then(function (response) {
      //console.log(response);
      data.cardEdit = false
      alerts.alerts[1].message = "Municipio editado";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Municipio editado", "Satisfactorio")
      getMunicipios();
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo editando el municipio";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Municipio editado", "Fallo")
      console.log(error.response);
    });

  data.municipioEdit = []
  selected.value = []
}

function Create() {
  const dataRest = {
    data: {
      municipio: data.nameMunicipio,
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .post("/municipios", dataRest, authorization)
    .then(function (response) {
      //console.log(response);
      data.cardCreate = false
      alerts.alerts[1].message = "Municipio creado";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Municipio creado", "Satisfactorio")
      getMunicipios();
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo creando el municipio";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Municipio creado", "Fallo")
      console.log(error.response);
    });


}

function Delete(params) {
  api
    .delete(`/municipios/${selected.value[0].id}`, {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      alerts.alerts[1].message = "Municipio eliminado";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Municipio eliminado", "Satisfactorio")
      getMunicipios()
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo eliminando el municipio";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Municipio eliminado", "Fallo")
      console.log(error);
    });
}

function getMunicipios(params) {
  api
    .get("/getMunicipios", {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      //console.log(response);
      dataStore.municipio=response.data
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getSelectedString() {
  return selected.value.length === 0
    ? ""
    : `${selected.value.length} record${selected.value.length > 1 ? "s" : ""
    } selected of ${dataStore.municipio.length}`;
}

function onCreate() {
  nameMunicipio.value.validate();

  if (nameMunicipio.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Create();
  }
}

function onEdit() {
  municipioEdit.value.validate();

  if (municipioEdit.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Edit();
  }
}
</script>