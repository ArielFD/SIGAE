<template>
  <div>
    <q-card class="my-card q-ma-md bg-primary" bordered>
      <q-card-section>
        <q-table
          title="Categorias"
          :rows="data.rows"
          :columns="columns"
          row-key="name"
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
              <div class="text-h6">Nueva Categoria</div>
            </q-card-section>

            <q-card-section class="q-pa-sm">
              <q-input
                outlined
                dense
                v-model="data.nameCategoria"
                label="Nombre de la Categoria"
                class="my-input"
                lazy-rules
                :rules="alerts.inputRules"
              />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn
                v-close-popup
                flat
                color="secondary"
                label="Crear"
                @click="Create"
              />
            </q-card-actions>
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

            <q-card-section class="q-pa-sm">
              <q-input
                outlined
                dense
                v-model="data.categoriaEdit"
                label="Nombre de la Categoria"
                class="my-input"
                lazy-rules
                :rules="alerts.inputRules"
              />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn
                v-close-popup
                flat
                color="secondary"
                label="Editar"
                @click="Edit"
              />
            </q-card-actions>
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

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});
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
  (data.categoriaEdit = selected.value[0].Nombre), (data.cardEdit = true);
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
      console.log(response);
      getCategorias();
    })
    .catch(function (error) {
      console.log(error.response);
    });
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
      console.log(response);
      getCategorias();
    })
    .catch(function (error) {
      console.log(error.response);
    });
}

function Delete(params) {
  api
    .delete(`/categorias/${selected.value[0].id}`, {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      getCategorias()
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getCategorias(params) {
  api
    .get("/categorias", {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      console.log(response);
      data.rows = [];
      for (let i = 0; i < response.data.data.length; i++) {
        data.rows.push({
          name: i + 1,
          id: response.data.data[i].id,
          Nombre: response.data.data[i].attributes.categoria,
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
</script>