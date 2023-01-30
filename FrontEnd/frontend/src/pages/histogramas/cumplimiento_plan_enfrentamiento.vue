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
        <div class="row justify-between" v-else>
            <div class="col-1 text-h6" v-if="auth.jwt">
                <q-btn flat icon="print" class="col-1  q-pa-xs" @click="auth.printMode = !auth.printMode" />
            </div>
            <div class="col-3 text-h6" v-else>
                <q-btn flat class="col-1  q-pa-xs" />
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
//   let temp=console.log.bind(console);
//   const props=defineProps(["dataHistogram"])
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
    for (let index = 1; index < 2; index++) {
        await api
            .get(`/organismos?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100`)
            .then(function (response) {
                //console.log(response);
                for (let i = 0; i < response.data.data.length; i++) {
                    data.organismos.push(response.data.data[i].attributes.organismo);
                }
            })
            .catch(function (error) {
                console.log(error.response);
            });
    }
}

async function getOSDE(params) {
    for (let index = 1; index < 2; index++) {
        await api
            .get(`/osdes`)
            .then(function (response) {
                //console.log(response);
                for (let i = 0; i < response.data.data.length; i++) {
                    data.osdes.push(response.data.data[i].attributes.nombre);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

async function getEnfrentamiento(params) {
    data.rows = [];
    let data1 = [], data2 = []

    await api
        .get(`/plan-enfrentamientos?populate[0]=entidad.organismo&populate[1]=entidad.osde&filters[fecha][$containsi]=${data.fecha_actual}`)
        .then(function (response) {
            console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                if (response.data.data[i].attributes.entidad.data != null) {
                    if (response.data.data[i].attributes.entidad.data.attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                    if (response.data.data[i].attributes.entidad.data.attributes.osde.data == null) {
                        response.data.data[i].attributes.entidad.data.attributes.osde.data = { attributes: { nombre: "-" } }
                    }
                    data.rows.push({
                        medidas: response.data.data[i].attributes.medidas,
                        cumplidas: response.data.data[i].attributes.cumplidas,
                        organismo: response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo,
                        osde: response.data.data[i].attributes.entidad.data.attributes.osde.data.attributes.nombre
                    });

                }
            }


            if (data.organismo == "OACE") {
                for (let index = 0; index < data.organismos.length; index++) {
                    data.rows.forEach(element => {
                        if (data.organismos[index] == element.organismo) {
                            if (!data1[index]) {
                                data1[index] = element.medidas
                            }
                            else {
                                data1[index] = data1[index] + element.medidas
                            }
                            if (!data2[index]) {
                                data2[index] = element.cumplidas
                            }
                            else {
                                data2[index] = data2[index] + element.cumplidas
                            }
                        }
                    });
                }

                for (let index = 0; index < data.organismos.length; index++) {
                    if (!data1[index]) data1[index] = 0
                    if (!data2[index]) data2[index] = 0
                }

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
            else {
                for (let index = 0; index < data.osdes.length; index++) {
                    data.rows.forEach(element => {
                        if (data.osdes[index] == element.osde) {
                            if (!data1[index]) {
                                data1[index] = element.medidas
                            }
                            else {
                                data1[index] = data1[index] + element.medidas
                            }
                            if (!data2[index]) {
                                data2[index] = element.cumplidas
                            }
                            else {
                                data2[index] = data2[index] + element.cumplidas
                            }
                        }
                    });
                }

                for (let index = 0; index < data.osdes.length; index++) {
                    if (!data1[index]) data1[index] = 0
                    if (!data2[index]) data2[index] = 0
                }

                data.chartOptions = {
                    xaxis: {
                        categories: data.osdes
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

        })
        .catch(function (error) {
            console.log(error);
        });

}

</script>