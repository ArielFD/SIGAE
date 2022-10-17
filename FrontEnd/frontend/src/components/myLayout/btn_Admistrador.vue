<template>
  <q-btn-group>
    <q-btn push no-caps label="Codificadores">
      <q-menu class="bg-primary text-black">
        <q-list dense style="min-width: 100px">
          <q-item clickable :to="{ name: 'organismo' }" class="text-black">
            <q-item-section>OACE</q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'categoria' }" class="text-black">
            <q-item-section>Categoria</q-item-section>
            
          </q-item>
          <q-item clickable :to="{ name: 'municipio' }" class="text-black">
            <q-item-section>Municipio</q-item-section>
            
          </q-item>
          <q-item clickable :to="{ name: 'unidad' }" class="text-black">
            <q-item-section>Unidad</q-item-section>
            
          </q-item>
          <q-item clickable :to="{ name: 'estado' }" class="text-black">
            <q-item-section>Estado</q-item-section>
            
          </q-item>
          <q-item clickable :to="{ name: 'prioridad' }" class="text-black">
            <q-item-section>Prioridad</q-item-section>
            
          </q-item>
          <q-item clickable :to="{ name: 'periodoDeSalida' }" class="text-black">
            <q-item-section>Periodo De Salida</q-item-section>
            
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-btn push no-caps label="Administrar">
      <q-menu class="bg-primary text-black">
        <q-list dense style="min-width: 100px">
          <q-item clickable :to="{ name: 'usuario' }" class="text-black">
            <q-item-section>Usuario</q-item-section>
            
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-btn push no-caps label="Seguridad">
      <q-menu class="bg-primary text-black">
        <q-list dense style="min-width: 100px">
          <q-item clickable :to="{ name: 'ver_trazas' }" class="text-black">
            <q-item-section>Trazas</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-btn-group>
</template>

<script setup>
</script>