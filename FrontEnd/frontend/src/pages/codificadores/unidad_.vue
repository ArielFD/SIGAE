<template>
  <div>
    <q-card class="my-card q-ma-md bg-primary" bordered>
      <q-card-section>
        <q-table
          title="Unidades"
          :rows="data.rows"
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
              <div class="text-h6">Nueva unidad</div>
            </q-card-section>
            <form @submit.prevent.stop="onCreate">
            <q-card-section class="q-pa-sm">
              <q-input
                outlined
                dense
                v-model="data.nameunidad"
                label="Nombre de la unidad"
                class="my-input"
                lazy-rules
                :rules="alerts.inputRules"
                ref="nameunidad"
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
              <div class="text-h6">Editar unidad</div>
            </q-card-section>
            <form @submit.prevent.stop="onEdit">
            <q-card-section class="q-pa-sm">
              <q-input
                outlined
                dense
                v-model="data.unidadEdit"
                label="Nombre de la unidad"
                class="my-input"
                lazy-rules
                :rules="alerts.inputRules"
                ref="unidadEdit"
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
    label: "Nombre",
    field: "Nombre",
    sortable: true,
  },
];

const nameunidad = ref(null);
const unidadEdit = ref(null);

let data = reactive({
  nameunidad: "",
  idUnidad: "",
  noUnidad: "",
  rows: [],

  unidadEdit: "",
  cardEdit: false,
  cardCreate: false,
});

onMounted(() => {
  getUnidads();
});

function editFields(params) {
  (data.unidadEdit = selected.value[0].Nombre), (data.cardEdit = true);
}

function Edit(params) {
  const dataRest = {
    data: {
      unidad: data.unidadEdit,
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .put(`/unidads/${selected.value[0].id}`, dataRest, authorization)
    .then(function (response) {
      //console.log(response);
      data.cardEdit = false
      alerts.alerts[1].message = "Unidad editada";
      $q.notify(alerts.alerts[1]);
      getUnidads();
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo editando la Unidad";
      $q.notify(alerts.alerts[0]);
      console.log(error.response);
    });

    data.unidadEdit = []
  selected.value = []
}

function Create() {
    const dataRest = {
      data: {
        unidad: data.nameunidad,
      },
    };
  
    const authorization = {
      headers: {
        Authorization: `Bearer ${auth.jwt}`,
      },
    };
  
    api
      .post("/unidads", dataRest, authorization)
      .then(function (response) {
        //console.log(response);
        data.cardCreate = false
      alerts.alerts[1].message = "Unidad creada";
      $q.notify(alerts.alerts[1]);
        getUnidads();
      })
      .catch(function (error) {
        alerts.alerts[0].message = "Fallo creando la Unidad";
      $q.notify(alerts.alerts[0]);
        console.log(error.response);
      });
    
  
}

function Delete(params) {
  api
    .delete(`/unidads/${selected.value[0].id}`, {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      alerts.alerts[1].message = "Unidad eliminada";
      $q.notify(alerts.alerts[1]);
      getUnidads()
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo eliminando la Unidad";
      $q.notify(alerts.alerts[0]);
      console.log(error);
    });
}

function getUnidads(params) {
  console.log(auth.jwt);
  api
    .get("/unidads", {
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
          Nombre: response.data.data[i].attributes.unidad,
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
    : `${selected.value.length} record${
        selected.value.length > 1 ? "s" : ""
      } selected of ${data.rows.length}`;
}

function onCreate() {
  nameunidad.value.validate();

  if (nameunidad.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Create();
  }
}

function onEdit() {
  unidadEdit.value.validate();

  if (unidadEdit.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Edit();
  }
}
</script>