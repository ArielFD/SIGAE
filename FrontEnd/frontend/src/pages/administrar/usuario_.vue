<template>
  <div>
    <q-card class="my-card q-ma-md bg-primary" bordered>
      <q-card-section>
        <q-table
          title="Usuarios"
          :rows="data.rows"
          :columns="columns"
          row-key="name"
          selection="single"
          :selected-rows-label="getSelectedString"
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
              <div class="text-h6">Nuevo Usuario</div>
            </q-card-section>

            <q-card-section class="q-pa-sm">
              <q-input
              outlined
              dense
                v-model="data.username"
                label="Nombre de Usuario"
                class="my-input"
                lazy-rules
                :rules="alerts.inputRules"
              />
              <q-input
              outlined
              dense
                v-model="data.email"
                label="Email"
                lazy-rules
                :rules="alerts.emailRules"
              >
                <template v-slot:prepend>
                  <q-icon name="mail" />
                </template>
              </q-input>
              <q-input
              outlined
              dense
                ref="passRef"
                class="q-mb-md my-input"
                v-model="data.password"
                prefix="Password:"
                :type="data.isPwd ? 'password' : 'text'"
                lazy-rules
                :rules="alerts.passRules"
              >
                <template v-slot:append>
                  <q-icon
                    :name="data.isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="data.isPwd = !data.isPwd"
                  />
                </template>
              </q-input>
              <q-select
              outlined
              dense
                v-model="data.rol"
                :options="data.option"
                label="Rol"
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
              <div class="text-h6">Editar Usuario</div>
            </q-card-section>

            <q-card-section class="">
              <q-input
                outlined
                dense
                v-model="data.usernameEdit"
                label="Nombre de Usuario"
                class="my-input"
                lazy-rules
                :rules="alerts.inputRules"
              />
              <q-input
              outlined
              dense
                v-model="data.emailEdit"
                label="Email"
                lazy-rules
                :rules="alerts.emailRules"
              >
                <template v-slot:prepend>
                  <q-icon name="mail" />
                </template>
              </q-input>
              <q-input
              outlined
              dense
                ref="passRef"
                class="my-input q-mb-md"
                v-model="data.passwordEdit"
                prefix="Password:"
                :type="data.isPwd ? 'password' : 'text'"
                lazy-rules
                :rules="alerts.passRules"
              >
                <template v-slot:append>
                  <q-icon
                    :name="data.isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="data.isPwd = !data.isPwd"
                  />
                </template>
              </q-input>
              <q-select
              outlined
              dense
                v-model="data.rolEdit"
                :options="data.option"
                label="Rol"
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
    name: "Usuario",
    align: "center",
    label: "Usuario",
    field: "Usuario",
    sortable: true,
  },
  {
    name: "Rol",
    align: "center",
    label: "Rol",
    field: "Rol",
    sortable: true,
  },
  {
    name: "Contraseña",
    align: "center",
    label: "Contraseña",
    field: "Contraseña",
    sortable: true,
  },
];

let data = reactive({
  username: "",
  idUsuario: "",
  noUsuario: "",
  email: "",
  isPwd: true,
  password: "",
  rol: "",
  rolId: "",
  rows: [],

  usernameEdit: "",
  emailEdit: "",
  passwordEdit: "",
  rolEdit: "",

  cardCreate: false,
  cardEdit: false,

  option: [],
  options: [],
});

onMounted(() => {
  getUsuarios();
  getRoles();
});

function editFields(params) {
  (data.emailEdit = selected.value[0].Email),
    (data.usernameEdit = selected.value[0].Usuario),
    (data.passwordEdit = selected.value[0].Password),
    (data.rolEdit = selected.value[0].Rol),
    (data.cardEdit = true);
}

function Edit(params) {
  data.options.forEach((element) => {
    if (data.rolEdit == element.name) {
      data.rolId = element.id;
    }
  });

  const dataRest = {
    email: data.emailEdit,
    username: data.usernameEdit,
    password: data.passwordEdit,
    role: data.rolId
    
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .put(`/users/${selected.value[0].id}`, dataRest, authorization)
    .then(function (response) {
      console.log(response);
      getUsuarios()
    })
    .catch(function (error) {
      console.log(error.response);
    });
}

function Create() {
  data.options.forEach((element) => {
    if (data.rol == element.name) {
      data.rolId = element.id;
    }
  });

  const dataRest = {
    email: data.email,
    username: data.username,
    password: data.password,
    confirmed: true,
    role: data.rolId,
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .post("/users", dataRest, authorization)
    .then(function (response) {
      console.log(response);
      getUsuarios();
    })
    .catch(function (error) {
      console.log(error.response);
    });
}

function getRoles(params) {
  api
    .get("/users-permissions/roles", {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      response.data.roles.forEach((element) => {
        data.option.push(element.name);
        data.options.push({
          name: element.name,
          id: element.id,
        });
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getUsuarios(params) {
  console.log(auth.jwt);
  api
    .get("/usuarios", {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      console.log(response.data[0]);
      data.rows = [];
      for (let i = 0; i < response.data.length; i++) {
        data.rows.push({
          name: i + 1,
          id: response.data[i].id,
          Usuario: response.data[i].username,
          Contraseña: response.data[i].password,
          Rol: response.data[i].role.name,
          Email: response.data[i].email,
        });
      }
    })
    .catch(function (error) {
      console.log(error.response);
    });
}

function Delete(params) {
  api
    .delete(`/users/${selected.value[0].id}`, {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      getUsuarios()
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
      } selected of ${data.rows.length}`;
}
</script>