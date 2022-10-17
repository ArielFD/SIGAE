<template>
  <div>
    <div class="text q-pa-xl">
      <h6 class="no-margin">
        <b>SIGAE:</b> Sistema informatico para la gestion ambiental empresarial
        <br />
      </h6>
      <q-separator></q-separator>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae harum
      repellendus nesciunt consectetur laborum exercitationem placeat, odio ipsa
      beatae tempora deserunt numquam modi minima impedit omnis sint hic dolorum
      ex? Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
      harum repellendus nesciunt consectetur laborum exercitationem placeat,
      odio ipsa beatae tempora deserunt numquam modi minima impedit omnis sint
      hic dolorum ex? Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Molestiae harum repellendus nesciunt consectetur laborum exercitationem
      placeat, odio ipsa beatae tempora deserunt numquam modi minima impedit
      omnis sint hic dolorum ex? Lorem ipsum dolor sit amet consectetur
      adipisicing elit. Molestiae harum repellendus nesciunt consectetur laborum
      exercitationem placeat, odio ipsa beatae tempora deserunt numquam modi
      minima impedit omnis sint hic dolorum ex? Lorem ipsum dolor sit amet
      consectetur adipisicing elit. Molestiae harum repellendus nesciunt
      consectetur laborum exercitationem placeat, odio ipsa beatae tempora
      deserunt numquam modi minima impedit omnis sint hic dolorum ex?
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
import { useAuthStore } from "src/stores/auth-store";

const auth = useAuthStore();
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