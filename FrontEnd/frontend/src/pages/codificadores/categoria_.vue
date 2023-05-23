<template>
  <div>
    <q-card class="my-card q-ma-md bg-primary" bordered >
      <q-card-section>
        <q-table
          title="Categorias"
          :rows="dataStore.categoria"
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
          <q-card class="my-card bg-primary" style="width: 300px">
            <q-card-section>
              <div class="text-h6">Nueva Categoria</div>
            </q-card-section>
            <form @submit.prevent.stop="onCreate">
            <q-card-section class="q-pa-sm">
              <q-input
                outlined
                dense
                v-model="data.nameCategoria"
                label="Nombre de la Categoria"
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
              <div class="text-h6">Editar Categoria</div>
            </q-card-section>
            <form @submit.prevent.stop="onEdit">
            <q-card-section class="q-pa-sm">
              <q-input
                outlined
                dense
                v-model="data.categoriaEdit"
                label="Nombre de la Categoria"
                class="my-input"
                lazy-rules
                :rules="alerts.inputRules"
                ref="categoriaEdit"
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
    name: "categoria",
    align: "center",
    label: "Categoria",
    field: "categoria",
    sortable: true,
  },
];

const nameCategoria = ref(null);
const categoriaEdit = ref(null);

let data = reactive({
  nameCategoria: "",
  idCategoria: "",
  noCategoria: "",
  rows: [],
  categoriaEdit: "",
  cardEdit: false,
  cardCreate: false,
});

onMounted(() => {
  getCategorias();
});

function editFields(params) {
  (data.categoriaEdit = selected.value[0].categoria), (data.cardEdit = true);
}

function Edit(params) {
  const dataRest = {
    data: {
      categoria: data.categoriaEdit,
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .put(`/categorias/${selected.value[0].id}`, dataRest, authorization)
    .then(function (response) {
      //console.log(response);
      data.cardEdit = false
      alerts.alerts[1].message = "Categoria editada";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Categoria editada", "Satisfactorio")
      getCategorias();
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo editando la categoria";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Categoria editada", "Fallo")
      console.log(error);
    });

    data.categoriaEdit = []
  selected.value = []
}

function Create() {
  const dataRest = {
    data: {
      categoria: data.nameCategoria,
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .post("/categorias", dataRest, authorization)
    .then(function (response) {
      //console.log(response);
      data.cardCreate = false
      alerts.alerts[1].message = "Categoria creada";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Categoria creada", "Satisfactorio")
      getCategorias();
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo creando la categoria";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Categoria creada", "Fallo")
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
    .put(`/categorias/${selected.value[0].id}`,dataRest, {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      alerts.alerts[1].message = "Categoria eliminada";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Categoria eliminada", "Satisfactorio")
      getCategorias()
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo eliminando la categoria";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Categoria eliminada", "Fallo")
      console.log(error);
    });
}

function getCategorias(params) {
  api
    .get("/getCategoria", {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      // console.log(response);
      dataStore.categoria=response.data
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
      } selected of ${dataStore.categoria.length}`;
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
  categoriaEdit.value.validate();

  if (categoriaEdit.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Edit();
  }
}
</script>