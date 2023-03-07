<template>
  <div>
    <q-card class="my-card q-ma-md bg-primary" bordered>
      <q-card-section>
        <q-table
          title="Usuarios"
          :rows="data.rows"
          :columns="columns"
          row-key="name"
          dense
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
            <form @submit.prevent.stop="onCreate">
            <q-card-section class="q-pa-sm">
              <q-input
              outlined
              dense
                v-model="data.username"
                label="Nombre de Usuario"
                class="my-input"
                lazy-rules
                :rules="alerts.inputRules"
                ref="username"
              />
              <q-input
              outlined
              dense
                v-model="data.email"
                label="Email"
                lazy-rules
                :rules="alerts.emailRules"
                ref="email"
              >
                <template v-slot:prepend>
                  <q-icon name="mail" />
                </template>
              </q-input>
              <q-input
              outlined
              dense
                class="q-mb-md my-input"
                v-model="data.password"
                prefix="Password:"
                :type="data.isPwd ? 'password' : 'text'"
                lazy-rules
                :rules="alerts.passRules"
                ref="password"
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
                lazy-rules
                :rules="alerts.inputRules"
                ref="rol"
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
              <div class="text-h6">Editar Usuario</div>
            </q-card-section>
            <form @submit.prevent.stop="onEdit">
            <q-card-section class="">
              <q-input
                outlined
                dense
                v-model="data.usernameEdit"
                label="Nombre de Usuario"
                class="my-input"
                lazy-rules
                :rules="alerts.inputRules"
                ref="usernameEdit"
              />
              <q-input
              outlined
              dense
                v-model="data.emailEdit"
                label="Email"
                lazy-rules
                :rules="alerts.emailRules"
                ref="emailEdit"
              >
                <template v-slot:prepend>
                  <q-icon name="mail" />
                </template>
              </q-input>
              <q-input
              outlined
              dense
                class="my-input q-mb-md"
                v-model="data.passwordEdit"
                prefix="Password:"
                :type="data.isPwd ? 'password' : 'text'"
                lazy-rules
                :rules="alerts.passRules"
                ref="passwordEdit"
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
                lazy-rules
                :rules="alerts.inputRules"
                ref="rolEdit"
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
  }
];

const username = ref(null);
const email = ref(null);
const password = ref(null);
const rol = ref(null);

const usernameEdit = ref(null);
const emailEdit = ref(null);
const passwordEdit = ref(null);
const rolEdit = ref(null);

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
      //console.log(response);
      data.cardEdit = false
      alerts.alerts[1].message = "Usuario editado";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Usuario editado", "Satisfactorio")
      getUsuarios()
    })
    .catch(function (error) {
      alerts.alerts[0].message = `Fallo editando el Usuario ${error.response.data.error.message}`;
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Usuario editado", "Fallo")
      console.log(error);
    });

  selected.value = []
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
      //console.log(response);
      data.cardCreate = false
      alerts.alerts[1].message = "Usuario creado";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Usuario creado", "Satisfactorio")
      getUsuarios();
    })
    .catch(function (error) {
      alerts.alerts[0].message = `Fallo creando el Usuario ${error.response.data.error.message}`;
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Usuario creado", "Fallo")
      console.log(error);
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
  api
    .get("/users?populate=%2A", {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
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
      console.log(error);
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
      alerts.alerts[1].message = "Usuario eliminado";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Usuario eliminado", "Satisfactorio")
      getUsuarios()
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo eliminando el Usuario";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Usuario eliminado", "Fallo")
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

function onCreate() {
  username.value.validate();
  email.value.validate();
  password.value.validate();
  rol.value.validate();

  if (username.value.hasError || email.value.hasError || password.value.hasError || rol.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Create();
  }
}

function onEdit() {
  usernameEdit.value.validate();
  emailEdit.value.validate();
  passwordEdit.value.validate();
  rolEdit.value.validate();

  if (usernameEdit.value.hasError || emailEdit.value.hasError || passwordEdit.value.hasError || rolEdit.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Edit();
  }
}

</script>