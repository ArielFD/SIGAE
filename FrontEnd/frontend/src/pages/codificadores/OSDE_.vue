<template>
  <div>
    <q-card class="my-card q-ma-md bg-primary" bordered style="width: 400px">
      <q-card-section>
        <q-table title="OSDE" :rows="data.rows" :columns="columns" row-key="name" dense
          :selected-rows-label="getSelectedString" selection="single" v-model:selected="selected"
          v-model:pagination="pagination">
        </q-table>
      </q-card-section>

      <q-card-actions class="justify-end">
        <q-btn no-caps class="text-white bg-secondary" @click="data.cardCreate = true">Insertar</q-btn>
        <q-dialog v-model="data.cardCreate">
          <q-card class="my-card bg-primary">
            <q-card-section>
              <div class="text-h6">Nuevo OSDE</div>
            </q-card-section>
            <form @submit.prevent.stop="onCreate">
              <q-card-section class="q-pa-sm">
                <q-input outlined dense v-model="data.nameOSDE" label="Nombre del OSDE" class="my-input" lazy-rules
                  :rules="alerts.inputRules" ref="nameOSDE" />
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
              <div class="text-h6">Editar OSDE</div>
            </q-card-section>
            <form @submit.prevent.stop="onEdit">
              <q-card-section class="q-pa-sm">
                <q-input outlined dense v-model="data.osdeEdit" label="Nombre del OSDE" class="my-input" lazy-rules
                  :rules="alerts.inputRules" ref="osdeEdit" />
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
    name: "Nombre",
    align: "center",
    label: "OSDE",
    field: "Nombre",
    sortable: true,
  },
];

const nameOSDE = ref(null);
const osdeEdit = ref(null);

let data = reactive({
  nameOSDE: "",
  idOSDE: "",
  noOSDE: "",
  rows: [],

  osdeEdit: "",
  cardEdit: false,
  cardCreate: false,
});

onMounted(() => {
  getOSDEs();
});

function editFields(params) {
  (data.osdeEdit = selected.value[0].Nombre), (data.cardEdit = true);
}

function Edit(params) {
  const dataRest = {
    data: {
      nombre: data.osdeEdit,
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .put(`/osdes/${selected.value[0].id}`, dataRest, authorization)
    .then(function (response) {
      //console.log(response);
      data.cardEdit = false
      alerts.alerts[1].message = "OSDE editado";
      $q.notify(alerts.alerts[1]);
      getOSDEs();
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo editando el OSDE";
      $q.notify(alerts.alerts[0]);
      console.log(error.response);
    });

  data.osdeEdit = []
  selected.value = []
}

function Create() {
  const dataRest = {
    data: {
      nombre: data.nameOSDE,
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .post("/osdes", dataRest, authorization)
    .then(function (response) {
      //console.log(response);
      data.cardCreate = false
      alerts.alerts[1].message = "OSDE creado";
      $q.notify(alerts.alerts[1]);
      getOSDEs();
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo creando el OSDE";
      $q.notify(alerts.alerts[0]);
      console.log(error.response);
    });
}

function Delete(params) {
  api
    .delete(`/osdes/${selected.value[0].id}`, {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      alerts.alerts[1].message = "OSDE eliminado";
      $q.notify(alerts.alerts[1]);
      getOSDEs()
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo eliminando el OSDE";
      $q.notify(alerts.alerts[0]);
      console.log(error);
    });
}

function getOSDEs(params) {
  console.log(auth.jwt);
  api
    .get("/osdes", {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      //console.log(response);
      data.rows = [];
      for (let i = 0; i < response.data.data.length; i++) {
        data.rows.push({
          name: i + 1,
          id: response.data.data[i].id,
          Nombre: response.data.data[i].attributes.nombre,
        });
      }
    })
    .catch(function (error) {
      console.log(error.response);
    });
}
function getSelectedString() {
  return selected.value.length === 0
    ? ""
    : `${selected.value.length} record${selected.value.length > 1 ? "s" : ""
    } selected of ${data.rows.length}`;
}

function onCreate() {
  nameOSDE.value.validate();

  if (nameOSDE.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Create();
  }
}

function onEdit() {
  osdeEdit.value.validate();

  if (osdeEdit.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Edit();
  }
}
</script>