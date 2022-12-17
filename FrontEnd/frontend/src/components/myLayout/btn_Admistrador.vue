<template>
  <q-btn-group flat>
    <q-btn-dropdown push no-caps label="Codificadores" flat size="lg">
      <!-- <q-menu class="bg-primary text-black"> -->
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
      <!-- </q-menu> -->
    </q-btn-dropdown>
    <q-btn-dropdown push no-caps label="Administrar" flat size="lg">
      <!-- <q-menu class="bg-primary text-black"> -->
        <q-list dense style="min-width: 100px">
          <q-item clickable :to="{ name: 'usuario' }" class="text-black">
            <q-item-section>Usuario</q-item-section>
            
          </q-item>
        </q-list>
      <!-- </q-menu> -->
    </q-btn-dropdown>
    <q-btn-dropdown push no-caps label="Seguridad" flat size="lg">
      <!-- <q-menu class="bg-primary text-black"> -->
        <q-list dense style="min-width: 100px">
          <q-item clickable :to="{ name: 'ver_trazas' }" class="text-black">
            <q-item-section>Trazas</q-item-section>
          </q-item>
          <q-item clickable  class="text-black" @click="backup">
            <q-item-section>BackUp</q-item-section>
          </q-item>
        </q-list>
      <!-- </q-menu> -->
    </q-btn-dropdown>
  </q-btn-group>
</template>

<script setup>
import { api } from "boot/axios.js";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/auth-store";
import { useAlertsRulesStore } from "src/stores/alerts-rules-store";

const auth = useAuthStore();
const alertRules = useAlertsRulesStore();
const $q = useQuasar();

function backup(params) {
  api
    .get("/backup", {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      console.log(response);
      if(response.data=="Backup Completed"){
        alertRules.alerts[1].message = "Backup realizado con exito!!!";
        $q.notify(alertRules.alerts[1]);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
</script>