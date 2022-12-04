<template>
  <div>
    <div class="text q-pa-xl">
      <h6 class="no-margin">
        <b>SIGAE:</b> Sistema informatico para la gestion ambiental empresarial
        <br />
      </h6>
      <q-separator></q-separator>
      <p style="line-height: 22px;">Es un sistema desarrollado para el Grupo de Trabajo Estatal Bah&iacute;a de La Habana, el cual posee dentro de su estructura organizacional la Direcci&oacute;n de Gesti&oacute;n Ambiental, encaminado en la prevenci&oacute;n, minimizaci&oacute;n y eliminaci&oacute;n de los impactos negativos de las fuentes contaminantes que se ubican en la Cuenca Hidrogr&aacute;fica Superficial de la Bah&iacute;a de La Habana y que vierten sus residuales hacia la Bah&iacute;a. SIGAE, posee como objetivo fundamental gestionar de manera eficiente 
toda la informaci&oacute;n obtenida a partir del proceso de control de las fuentes contaminantes, contribuyendo 
as&iacute; a elevar el nivel de eficiencia en la ejecuci&oacute;n de dicho proceso.</p> 
    </div>
    <q-img
      src="~assets/Layout_/GTE-BH.jpg"
      class="banner fixed-center q-mt-xl"
    />
    <q-page-container>
      <router-view />
    </q-page-container>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useAuthStore } from "src/stores/auth-store";

const auth = useAuthStore();
onMounted(() => {
 
});

</script>

<style lang="sass" scoped>
.text
  color: rgb(4,48 ,158 )
.banner
    position: relative
    height: 100px
    width: 110px
.test
    background-color: blue
</style>