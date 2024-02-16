<template>
  <div class="col-12 q-pa-md">
    <div class="text-center q-mt-xl" v-if="auth.printMode == true">
      <q-img src="~assets/Layout_/GTE-BH_print.png" class="banner" />
    </div>
    <div
      style="width: 100%"
      class="row justify-center"
      v-if="auth.printMode == true"
    >
      <div class="col-2 text-h6">
        <q-btn
          flat
          :label="data.titulo + data.fecha_actual"
          class="col-1 q-pa-xs"
          @click="auth.printMode = !auth.printMode"
        />
      </div>
    </div>
    <div class="row justify-between" v-else>
      <div class="col-1 text-h6" v-if="auth.jwt">
        <q-btn
          flat
          icon="print"
          class="col-1 q-pa-xs"
          @click="auth.printMode = !auth.printMode"
        />
      </div>
      <p class="col-3">
        <label><b>Plan de medidas por:</b> </label> &nbsp;
        <q-radio
          v-model="data.opcion"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="OACE"
          label="OACE"
          color="secondary"
        />
        <q-radio
          v-model="data.opcion"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="OSDE"
          label="OSDE"
          color="secondary"
        />
      </p>
      <p class="col-4">
        <q-radio
          v-model="data.opcion1"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="Corto"
          label="Corto"
          color="secondary"
        />
        <q-radio
          v-model="data.opcion1"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="Mediano"
          label="Mediano"
          color="secondary"
        />
        <q-radio
          v-model="data.opcion1"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="Largo"
          label="Largo"
          color="secondary"
        />
        <q-radio
          v-model="data.opcion1"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="Totales"
          label="Totales"
          color="secondary"
        />
      </p>
      <div class="col-3">
        <div class="row justify-end">
          <q-input
            outlined
            dense
            v-model="data.fecha_actual"
            type="number"
            label="Año"
            class="col-2 text-black q-pa-xs"
            style="width: 100px"
          />
          <q-btn
            flat
            round
            color="secondary"
            icon="search"
            class="col-2 text-black q-pa-xs"
            @click="getopcion()"
          />
        </div>
      </div>
    </div>
    <apexcharts
      width="100%"
      height="350"
      type="bar"
      :options="data.chartOptions"
      :series="data.series"
    >
    </apexcharts>
    <table>
      <thead>
        <tr>
          <th>Medidas a corto</th>
          <th>Medidas a mediano</th>
          <th>Medidas a largo</th>
          <th>Total de medidas</th>
          <th>Total de cumplidas</th>
          <th>Porcentaje de cumplidas</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{data.corto}}</td>
          <td>{{data.mediano}}</td>
          <td>{{data.largo}}</td>
          <td>{{data.medidas}}</td>
          <td>{{data.cumplidas}}</td>
          <td>{{data.porcentaje}}</td>
        </tr>
      </tbody>
    </table>
    <div class="text-center q-mt-xl" v-if="auth.printMode == true">
      <p>_______________________________________</p>
      <p>Director de Gestión Ambiental</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import apexcharts from "vue3-apexcharts";
import { api } from "boot/axios.js";
import { useAuthStore } from "src/stores/auth-store";
import { useAlertsRulesStore } from "src/stores/alerts-rules-store";
import { useDataStore } from "src/stores/data-store";

const dataStore = useDataStore();
const auth = useAuthStore();
const alerts = useAlertsRulesStore();

onMounted(() => {
  getYear();
  getOrganismos();
  getOSDE();
});

let data = reactive({
  titulo: "Histograma de plan de medidas ",
  fecha_actual: new Date(),
  opcion: "OACE",
  opcion1: "Totales",
  rows: [],
  organismos: [],
  osdes: [],
  corto:0,
  mediano:0,
  largo:0,
  medidas:0,
  cumplidas:0,
  porcentaje:0,

  chartOptions: {
    stroke: {
      show: true,
      width: 5,
      colors: ["transparent"],
    },
    chart: {
      id: "basic-bar",
      animations: {
        speed: 500,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["black"],
      },
    },
    colors: ["#C10015", "#0022ff", "#35c609"],
    xaxis: {
      categories: [],
      labels: {
        maxHeight: 500,
      },
    },
    yaxis: {
      maxValue: 100,
      decimalsInFloat: 2,
    },
  },
  series: [
    {
      name: "Total de medidas",
      data: [],
    },
    {
      name: "Cumplidas",
      data: [],
    },
  ],
});

function getYear(params) {
  data.fecha_actual = data.fecha_actual.getFullYear();
}

async function getOrganismos(params) {
  dataStore.organismo.forEach((element) => {
    data.organismos.push(element.organismo);
  });
}

async function getOSDE(params) {
  dataStore.osde.forEach((element) => {
    data.osdes.push(element.Nombre);
  });
}

async function getMedidas(params) {
  data.rows = [];
  let data1 = [],
    data2 = [],
    data3 = [];

  await api
    .get(
      `/getPlanMedidasActaControl?filters[0]=${data.fecha_actual}&filters[1]=${data.opcion}&filters[2]=${data.organismos}&filters[3]=${data.osdes}&filters[4]=${data.opcion1}`
    )
    .then(function (response) {
      console.log(response);
      data1 = response.data[0];
      data2 = response.data[1];
      data3 = response.data[2];
      for (let i = 0; i < data1.length; i++) {
        data.medidas += data1[i];
      }
      for (let i = 0; i < data2.length; i++) {
        data.cumplidas += data2[i];
      }
      if(data.medidas>0) data.porcentaje=((data.cumplidas/data.medidas)*100).toFixed(2)
      else data.porcentaje=0
    
      data3.forEach(element => {
        if(element){
          data.corto=element.corto+data.corto
          data.mediano=element.mediano+data.mediano
          data.largo=element.largo+data.largo
        }
      });
    })
    .catch(function (error) {
      console.log(error);
    });

  if (data.opcion == "OACE") {
    data.chartOptions = {
      xaxis: {
        categories: data.organismos,
      },
    };
    data.series = [
      {
        name: "Medidas",
        data: data1,
      },
      {
        name: "Cumplidas",
        data: data2,
      },
    ];
    for (let index = 0; index < data.organismos.length; index++) {
      if (!data1[index]) data1[index] = 0;
      if (!data2[index]) data2[index] = 0;
    }
  } else {
    data.chartOptions = {
      xaxis: {
        categories: data.osdes,
      },
    };
    data.series = [
      {
        name: "Medidas",
        data: data1,
      },
      {
        name: "Cumplidas",
        data: data2,
      },
    ];
    for (let index = 0; index < data.osdes.length; index++) {
      if (!data1[index]) data1[index] = 0;
      if (!data2[index]) data2[index] = 0;
    }
  }
}

async function getopcion(params) {
  getMedidas();
}
</script>

<style>
  table {
    border-collapse: collapse;
    margin: 0 auto;
    text-align: center;
  }
  th, td {
    border: 1px solid black;
    padding: 10px;
  }
</style>
