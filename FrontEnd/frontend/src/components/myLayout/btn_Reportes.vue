<template>
    <q-btn-group flat>
  
      <q-btn-dropdown push no-caps label="Reportes" @click="$emit('hideVal')" flat size="lg" >
        <!-- <q-menu class="bg-primary text-black"> -->
          <q-list dense style="min-width: 100px">
            <q-item clickable :to="{ name: 'busqueda_Plan_de_Medidas' }" class="text-black">
              <q-item-section>Búsqueda Plan de Medidas</q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'plan_enfrentamiento' }" class="text-black">
              <q-item-section>Plan de enfrentamiento</q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'desempeño_por_Ministerio' }" class="text-black">
              <q-item-section>Desempeño Ambiental</q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'residuales_por_Categoría' }" class="text-black">
              <q-item-section>Residuales por Categoría</q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'sistema_de_Tratamiento' }" class="text-black">
              <q-item-section>Sistema de Tratamiento</q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'trampa_de_grasa' }" class="text-black">
              <q-item-section>Trampa de Grasa</q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'entidades' }" class="text-black">
              <q-item-section>Entidades</q-item-section>
            </q-item>
          </q-list>
        <!-- </q-menu> -->
      </q-btn-dropdown>
    </q-btn-group>
  </template>
  
  <script setup>
  const props = defineProps({
    bool: {
      type: Boolean,
    },
  });
  const emit = defineEmits(["hideVal"]);
  </script>