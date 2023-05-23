<template>
  <div>
    <q-card class="my-card q-ma-md bg-primary" bordered>
      <q-card-section>
        <q-table
          title="Estados"
          :rows="dataStore.estado"
          :columns="columns"
          row-key="name"
          dense
          :selected-rows-label="getSelectedString"
          selection="single"
          v-model:selected="selected"
          v-model:pagination="pagination"
        />
      </q-card-section>

      <q-card-actions class="justify-end">
        <q-btn no-caps class="text-white bg-secondary" @click="data.cardCreate=true"
          >Insertar</q-btn
        >
        <q-dialog v-model="data.cardCreate">
          <q-card class="my-card bg-primary">
            <q-card-section>
              <div class="text-h6">Nuevo Estado</div>
            </q-card-section>
            <form @submit.prevent.stop="onCreate">
            <q-card-section class="q-pa-sm">
              <q-input
                outlined
                dense
                v-model="data.nameEstados"
                label="Nombre del Estado"
                class="my-input"
                lazy-rules
                :rules="alerts.inputRules"
                ref="nameEstados"
              />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn
                flat
                color="secondary"
                label="Crear"
                type="submit"
              />
            </q-card-actions>
          </form>
          </q-card>
        </q-dialog>
        <q-btn no-caps class="text-white bg-secondary" @click="editFields"
          >Editar</q-btn
        >
        <q-dialog v-model="data.cardEdit">
          <q-card class="my-card bg-primary">
            <q-card-section>
              <div class="text-h6">Editar Estado</div>
            </q-card-section>
            <form @submit.prevent.stop="onEdit">
            <q-card-section class="q-pa-sm">
              <q-input
                outlined
                dense
                v-model="data.estadoEdit"
                label="Nombre del Estado"
                class="my-input"
                lazy-rules
                :rules="alerts.inputRules"
                ref="estadoEdit"
              />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn
                flat
                color="secondary"
                label="Editar"
                type="submit"
              />
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
    name: "estado",
    align: "center",
    label: "Estado",
    field: "estado",
    sortable: true,
  },
];

const nameEstados = ref(null);
const estadoEdit = ref(null);

let data = reactive({
  nameEstados: "",
  idEstados: "",
  noEstados: "",
  rows: [],
  estadoEdit: "",
  cardEdit: false,
  cardCreate: false,
});

onMounted(() => {
  getEstados();
});

function editFields(params) {
  (data.estadoEdit = selected.value[0].estado), (data.cardEdit = true);
}

function Edit(params) {
  const dataRest = {
    data: {
      estado: data.estadoEdit,
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .put(`/estados/${selected.value[0].id}`, dataRest, authorization)
    .then(function (response) {
      //console.log(response);
      data.cardEdit = false
      alerts.alerts[1].message = "Estado editado";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Estado editado", "Satisfactorio")
      getEstados();
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo editando el Estado";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Estado editado", "Fallo")
      console.log(error);
    });
}

function Create() {
  const dataRest = {
    data: {
      estado: data.nameEstados,
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .post("/estados", dataRest, authorization)
    .then(function (response) {
      //console.log(response);
      data.cardCreate = false
      alerts.alerts[1].message = "Estado creado";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Estado creado", "Satisfactorio")
      getEstados();
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo creando el Estado";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Estado creado", "Fallo")
      console.log(error);
    });
}

function Delete(params) {
  const dataRest = {
    data: {
      eliminado: true,
    },
  };
  api
    .put(`/estados/${selected.value[0].id}`, dataRest,{
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      alerts.alerts[1].message = "Estado eliminado";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Estado eliminado", "Satisfactorio")
      getEstados()
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo eliminando el Estado";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Estado eliminado", "Fallo")
      console.log(error);
    });
}

function getEstados(params) {
  api
    .get("/getEstados", {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      //console.log(response);
      dataStore.estado=response.data
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
      } selected of ${dataStore.estado.length}`;
}

function onCreate() {
  nameEstados.value.validate();

  if (nameEstados.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Create();
  }
}

function onEdit() {
  estadoEdit.value.validate();

  if (estadoEdit.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Edit();
  }
}
</script>