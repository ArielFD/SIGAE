<template>
    <div class="col-12 q-pa-md">
        <div class="row justify-center">
            <p class="col-2">
                <label><b>Comparacion de Indicadores de desempeño:</b> </label> &nbsp;
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

async function getDesempeño(params) {
    data.rows = [];

    let data1 = [], data2 = [], data3 = [], data4 = []

    for (let index = 1; index < 10; index++) {
        await api
            .get(`/desempenoambientals?populate[entidad][populate][0]=organismo&populate[entidad][populate][1]=osde&pagination[page]=${index}&pagination[pageSize]=100&sort[0]=anno%3Adesc&filters[anno][$containsi]=${data.fecha_actual}`)
            .then(function (response) {
                console.log(response);
                for (let i = 0; i < response.data.data.length; i++) {
                    if (response.data.data[i].attributes.entidad.data.length > 0) {

                        if (response.data.data[i].attributes.entidad.data[0].attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                        if (response.data.data[i].attributes.entidad.data[0].attributes.osde.data == null) {
                            response.data.data[i].attributes.entidad.data[0].attributes.osde.data = { attributes: { nombre: "-" } }
                        }

                        data.rows.push({
                            coordinador: response.data.data[i].attributes.exist_coordinador,
                            diagnostico: response.data.data[i].attributes.exist_diagnostico,
                            politica: response.data.data[i].attributes.exist_politica,
                            indicadores: response.data.data[i].attributes.exist_indicadores,
                            plan: response.data.data[i].attributes.exist_plan_accion,
                            legislacion: response.data.data[i].attributes.exist_legislacion,
                            capacitacion: response.data.data[i].attributes.exist_plan_capacitacion,
                            acciones: response.data.data[i].attributes.exist_accionespml,
                            programa: response.data.data[i].attributes.exist_program_gestionambiental,
                            recurso: response.data.data[i].attributes.exist_recurso_financiero,
                            aprovechamiento: response.data.data[i].attributes.aprovechamiento_economico,
                            sistema: response.data.data[i].attributes.exist_sistem_tratamiento,
                            carga: response.data.data[i].attributes.disminucion_carga_contaminante,
                            organismo: response.data.data[i].attributes.entidad.data[0].attributes.organismo.data[0].attributes.organismo,
                            oace: response.data.data[i].attributes.entidad.data[0].attributes.osde.data.attributes.nombre
                        });
                    }
                }


            })
            .catch(function (error) {
                console.log(error);
            });
    }
    for (let index = 0; index < data.indicadores.length; index++) {
        data.rows.forEach(element => {
            if ("Coordinador" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.coordinador
                }
                else {
                    data1[index] += element.coordinador
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data3[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Diagnostico" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.diagnostico
                }
                else {
                    data1[index] += element.diagnostico
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data3[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Politica" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.politica
                }
                else {
                    data1[index] += element.politica
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data3[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Indicadores" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.indicadores
                }
                else {
                    data1[index] += element.indicadores
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data3[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Plan de accion" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.plan
                }
                else {
                    data1[index] += element.plan
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data3[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Legislacion" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.legislacion
                }
                else {
                    data1[index] += element.legislacion
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data3[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Plan de capacitacion" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.capacitacion
                }
                else {
                    data1[index] += element.capacitacion
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data3[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Acciones PML" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.acciones
                }
                else {
                    data1[index] += element.acciones
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data3[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Programa de gestion ambiental" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.programa
                }
                else {
                    data1[index] += element.programa
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data3[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("recursos financieros" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.recurso
                }
                else {
                    data1[index] += element.recurso
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data3[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Aprovechamiento Economico" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.aprovechamiento
                }
                else {
                    data1[index] += element.aprovechamiento
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data3[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Sistema de tratamiento" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.sistema
                }
                else {
                    data1[index] += element.sistema
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data3[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Carga contaminante" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.carga
                }
                else {
                    data1[index] += element.carga
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data3[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }


        });

    }

    data1 = [], data2 = [], data.rows = []

    for (let index = 1; index < 10; index++) {
        await api
            .get(`/desempenoambientals?populate[entidad][populate][0]=organismo&populate[entidad][populate][1]=osde&pagination[page]=${index}&pagination[pageSize]=100&sort[0]=anno%3Adesc&filters[anno][$containsi]=${data.fecha_anterior}`)
            .then(function (response) {
                console.log(response);
                for (let i = 0; i < response.data.data.length; i++) {
                    if (response.data.data[i].attributes.entidad.data.length > 0) {

                        if (response.data.data[i].attributes.entidad.data[0].attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                        if (response.data.data[i].attributes.entidad.data[0].attributes.osde.data == null) {
                            response.data.data[i].attributes.entidad.data[0].attributes.osde.data = { attributes: { nombre: "-" } }
                        }

                        data.rows.push({
                            coordinador: response.data.data[i].attributes.exist_coordinador,
                            diagnostico: response.data.data[i].attributes.exist_diagnostico,
                            politica: response.data.data[i].attributes.exist_politica,
                            indicadores: response.data.data[i].attributes.exist_indicadores,
                            plan: response.data.data[i].attributes.exist_plan_accion,
                            legislacion: response.data.data[i].attributes.exist_legislacion,
                            capacitacion: response.data.data[i].attributes.exist_plan_capacitacion,
                            acciones: response.data.data[i].attributes.exist_accionespml,
                            programa: response.data.data[i].attributes.exist_program_gestionambiental,
                            recurso: response.data.data[i].attributes.exist_recurso_financiero,
                            aprovechamiento: response.data.data[i].attributes.aprovechamiento_economico,
                            sistema: response.data.data[i].attributes.exist_sistem_tratamiento,
                            carga: response.data.data[i].attributes.disminucion_carga_contaminante,
                            organismo: response.data.data[i].attributes.entidad.data[0].attributes.organismo.data[0].attributes.organismo,
                            oace: response.data.data[i].attributes.entidad.data[0].attributes.osde.data.attributes.nombre
                        });
                    }
                }


            })
            .catch(function (error) {
                console.log(error);
            });
    }

    for (let index = 0; index < data.indicadores.length; index++) {
        data.rows.forEach(element => {
            if ("Coordinador" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.coordinador
                }
                else {
                    data1[index] += element.coordinador
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data4[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Diagnostico" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.diagnostico
                }
                else {
                    data1[index] += element.diagnostico
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data4[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Politica" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.politica
                }
                else {
                    data1[index] += element.politica
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data4[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Indicadores" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.indicadores
                }
                else {
                    data1[index] += element.indicadores
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data4[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Plan de accion" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.plan
                }
                else {
                    data1[index] += element.plan
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data4[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Legislacion" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.legislacion
                }
                else {
                    data1[index] += element.legislacion
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data4[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Plan de capacitacion" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.capacitacion
                }
                else {
                    data1[index] += element.capacitacion
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data4[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Acciones PML" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.acciones
                }
                else {
                    data1[index] += element.acciones
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data4[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Programa de gestion ambiental" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.programa
                }
                else {
                    data1[index] += element.programa
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data4[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("recursos financieros" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.recurso
                }
                else {
                    data1[index] += element.recurso
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data4[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Aprovechamiento Economico" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.aprovechamiento
                }
                else {
                    data1[index] += element.aprovechamiento
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data4[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Sistema de tratamiento" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.sistema
                }
                else {
                    data1[index] += element.sistema
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data4[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }
            if ("Carga contaminante" == data.indicadores[index]) {
                if (!data1[index]) {
                    data1[index] = element.carga
                }
                else {
                    data1[index] += element.carga
                }
                if (!data2[index]) {
                    data2[index] = 1
                }
                else {
                    data2[index] += 1
                }
                data4[index] = (data1[index] / data2[index] * 100).toFixed(2)
            }


        });

    }

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

async function getopcion(params) {
    getDesempeño()
}

</script>