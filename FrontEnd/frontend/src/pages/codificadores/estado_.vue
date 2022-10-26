<template>
  <div>
    <q-card class="my-card q-ma-md bg-primary" bordered>
      <q-card-section>
        <q-table
          title="Estados"
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
        <q-btn no-caps class="text-white bg-secondary" @click="data.cardCreate=true"
          >Insertar</q-btn
        >
        <q-dialog v-model="data.cardCreate">
          <q-card class="my-card bg-primary">
            <q-card-section>
              <div class="text-h6">Nuevo Estado</div>
            </q-card-section>

            <q-card-section class="q-pa-sm">
              <q-input
                outlined
                dense
                v-model="data.nameEstados"
                label="Nombre del Estado"
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
              <div class="text-h6">Editar Estado</div>
            </q-card-section>

            <q-card-section class="q-pa-sm">
              <q-input
                outlined
                dense
                v-model="data.estadoEdit"
                label="Nombre del Estado"
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
  (data.estadoEdit = selected.value[0].Nombre), (data.cardEdit = true);
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
      getEstados();
    })
    .catch(function (error) {
      console.log(error.response);
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
      getEstados();
    })
    .catch(function (error) {
      console.log(error.response);
    });
}

function Delete(params) {
  api
    .delete(`/estados/${selected.value[0].id}`, {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      getEstados()
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getEstados(params) {
  console.log(auth.jwt);
  api
    .get("/estados", {
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
          Nombre: response.data.data[i].attributes.estado,
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