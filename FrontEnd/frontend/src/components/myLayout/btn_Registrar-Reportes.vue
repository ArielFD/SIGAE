<template>
  <q-btn-group flat>
    <q-btn push no-caps label="Registrar">
      <q-menu class="bg-primary text-black">
        <q-list dense style="min-width: 100px">
          <q-item clickable :to="{ name: 'actaDeControl' }" class="text-black">
            <q-item-section>Acta de Control</q-item-section>
            
          </q-item>
          <q-item clickable :to="{ name: 'riesgoTecnologico' }" class="text-black">
            <q-item-section>Riesgo Tecnologico</q-item-section>
            
          </q-item>
          <q-item clickable :to="{ name: 'datosDeLaEntidad' }"  class="text-black">
            <q-item-section>Datos de la Entidad</q-item-section>
            
          </q-item>
          <q-item clickable :to="{ name: 'cargaContaminante' }" class="text-black">
            <q-item-section>Carga Contaminante</q-item-section>
            
          </q-item>
          <q-item clickable :to="{ name: 'desempeñoAmbiental' }" class="text-black">
            <q-item-section>Desempeño Ambiental</q-item-section>
            
          </q-item>
          <q-item clickable :to="{ name: 'planEnfrentamiento' }" class="text-black">
            <q-item-section>Plan de enfrentamiento</q-item-section>
            
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <q-btn push no-caps label="Reportes" @click="$emit('hideVal')" >
      <q-menu class="bg-primary text-black">
        <q-list dense style="min-width: 100px">
          <q-item clickable :to="{ name: 'busqueda_Plan_de_Medidas' }" class="text-black">
            <q-item-section>Búsqueda Plan de Medidas</q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'desempeño_por_Ministerio' }" class="text-black">
            <q-item-section>Desempeño por Ministerio</q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'residuales_por_Categoría' }" class="text-black">
            <q-item-section>Residuales por Categoría</q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'sistema_de_Tratamiento' }" class="text-black">
            <q-item-section>Sistema de Tratamiento</q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'histogramas' }" class="text-black">
            <q-item-section>Histogramas</q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'entidades' }" class="text-black">
            <q-item-section>Entidades</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
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