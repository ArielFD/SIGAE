<template>
    <div class="col-12 q-pa-md">
        <div  class="text-center q-mt-xl" v-if="auth.printMode == true">
            <q-img src="~assets/Layout_/GTE-BH_print.png" class="banner" />
        </div>
        <div style="width: 100%" class="row justify-center" v-if="auth.printMode == true">
            <div class="col-2 text-h6">
                <q-btn flat :label="data.titulo" class="col-1  q-pa-xs"
                    @click="auth.printMode = !auth.printMode" />
            </div>
        </div>
        <div class="row justify-center" v-else>
            <div class="col-1 text-h6" v-if="auth.jwt">
                <q-btn flat icon="print" class="col-1  q-pa-xs" @click="auth.printMode = !auth.printMode" />
            </div>
            <p class="col-2">
                <label><b>Comparacion de parametros de desempeño:</b> </label> &nbsp;
            </p>
            <div class="col-3">
                <div class="row justify-start">
                    <q-input outlined dense v-model="data.fecha_anterior" type="number" label="Año 2"
                        class="col-2 text-black q-pa-xs" style="width:100px" />
                    <q-input outlined dense v-model="data.fecha_actual" type="number" label="Año 1"
                        class="col-2 text-black q-pa-xs" style="width:100px" />
                    <q-btn flat round color="secondary" icon="search" class="col-2 text-black q-pa-xs"
                        @click="getopcion()" />
                </div>
            </div>
        </div>
        <apexcharts width="100%" height="350" type="bar" :options="data.chartOptions" :series="data.series">
        </apexcharts>
        <div class="text-center q-mt-xl" v-if="auth.printMode == true">
            <p>_______________________________________</p>
            <p>Director de Gestion Ambiental</p>
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
    getYear()
    getOrganismos()
    getOSDE()
})

let data = reactive({
    titulo: "Histograma de comparacion de parametros de desempeño ",
    fecha_actual: new Date(),
    fecha_anterior: "",
    indicadores: ["Coordinador", "Diagnostico", "Politica", "Indicadores", "Plan de accion", "Legislacion", "Plan de capacitacion", "Acciones PML", "Programa de gestion ambiental", "recursos financieros", "Aprovechamiento Economico", "Sistema de tratamiento", "Carga contaminante"],
    rows: [],
    organismos: [],
    osdes: [],

    chartOptions: {
        stroke: {
            show: true,
            width: 5,
            colors: ['transparent']
        },
        chart: {
            id: "basic-bar",
            animations: {
                speed: 500
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['black']
            },
        },
        colors: ['#C10015', '#0022ff'],
        xaxis: {
            categories: [],
            labels: {
                maxHeight: 500,
            }
        },
        yaxis: {
            maxValue: 100,
            decimalsInFloat: 2
        }
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
    ]
})

function getYear(params) {
    data.fecha_actual = data.fecha_actual.getFullYear()
    data.fecha_anterior = data.fecha_actual - 1
}

async function getOrganismos(params) {
    dataStore.organismo.forEach(element => {
        data.organismos.push(element.organismo);
    });
}

async function getOSDE(params) {
    dataStore.osde.forEach(element => {
        data.osdes.push(element.Nombre);
    });
}

async function getopcion(params) {
    getDesempeño()
}

async function getDesempeño(params) {
    data.rows = [];
    let data3 = [], data4 = []

    await api
        .get(`/getDesempeno?filters[0]=${data.fecha_actual}&filters[1]=${data.indicadores}`)
        .then(function (response){
            data3=response.data;
        }).catch(function (error) {
            console.log(error);
        });

        await api
        .get(`/getDesempeno?filters[0]=${data.fecha_anterior}&filters[1]=${data.indicadores}`)
        .then(function (response){
            data4=response.data;
        }).catch(function (error) {
            console.log(error);
        });

    data.chartOptions = {
        xaxis: {
            categories: data.indicadores
        }
    };
    data.series = [
        {
            name: data.fecha_anterior,
            data: data4,
        },
        {
            name: data.fecha_actual,
            data: data3,
        }
    ]
    for (let index = 0; index < data.indicadores.length; index++) {
        if (!data3[index]) data3[index] = 0
        if (!data4[index]) data4[index] = 0
    }




}
</script>