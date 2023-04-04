<template>
  <div>
    <div style="margin-left: 50px; margin-right: 50px;">
      <div class="row justify-between">
        <div class="text q-mt-xl col-10">
          <h6 class="no-margin">
            <b>SIGAE:</b> Sistema informatico para la gestion ambiental empresarial
            <br />
          </h6>
          <q-separator></q-separator>
          <p style="line-height: 22px;">Es un sistema desarrollado para el Grupo de Trabajo Estatal Bah&iacute;a de La
            Habana, el cual posee dentro de su estructura organizacional la Direcci&oacute;n de Gesti&oacute;n Ambiental,
            encaminado en la prevenci&oacute;n, minimizaci&oacute;n y eliminaci&oacute;n de los impactos negativos de las
            fuentes contaminantes que se ubican en la Cuenca Hidrogr&aacute;fica Superficial de la Bah&iacute;a de La
            Habana y que vierten sus residuales hacia la Bah&iacute;a. SIGAE, posee como objetivo fundamental gestionar de
            manera eficiente
            toda la informaci&oacute;n obtenida a partir del proceso de control de las fuentes contaminantes,
            contribuyendo
            as&iacute; a elevar el nivel de eficiencia en la ejecuci&oacute;n de dicho proceso.</p>
        </div>
        <div class="col-1">
          <q-img src="~assets/Layout_/GTE-BH.jpg" class="banner q-mt-xl" />
        </div>
      </div>
      <geo></geo>
    </div>
    <q-page-container>
      <router-view />
    </q-page-container>
  </div>
</template>

<script setup>
import geo from "components/geolocOpenLayerMultiple.vue"
import { onMounted, reactive } from "vue";
import { useAuthStore } from "src/stores/auth-store";
import { api } from "boot/axios.js";

const auth = useAuthStore();
onMounted(() => {
  
});
</script>

<style lang="sass" scoped>
.text
  color: rgb(4,48 ,158 )
.banner
    opacity: .5
.test
    background-color: blue
</style>