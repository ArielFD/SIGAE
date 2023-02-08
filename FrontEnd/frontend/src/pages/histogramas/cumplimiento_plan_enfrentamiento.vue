<template>
    <div class="col-12 q-pa-md">
        <div class="text-center q-mt-xl" v-if="auth.printMode == true">
            <q-img src="~assets/Layout_/GTE-BH_print.png" class="banner" />
        </div>
        <div style="width: 100%" class="row justify-center" v-if="auth.printMode == true">
            <div class="col-2 text-h6">
                <q-btn flat :label="data.titulo + data.fecha_actual" class="col-1  q-pa-xs"
                    @click="auth.printMode = !auth.printMode" />
            </div>
        </div>
        <div class="row justify-between" v-else>
            <div class="col-1 text-h6" v-if="auth.jwt">
                <q-btn flat icon="print" class="col-1  q-pa-xs" @click="auth.printMode = !auth.printMode" />
            </div>
            <p class="col-6">
                <label><b>Cumplimiento de planes de enfrentamiento:</b> </label> &nbsp;
                <q-radio v-model="data.organismo" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="OACE"
                    label="OACE" color="secondary" />
                <q-radio v-model="data.organismo" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="OSDE"
                    label="OSDE" color="secondary" />
            </p>
            <div class="col-2">
                <div class="row">
                    <q-input outlined dense v-model="data.fecha_actual" type="number" label="Año"
                        class="text-black q-pa-xs" style="width:100px" />
                    <q-btn flat round color="secondary" icon="search" class="text-black q-pa-xs"
                        @click="getEnfrentamiento()" />
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
    titulo: "Histograma de plan de enfrentamiento ",
    fecha_actual: new Date(),
    organismo: "OACE",
    organismos: [],
    osdes: [],
    rows: [],

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

async function getEnfrentamiento(params) {
    data.rows = [];
    let data1 = [], data2 = [], data3 = []

    await api
        .get(`/getPlanEnfrentamientoCumplimiento?filters[0]=${data.fecha_actual}&filters[1]=${data.organismo}&filters[2]=${data.organismos}&filters[3]=${data.osdes}`)
        .then(function (response) {
            data1 = response.data[0].data1;
            data2 = response.data[1].data2;
        }).catch(function (error) {
            console.log(error);
        });

    data.chartOptions = {
        xaxis: {
            categories: data.organismos
        }
    };
    data.series = [
        {
            name: "Total de medidas",
            data: data1,
        },
        {
            name: "Cumplidas",
            data: data2,
        }
    ]

}

</script>