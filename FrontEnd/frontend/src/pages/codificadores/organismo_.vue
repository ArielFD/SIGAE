<template>
  <div>
    <q-card class="my-card q-ma-md bg-primary" bordered>
      <q-card-section>
        <q-table title="OACE" :rows="data.rows" :columns="columns" row-key="name"
          :selected-rows-label="getSelectedString" selection="single" v-model:selected="selected"
          v-model:pagination="pagination">
          <template v-slot:top>
            <q-space />
            <q-btn class="text-white bg-secondary" label="Nuevo OSDE" :to="{ name: 'osde' }" no-caps />
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions class="justify-end">
        <q-btn no-caps class="text-white bg-secondary" @click="data.cardCreate=true">Insertar</q-btn>
        <q-dialog v-model="data.cardCreate">
          <q-card class="my-card bg-primary">
            <q-card-section>
              <div class="text-h6">Nuevo Organismo</div>
            </q-card-section>

            <q-card-section class="q-pa-sm">
              <q-input outlined dense v-model="data.nameOrganismo" label="Nombre del Organismo" class="my-input"
                lazy-rules :rules="alerts.inputRules" />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn v-close-popup flat color="secondary" label="Crear" @click="Create" />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-btn no-caps class="text-white bg-secondary" @click="editFields">Editar</q-btn>
        <q-dialog v-model="data.cardEdit">
          <q-card class="my-card bg-primary" style="max-height: 500px">
            <q-card-section>
              <div class="text-h6">Editar Organismo</div>
            </q-card-section>

            <q-card-section class="q-pa-sm">
              <q-input outlined dense v-model="data.organismoEdit" label="Nombre del Organismo" class="my-input"
                lazy-rules :rules="alerts.inputRules" />
              <div class="q-gutter-sm" v-for="(value,key,index) in data.osdes " :key="index">
                <div v-if="value.Oace===data.organismoEdit || value.Oace==null">
                  <q-checkbox v-model="data.selection" :val="value.id" :label="value.Nombre" color="secondary"/>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn v-close-popup flat color="secondary" label="Editar" @click="Edit" />
            </q-card-actions>
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
  data.osdes=[]
  api
    .get("/osdes?populate=%2A", {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      //console.log(response);
      for (let i = 0; i < response.data.data.length; i++) {
        if(response.data.data[i].attributes.oace.data==null){
          data.osdes.push({
            id: response.data.data[i].id,
            Nombre: response.data.data[i].attributes.nombre,
          });
        }
        else{
          data.osdes.push({
            id: response.data.data[i].id,
            Nombre: response.data.data[i].attributes.nombre,
            Oace: response.data.data[i].attributes.oace.data.attributes.organismo
          });
        }
      }
      console.log(data.osdes);
    })
    .catch(function (error) {
      console.log(error.response);
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

  console.log("data.osdeEdit", data.osdeEdit);

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
      console.log("clear", response);
      getOrganismos()
      getOSDEs()
    })
    .catch(function (error) {
      console.log(error.response);
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
      //console.log(response);
      getOrganismos();
    })
    .catch(function (error) {
      console.log(error.response);
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
      getOrganismos()
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getOrganismos(params) {
  api
    .get("/organismos?populate=%2A", {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      //console.log(response);
      data.rows = [];
      for (let i = 0; i < response.data.data.length; i++) {
        let arr = []
        let arrEdit = []
        for (let index = 0; index < response.data.data[i].attributes.osdes.data.length; index++) {
          const element = response.data.data[i].attributes.osdes.data[index].attributes.nombre;
          const id = response.data.data[i].attributes.osdes.data[index].id;
          arr.push(element)
          arrEdit.push({ id })
        }
        data.rows.push({
          name: i + 1,
          id: response.data.data[i].id,
          Nombre: response.data.data[i].attributes.organismo,
          Osde: arr.join(", "),
          arrOsde: arrEdit
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
</script>