<template>
    <div>
      <q-card class="my-card q-ma-md bg-primary" bordered>
        <q-card-section>
          <q-table
            title="Prioridads"
            :rows="dataStore.prioridad"
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
          <q-btn
            no-caps
            class="text-white bg-secondary"
            @click="data.cardCreate = true"
            >Insertar</q-btn
          >
          <q-dialog v-model="data.cardCreate">
            <q-card class="my-card bg-primary">
              <q-card-section>
                <div class="text-h6">Nueva Prioridad</div>
              </q-card-section>
              <form @submit.prevent.stop="onCreate">
              <q-card-section class="q-pa-sm">
                <q-input
                  outlined
                  dense
                  type="number"
                  v-model="data.namePrioridad"
                  label="Prioridad"
                  class="my-input"
                  style="width: 100px"
                  lazy-rules
                  :rules="alerts.inputRules"
                  ref="namePrioridad"
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
                <div class="text-h6">Editar Prioridad</div>
              </q-card-section>
              <form @submit.prevent.stop="onEdit">
              <q-card-section class="q-pa-sm">
                <q-input
                  outlined
                  dense
                  type="number"
                  v-model="data.prioridadEdit"
                  label="Prioridad"
                  class="my-input"
                  style="width: 100px"
                  lazy-rules
                  :rules="alerts.inputRules"
                  ref="prioridadEdit"
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
      name: "Nombre",
      align: "center",
      label: "Prioridad",
      field: "Nombre",
      sortable: true,
    },
  ];
  
  const namePrioridad = ref(null);
const prioridadEdit = ref(null);

  let data = reactive({
    namePrioridad: "",
    idPrioridad: "",
    noPrioridad: "",
    rows: [],
    prioridadEdit: "",
    cardEdit: false,
    cardCreate: false,
  });
  
  onMounted(() => {
    getPrioridads();
  });
  
  function editFields(params) {
    (data.prioridadEdit = selected.value[0].Nombre), (data.cardEdit = true);
  }
  
  function Edit(params) {
    const dataRest = {
      data: {
        prioridad: data.prioridadEdit,
      },
    };
  
    const authorization = {
      headers: {
        Authorization: `Bearer ${auth.jwt}`,
      },
    };
  
    api
      .put(`/prioridads/${selected.value[0].id}`, dataRest, authorization)
      .then(function (response) {
        //console.log(response);
        data.cardEdit = false
      alerts.alerts[1].message = "Prioridad editada";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Prioridad editada", "Satisfactorio")
        getPrioridads();
      })
      .catch(function (error) {
        alerts.alerts[0].message = "Fallo editando la Prioridad";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Prioridad editada", "Fallo")
        console.log(error);
      });

      data.prioridadEdit = []
  selected.value = []
  }
  
  function Create() {
    const dataRest = {
      data: {
        prioridad: data.namePrioridad,
      },
    };
  
    const authorization = {
      headers: {
        Authorization: `Bearer ${auth.jwt}`,
      },
    };
  
    api
      .post("/prioridads", dataRest, authorization)
      .then(function (response) {
        //console.log(response);
        data.cardCreate = false
      alerts.alerts[1].message = "Prioridad creada";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Prioridad creada", "Satisfactorio")
        getPrioridads();
      })
      .catch(function (error) {
        alerts.alerts[0].message = "Fallo creando la Prioridad";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Prioridad creada", "Fallo")
        console.log(error);
      });
  }
  
  function Delete(params) {
    api
      .delete(`/prioridads/${selected.value[0].id}`, {
        headers: {
          Authorization: "Bearer " + auth.jwt,
        },
      })
      .then(function (response) {
        alerts.alerts[1].message = "Prioridad eliminada";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Prioridad eliminada", "Satisfactorio")
        getPrioridads()
      })
      .catch(function (error) {
        alerts.alerts[0].message = "Fallo eliminando la Prioridad";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Prioridad eliminada", "Fallo")
        console.log(error);
      });
  }
  
  function getPrioridads(params) {
    api
      .get("/getPrioridad", {
        headers: {
          Authorization: "Bearer " + auth.jwt,
        },
      })
      .then(function (response) {
        //console.log(response);
        dataStore.prioridad = response.data
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
        } selected of ${dataStore.prioridad.length}`;
  }

  function onCreate() {
    namePrioridad.value.validate();

  if (namePrioridad.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Create();
  }
}

function onEdit() {
  prioridadEdit.value.validate();

  if (prioridadEdit.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Edit();
  }
}
  </script>