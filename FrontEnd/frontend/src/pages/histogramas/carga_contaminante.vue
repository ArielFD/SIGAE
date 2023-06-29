<template>
    <div class="col-12 q-pa-md">
        <div  class="text-center q-mt-xl" v-if="auth.printMode == true">
            <q-img src="~assets/Layout_/GTE-BH_print.png" class="banner" />
        </div>
        <div style="width: 100%" class="row justify-center" v-if="auth.printMode == true">
            <div class="col-2 text-h6">
                <q-btn flat :label="data.titulo + data.fecha_actual" class="col-1  q-pa-xs"
                    @click="auth.printMode = !auth.printMode" />
            </div>
        </div>
        <div class="row justify-center" v-else>
            <div class="col-1 text-h6" v-if="auth.jwt">
                <q-btn flat icon="print" class="col-1  q-pa-xs" @click="auth.printMode = !auth.printMode" />
            </div>
            <p class="col-2">
                <label><b>Carga Contaminante:</b> </label> &nbsp;
            </p>
            <div class="col-2" style="width:150px">
                <q-select class="text-black q-pa-xs" dense outlined v-model="data.opcion" :options="data.opciones"
                    label="Búsqueda por:" />
            </div>
            <div class="col-2">
                <q-select class="text-black q-pa-xs" use-input input-debounce="0" dense outlined
                    v-model="data.indicador" :options="data.indicadores" label="Carga COntaminante" />
            </div>
            <div class="col-3">
                <div class="row justify-start">
                    <q-input outlined dense v-model="data.fecha_actual" type="number" label="Año"
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
    getYear()
    getOrganismos()
    getOSDE()
})

let data = reactive({
    titulo: "Histograma de Carga Contaminate ",
    fecha_actual: new Date(),
    opciones: ["OACE", "OSDE"],
    opcion: "OACE",
    indicadores: ["DB05", "DQ0", "PT", "NTK", "ST", "Hidrocarburos"],
    indicador: "DB05",
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
        colors: ['#0022ff'],
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
            name: "Parámetro",
            data: [],
        }
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

async function getDesempeño(params) {
    data.rows = [];
    let data3 = []

    await api
        .get(`/getContaminantes?filters[0]=${data.fecha_actual}&filters[1]=${data.opcion}&filters[2]=${data.organismos}&filters[3]=${data.osdes}&filters[4]=${data.indicador}`)
        .then(function (response){
            data3=response.data;
        }).catch(function (error) {
            console.log(error);
        });

        if (data.opcion == "OACE") {
            data.chartOptions = {
                        xaxis: {
                            categories: data.organismos
                        }
                    };
                    data.series = [
                        {
                            name: "Parámetro",
                            data: data3,
                        }
                    ]
        }else{
            data.chartOptions = {
                        xaxis: {
                            categories: data.osdes
                        }
                    };
                    data.series = [
                        {
                            name: "Parámetro",
                            data: data3,
                        }
                    ]
        }
}

async function getopcion(params) {
    getDesempeño()
}

</script>