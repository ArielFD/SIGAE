<template>
    <q-btn-group flat>
  
      <q-btn-dropdown push no-caps label="Histogramas" @click="$emit('hideVal')" flat size="lg" >
        <!-- <q-menu class="bg-primary text-black"> -->
          <q-list dense style="min-width: 100px">
            <q-item clickable :to="{ name: 'comparacion_cumplimento_medidas' }" class="text-black">
              <q-item-section>Comparacion de cumplimientos de medidas</q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'comparacion_parametros_desempeño' }" class="text-black">
              <q-item-section>Comparacion de parametros de desempeño</q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'coordinadores_ambientales' }" class="text-black">
              <q-item-section>Coordinadores ambientales</q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'cumplimiento_plan_enfrentamiento' }" class="text-black">
              <q-item-section>Cumplimiento de plan de enfrentamiento</q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'desempeño_ambiental' }" class="text-black">
              <q-item-section>Desempeño ambiental</q-item-section>
            </q-item>
          </q-list>
        <!-- </q-menu> -->
      </q-btn-dropdown>
    </q-btn-group>
  </template>
  
  <script setup>
    function test(params) {
      console.log("test");
    }
  const props = defineProps({
    bool: {
      type: Boolean,
    },
  });
  const emit = defineEmits(["hideVal"]);
  </script>