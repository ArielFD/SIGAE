<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated >
      <q-toolbar class="no-padding">
        <q-img src="~assets/Layout_/baner_1.png" class="banner" />
        <q-img src="~assets/Layout_/baner_2.png" class="banner" />
      </q-toolbar>
      <q-toolbar class="no-padding glossy" style="background-color: rgb(32, 105, 126)">
        <btn_Administrador v-if="data.admin"/>
        <btn_RegistrarReportes v-if="data.auth"></btn_RegistrarReportes>
        <q-btn push no-caps label="Cerrar Sesion" @click="auth.jwt=''" to="/login"/>
      </q-toolbar>
      <q-toolbar >

      </q-toolbar>

      <q-separator />

      <q-toolbar >
        <q-btn push disable color="secondary" text-color="white" label="Bienvenido" />
      </q-toolbar>
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
import { defineComponent, reactive, ref,onMounted } from "vue";
import btn_Administrador from "src/components/myLayout/btn_Admistrador.vue"
import btn_RegistrarReportes from "src/components/myLayout/btn_Registrar-Reportes.vue"
import { useAuthStore } from "src/stores/auth-store";
import { api } from "boot/axios.js";


const auth = useAuthStore();

let data=reactive({
  admin:false,
  auth:false
})

onMounted(() => {
      api
        .get("/usuarios/$", {
          headers: {
            Authorization: "Bearer " + auth.jwt,
          },
        })
        .then(function (response) {
          console.log(response);
          if (
            response.data.role.name === "Administrador"){
              data.admin=true
              data.auth=false
            }
            if (
            response.data.role.name === "Especialista"){
              data.auth=true
              data.admin=false
            }
          
        })
        .catch(function (error) {
          console.log(error);
        });
      })
</script>

<style lang="sass" scoped>
.banner
  height: 100%
  max-height: 120px
</style>