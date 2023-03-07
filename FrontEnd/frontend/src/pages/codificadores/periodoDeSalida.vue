<template>
    <div>
      <q-card class="my-card q-ma-md bg-primary" bordered>
        <q-card-section>
          <q-table
            title="Periodo de Salida"
            :rows="dataStore.salida"
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
                <div class="text-h6">Nuevo Periodo de Salida</div>
              </q-card-section>
              <form @submit.prevent.stop="onCreate">
              <q-card-section class="q-pa-sm">
                <q-input
                  outlined
                  dense
                  v-model="data.nameCategoria"
                  label="Nombre del Periodo"
                  class="my-input"
                  lazy-rules
                  :rules="alerts.inputRules"
                  ref="nameCategoria"
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
                <div class="text-h6">Editar Periodo</div>
              </q-card-section>
              <form @submit.prevent.stop="onEdit">
              <q-card-section class="q-pa-sm">
                <q-input
                  outlined
                  dense
                  v-model="data.salidaEdit"
                  label="Nombre del Periodo"
                  class="my-input"
                  lazy-rules
                  :rules="alerts.inputRules"
                  ref="salidaEdit"
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
      label: "Periodo",
      field: "Nombre",
      sortable: true,
    },
  ];
  
  const nameCategoria = ref(null);
const salidaEdit = ref(null);

  let data = reactive({
    nameCategoria: "",
    idCategoria: "",
    noCategoria: "",
    rows: [],
    salidaEdit: "",
    cardEdit: false,
    cardCreate: false,
  });
  
  onMounted(() => {
    getSalidas();
  });
  
  function editFields(params) {
    (data.salidaEdit = selected.value[0].Nombre), (data.cardEdit = true);
  }
  
  function Edit(params) {
    const dataRest = {
      data: {
        salida: data.salidaEdit,
      },
    };
  
    const authorization = {
      headers: {
        Authorization: `Bearer ${auth.jwt}`,
      },
    };
  
    api
      .put(`/salidas/${selected.value[0].id}`, dataRest, authorization)
      .then(function (response) {
        //console.log(response);
        data.cardEdit = false
      alerts.alerts[1].message = "Periodo editado";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Periodo editado", "Satisfactorio")
        getSalidas();
      })
      .catch(function (error) {
        alerts.alerts[0].message = "Fallo editando el Periodo";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Periodo editado", "Fallo")
        console.log(error);
      });

      data.salidaEdit = []
  selected.value = []
  }
  
  function Create() {
    const dataRest = {
      data: {
        salida: data.nameCategoria,
      },
    };
  
    const authorization = {
      headers: {
        Authorization: `Bearer ${auth.jwt}`,
      },
    };
  
    api
      .post("/salidas", dataRest, authorization)
      .then(function (response) {
        //console.log(response);
        data.cardCreate = false
      alerts.alerts[1].message = "Periodo creado";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Periodo creado", "Satisfactorio")
        getSalidas();
      })
      .catch(function (error) {
        alerts.alerts[0].message = "Fallo creando el Periodo";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Periodo creado", "Fallo")
        console.log(error);
      });
  }
  
  function Delete(params) {
    api
      .delete(`/salidas/${selected.value[0].id}`, {
        headers: {
          Authorization: "Bearer " + auth.jwt,
        },
      })
      .then(function (response) {
        alerts.alerts[1].message = "Periodo eliminado";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Periodo eliminado", "Satisfactorio")
        getSalidas()
      })
      .catch(function (error) {
        alerts.alerts[0].message = "Fallo eliminando el Periodo";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Periodo eliminado", "Fallo")
        console.log(error);
      });
  }
  
  function getSalidas(params) {
    api
      .get("/getSalidas", {
        headers: {
          Authorization: "Bearer " + auth.jwt,
        },
      })
      .then(function (response) {
        // console.log(response);
        dataStore.salida = response.data
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
        } selected of ${dataStore.salida.length}`;
  }

  function onCreate() {
    nameCategoria.value.validate();

  if (nameCategoria.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Create();
  }
}

function onEdit() {
  salidaEdit.value.validate();

  if (salidaEdit.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Edit();
  }
}
  </script>