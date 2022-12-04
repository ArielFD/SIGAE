<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="no-padding">
        <q-img src="~assets/Layout_/baner_1.png" class="banner" />
        <q-img src="~assets/Layout_/baner_2.png" class="banner" />
      </q-toolbar>
      <q-toolbar class="row no-padding glossy justify-between" style="background-color: rgb(32, 105, 126)">
        <btn_Administrador v-if="data.admin" />
        <btn_RegistrarReportes v-if="data.auth"></btn_RegistrarReportes>
        <btn_Reportes v-if="data.public"></btn_Reportes>
        <q-btn push no-caps label="Login" v-if="!auth.jwt" @click="data.card = true" />
        <q-btn push no-caps label="Cerrar Sesion" v-else @click="cerrarSesion" />

        <q-dialog v-model="data.card">
          <q-card class="my-card text-black">
            <q-card-section class="no-padding">
              <q-img src="~assets/login/logo_direccion.png" />
            </q-card-section>

            <q-card-section>
              <p class="text text-center"><b>Logueo</b></p>
              <q-input outlined v-model="auth.email" class="input q-pb-md" label="Usuario" dense color="secondary" />
              <q-input outlined dense v-model="auth.password" label="Contraseña" class="input"
                :type="auth.isPwd ? 'password' : 'text'" color="secondary">
                <template v-slot:append>
                  <q-icon :name="auth.isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="auth.isPwd = !auth.isPwd" />
                </template>
              </q-input>
              <div>
                <q-checkbox v-model="auth.rememberMe" label="Recordarme" color="secondary" />
              </div>
            </q-card-section>

            <q-separator dark />

            <q-card-actions class="justify-end">
              <q-btn no-caps class="text-white bg-secondary" @click="Login">Confirmar</q-btn>
              <q-btn no-caps class="text-white bg-secondary" @click="clear">Limpiar Campos</q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>

      </q-toolbar>
      <!-- <q-toolbar >

      </q-toolbar>

      <q-separator />

      <q-toolbar >
        <q-btn push disable color="secondary" text-color="white" label="Bienvenido" />
      </q-toolbar> -->
    </q-header>

    <q-footer elevated>
      <q-toolbar style="color: rgb(4, 48, 158)">
        <div class="col">
          <div class="row justify-between">
            <div>© 2022 Todos los derechos reservados</div>
            <div>Powered by Joven CLub</div>
          </div>
        </div>
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { defineComponent, reactive, ref, onMounted } from "vue";
import btn_Administrador from "src/components/myLayout/btn_Admistrador.vue"
import btn_RegistrarReportes from "src/components/myLayout/btn_Registrar-Reportes.vue"
import btn_Reportes from "src/components/myLayout/btn_Reportes.vue"
import { api } from "boot/axios.js";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "src/stores/auth-store";
import { useAlertsRulesStore } from "src/stores/alerts-rules-store";

const auth = useAuthStore();
const alertRules = useAlertsRulesStore();
const router = useRouter();
const route = useRoute();
const $q = useQuasar();

let data = reactive({
  admin: false,
  auth: false,
  public: true,
  card: false
})

onMounted(() => {
  if (!localStorage.getItem("fallo")) {
    localStorage.setItem("fallo", "0");
  }
  if (
    localStorage.getItem("userData") &&
    JSON.parse(localStorage.getItem("userData")).rememberMe
  ) {
    (auth.jwt = localStorage.getItem("jwt")),
    (auth.email = JSON.parse(localStorage.getItem("userData")).email),
      (auth.password = JSON.parse(localStorage.getItem("userData")).password),
      (auth.rememberMe = JSON.parse(
        localStorage.getItem("userData")
      ).rememberMe);
  }
  // var ip=require('ip')
  // console.log(ip.address());
  //console.log(local);

  // var os=require('os')
  // var networkInterfaces=os.networkInterfaces()
  // console.log(networkInterfaces);
  
  auth.getLocalIP().then((ipAddr) => {
    console.log(ipAddr);
    auth.ip = ipAddr
  });
  console.log(auth.jwt);
  getRol()
})

function getRol(params) {
  api
    .get("/usuarios/$", {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      //console.log(response);
      if (
        response.data.role.name === "Administrador") {
        data.admin = true
        data.auth = false
        data.public = false
      }
      if (
        response.data.role.name === "Especialista") {
        data.auth = true
        data.admin = false
        data.public = false
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function cerrarSesion(params) {
  data.auth = false
  data.admin = false
  data.public = true
  auth.jwt = ''
  localStorage.setItem("jwt", '');
  if (JSON.parse(
    localStorage.getItem("userData")
  ).rememberMe == false) {
    localStorage.setItem("userData", null);
  }
  router.push("/");
}

async function Login() {
  await api
    .post("/auth/local", {
      identifier: auth.email,
      password: auth.password,
    })
    .then(function (response) {
      //console.log(response);
      alertRules.alerts[1].message = "Sesion Iniciada, Bienvenido!!!";
      $q.notify(alertRules.alerts[1]);
      auth.jwt = response.data.jwt;
      auth.user = response.data.user;
      auth.user.password = auth.password;
      auth.user.rememberMe = auth.rememberMe;
      localStorage.setItem("jwt", response.data.jwt);
      localStorage.setItem("userData", JSON.stringify(auth.user));
      localStorage.setItem("fallo", "0");

      auth.postTraza("Login", "Satisfactorio")
      getRol()
    })
    .catch(function (error) {
      console.log(error);
      auth.postTraza("Login", "Fallo en la Operacion")
      let temp = parseInt(localStorage.getItem("fallo"));
      temp++;
      localStorage.setItem("fallo", temp);
      if (temp > 5) {
        data.fallo = true;
        resetTimeOut();
      }
      alertRules.alerts[0].message = "Credenciales incorrectas";
      $q.notify(alertRules.alerts[0]);
    });
}

function clear(params) {
  (auth.email = ""), (auth.password = ""), (auth.rememberMe = false);
}
</script>

<style lang="sass" scoped>
.banner
  height: 100%
  max-height: 120px
.my-card
  width: 100%
  min-width: 500px
  background: rgb(228,236 ,247 )
.text
  color: rgb(4,48 ,158 )
.input
  width: 50%
</style>