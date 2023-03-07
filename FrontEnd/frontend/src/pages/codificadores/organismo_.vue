<template>
  <div>
    <q-card class="my-card q-ma-md bg-primary" bordered style="width: 600px">
      <q-card-section>
        <q-table class="my-sticky-column-table" title="OACE" :rows="data.rows" :columns="columns" dense row-key="name"
          :selected-rows-label="getSelectedString" selection="single" v-model:selected="selected"
          v-model:pagination="pagination">
          <template v-slot:top>
            <q-space />
            <q-btn class="text-white bg-secondary" label="Nuevo OSDE" :to="{ name: 'osde' }" no-caps />
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions class="justify-end">
        <q-btn no-caps class="text-white bg-secondary" @click="data.cardCreate = true">Insertar</q-btn>
        <q-dialog v-model="data.cardCreate">
          <q-card class="my-card bg-primary" style="width: 300px">
            <q-card-section>
              <div class="text-h6">Nuevo Organismo</div>
            </q-card-section>
            <form @submit.prevent.stop="onCreate">
            <q-card-section class="q-pa-sm">
              <q-input outlined dense v-model="data.nameOrganismo" label="Nombre del Organismo" class="my-input"
                lazy-rules :rules="alerts.inputRules" ref="nameOrganismo"/>
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
          <q-card class="my-card bg-primary" style="width: 300px">
            <q-card-section>
              <div class="text-h6">Editar Organismo</div>
            </q-card-section>
            <form @submit.prevent.stop="onEdit">
            <q-card-section class="q-pa-sm">
              <q-input outlined dense v-model="data.organismoEdit" label="Nombre del Organismo" class="my-input"
                lazy-rules :rules="alerts.inputRules"  ref="organismoEdit"/>
              <div class="q-gutter-sm" v-for="(value, key, index) in data.osdes " :key="index">
                <div v-if="value.Oace === data.organismoEdit || value.Oace == null">
                  <q-checkbox v-model="data.selection" :val="value.id" :label="value.Nombre" color="secondary" />
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn v-close-popup flat color="secondary" label="Editar" type="submit" />
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
    label: "OACE",
    field: "Nombre",
    sortable: true,
  },
  {
    name: "Osde",
    align: "center",
    label: "OSDE",
    field: "Osde",
    sortable: true,
  },
];

const nameOrganismo = ref(null);
const organismoEdit = ref(null);

let data = reactive({
  nameOrganismo: "",
  idOrganismo: "",
  noOrganismo: "",
  rows: [],
  selection: [],
  osdes: [],
  osdeEdit: null,
  organismoEdit: "",
  cardEdit: false,
  cardCreate: false,
});

onMounted(() => {
  getOrganismos();
  getOSDEs();
});

function getOSDEs(params) {
  data.osdes = []
  api
    .get("/getOsdes", {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      data.osdes=response.data
    })
    .catch(function (error) {
      console.log(error);
    });
}

function editFields(params) {
  (data.selection = []),
    (data.organismoEdit = selected.value[0].Nombre),
    (data.osdeEdit = selected.value[0].arrOsde), (data.cardEdit = true);
  data.osdeEdit.forEach(element => {
    data.selection.push(element.id)
  });
}

function Edit(params) {
  data.osdeEdit = []
  for (let index = 0; index < data.selection.length; index++) {
    data.osdeEdit.push({ id: data.selection[index] })
  }

  const dataRest = {
    data: {
      organismo: data.organismoEdit,
      osdes: null
    },
  };

  const dataRestNew = {
    data: {
      organismo: data.organismoEdit,
      osdes: data.osdeEdit
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .put(`/organismos/${selected.value[0].id}`, dataRestNew, authorization)
    .then(function (response) {
      data.cardEdit = false
      alerts.alerts[1].message = "OACE editado";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("OACE editado", "Satisfactorio")
      getOrganismos()
      getOSDEs()
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo editando el OACE";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("OACE editado", "Fallo")
      console.log(error);
    });

  data.selection = []
  data.osdeEdit = []
  selected.value = []
}

function Create() {
  const dataRest = {
    data: {
      organismo: data.nameOrganismo,
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .post("/organismos", dataRest, authorization)
    .then(function (response) {
      data.cardCreate = false
      alerts.alerts[1].message = "OACE creado";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("OACE creado", "Satisfactorio")
      getOrganismos();
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo creando el OACE";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("OACE creado", "Fallo")
      console.log(error);
    });
}

function Delete(params) {
  api
    .delete(`/organismos/${selected.value[0].id}`, {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      alerts.alerts[1].message = "OACE eliminado";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("OACE eliminado", "Satisfactorio")
      getOrganismos()
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo eliminando el OACE";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("OACE eliminado", "Fallo")
      console.log(error);
    });
}

function getOrganismos(params) {
  api
    .get("/getOrganismosOsde", {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      data.rows=response.data
    })
    .catch(function (error) {
      console.log(error);
    });
}
function getSelectedString() {
  return selected.value.length === 0
    ? ""
    : `${selected.value.length} record${selected.value.length > 1 ? "s" : ""
    } selected of ${data.rows.length}`;
}

function onCreate() {
  nameOrganismo.value.validate();

  if (nameOrganismo.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Create();
  }
}

function onEdit() {
  organismoEdit.value.validate();

  if (organismoEdit.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Edit();
  }
}
</script>
