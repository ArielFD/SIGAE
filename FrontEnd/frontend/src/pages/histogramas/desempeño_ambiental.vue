<template>
    <div class="col-12 q-pa-md">
        <div class="row justify-between">
            <p class="col-6">
                <label><b>Desempeño ambiental por:</b> </label> &nbsp;
                <q-radio v-model="data.organismo" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="OACE"
                    label="OACE" color="secondary" />
                <q-radio v-model="data.organismo" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="OSDE"
                    label="OSDE" color="secondary" />
            </p>
            <div class="col-3">
                <div class="row">
                    <q-input outlined dense v-model="data.fecha_anterior" type="number" label="Año 1"
                        class="text-black q-pa-xs" style="width:100px" />
                    <q-input outlined dense v-model="data.fecha_actual" type="number" label="Año 2"
                        class="text-black q-pa-xs" style="width:100px" />
                    <q-btn flat round color="secondary" icon="search" class="text-black q-pa-xs"
                        @click="getEnfrentamiento()" />
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
})

let data = reactive({
    fecha_actual: new Date(),
    fecha_anterior: "",
    organismo: "OACE",
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
    data.fecha_anterior = data.fecha_actual - 1
}

async function getEnfrentamiento(params) {
    data.rows = [];
    let count = 1
    let category = []
    let data1 = [], data2 = [], data3 = [], data4 = []
    for (let index = 1; index < 10; index++) {
        await api
            .get(`/desempenoambientals?populate[entidad][populate][0]=organismo&populate[entidad][populate][1]=osde&pagination[page]=${index}&pagination[pageSize]=100&sort[0]=anno%3Adesc&filters[anno][$containsi]=${data.fecha_actual}`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
            .then(function (response) {
                console.log(response);
                let data1 = [], data2 = []
                for (let i = 0; i < response.data.data.length; i++) {
                    if (response.data.data[i].attributes.entidad.data.length > 0) {
                        if (data.organismo == "OACE" && response.data.data[i].attributes.entidad.data[0].attributes.organismo.data.length > 0) {

                            if (response.data.data[i].attributes.entidad.data[0].attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                            if (response.data.data[i].attributes.entidad.data[0].attributes.osde.data == null) {
                                response.data.data[i].attributes.entidad.data[0].attributes.osde.data = { attributes: { nombre: "-" } }
                            }

                            if (!category.includes(response.data.data[i].attributes.entidad.data[0].attributes.organismo.data[0].attributes.organismo)) category.push(response.data.data[i].attributes.entidad.data[0].attributes.organismo.data[0].attributes.organismo);

                            for (let index = 0; index < category.length; index++) {
                                if (category[index] == response.data.data[i].attributes.entidad.data[0].attributes.organismo.data[0].attributes.organismo) {
                                    if (!data1[index]) {
                                        data1[index] = response.data.data[i].attributes.disminucion_carga_contaminante + response.data.data[i].attributes.exist_sistem_tratamiento + response.data.data[i].attributes.aprovechamiento_economico + response.data.data[i].attributes.exist_recurso_financiero + response.data.data[i].attributes.exist_program_gestionambiental + response.data.data[i].attributes.exist_accionespml + response.data.data[i].attributes.exist_plan_capacitacion + response.data.data[i].attributes.exist_legislacion + response.data.data[i].attributes.exist_plan_accion + response.data.data[i].attributes.exist_coordinador + response.data.data[i].attributes.exist_diagnostico + response.data.data[i].attributes.exist_politica + response.data.data[i].attributes.exist_indicadores
                                    }
                                    else {
                                        data1[index] = data1[index] + response.data.data[i].attributes.disminucion_carga_contaminante + response.data.data[i].attributes.exist_sistem_tratamiento + response.data.data[i].attributes.aprovechamiento_economico + response.data.data[i].attributes.exist_recurso_financiero + response.data.data[i].attributes.exist_program_gestionambiental + response.data.data[i].attributes.exist_accionespml + response.data.data[i].attributes.exist_plan_capacitacion + response.data.data[i].attributes.exist_legislacion + response.data.data[i].attributes.exist_plan_accion + response.data.data[i].attributes.exist_coordinador + response.data.data[i].attributes.exist_diagnostico + response.data.data[i].attributes.exist_politica + response.data.data[i].attributes.exist_indicadores
                                    }
                                    if (!data2[index]) {
                                        data2[index] = 13
                                    }
                                    else {
                                        data2[index] = data2[index] + 13
                                    }
                                }
                            }

                            for (let index = 0; index < category.length; index++) {
                                data4[index] = (data1[index] / data2[index] * 100).toFixed(2)
                                if(data4[index]=='NaN') data4[index]=0
                            }


                        } else if (data.organismo == 'OSDE' && response.data.data[i].attributes.entidad.data[0].attributes.osde.data != null) {
                            if (response.data.data[i].attributes.entidad.data[0].attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data[0].attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                            if (!category.includes(response.data.data[i].attributes.entidad.data[0].attributes.osde.data.attributes.nombre)) category.push(response.data.data[i].attributes.entidad.data[0].attributes.osde.data.attributes.nombre);

                            for (let index = 0; index < category.length; index++) {
                                if (category[index] == response.data.data[i].attributes.entidad.data[0].attributes.osde.data.attributes.nombre) {
                                    if (!data1[index]) {
                                        data1[index] = response.data.data[i].attributes.disminucion_carga_contaminante + response.data.data[i].attributes.exist_sistem_tratamiento + response.data.data[i].attributes.aprovechamiento_economico + response.data.data[i].attributes.exist_recurso_financiero + response.data.data[i].attributes.exist_program_gestionambiental + response.data.data[i].attributes.exist_accionespml + response.data.data[i].attributes.exist_plan_capacitacion + response.data.data[i].attributes.exist_legislacion + response.data.data[i].attributes.exist_plan_accion + response.data.data[i].attributes.exist_coordinador + response.data.data[i].attributes.exist_diagnostico + response.data.data[i].attributes.exist_politica + response.data.data[i].attributes.exist_indicadores
                                    }
                                    else {
                                        data1[index] = data1[index] + response.data.data[i].attributes.disminucion_carga_contaminante + response.data.data[i].attributes.exist_sistem_tratamiento + response.data.data[i].attributes.aprovechamiento_economico + response.data.data[i].attributes.exist_recurso_financiero + response.data.data[i].attributes.exist_program_gestionambiental + response.data.data[i].attributes.exist_accionespml + response.data.data[i].attributes.exist_plan_capacitacion + response.data.data[i].attributes.exist_legislacion + response.data.data[i].attributes.exist_plan_accion + response.data.data[i].attributes.exist_coordinador + response.data.data[i].attributes.exist_diagnostico + response.data.data[i].attributes.exist_politica + response.data.data[i].attributes.exist_indicadores
                                    }
                                    if (!data2[index]) {
                                        data2[index] = 13
                                    }
                                    else {
                                        data2[index] = data2[index] + 13
                                    }
                                }
                            }

                            for (let index = 0; index < category.length; index++) {
                                data4[index] = (data1[index] / data2[index] * 100).toFixed(2)
                                if(data4[index]=='NaN') data4[index]=0
                            }
                        }
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    for (let index = 1; index < 10; index++) {
        await api
            .get(`/desempenoambientals?populate[entidad][populate][0]=organismo&populate[entidad][populate][1]=osde&pagination[page]=${index}&pagination[pageSize]=100&sort[0]=anno%3Adesc&filters[anno][$containsi]=${data.fecha_anterior}`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
            .then(function (response) {
                console.log(response);
                let data1 = [], data2 = []
                for (let i = 0; i < response.data.data.length; i++) {
                    if (response.data.data[i].attributes.entidad.data.length > 0) {
                        if (data.organismo == "OACE" && response.data.data[i].attributes.entidad.data[0].attributes.organismo.data.length > 0) {

                            if (response.data.data[i].attributes.entidad.data[0].attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                            if (response.data.data[i].attributes.entidad.data[0].attributes.osde.data == null) {
                                response.data.data[i].attributes.entidad.data[0].attributes.osde.data = { attributes: { nombre: "-" } }
                            }

                            if (!category.includes(response.data.data[i].attributes.entidad.data[0].attributes.organismo.data[0].attributes.organismo)) category.push(response.data.data[i].attributes.entidad.data[0].attributes.organismo.data[0].attributes.organismo);

                            for (let index = 0; index < category.length; index++) {
                                if (category[index] == response.data.data[i].attributes.entidad.data[0].attributes.organismo.data[0].attributes.organismo) {
                                    if (!data1[index]) {
                                        data1[index] = response.data.data[i].attributes.disminucion_carga_contaminante + response.data.data[i].attributes.exist_sistem_tratamiento + response.data.data[i].attributes.aprovechamiento_economico + response.data.data[i].attributes.exist_recurso_financiero + response.data.data[i].attributes.exist_program_gestionambiental + response.data.data[i].attributes.exist_accionespml + response.data.data[i].attributes.exist_plan_capacitacion + response.data.data[i].attributes.exist_legislacion + response.data.data[i].attributes.exist_plan_accion + response.data.data[i].attributes.exist_coordinador + response.data.data[i].attributes.exist_diagnostico + response.data.data[i].attributes.exist_politica + response.data.data[i].attributes.exist_indicadores
                                    }
                                    else {
                                        data1[index] = data1[index] + response.data.data[i].attributes.disminucion_carga_contaminante + response.data.data[i].attributes.exist_sistem_tratamiento + response.data.data[i].attributes.aprovechamiento_economico + response.data.data[i].attributes.exist_recurso_financiero + response.data.data[i].attributes.exist_program_gestionambiental + response.data.data[i].attributes.exist_accionespml + response.data.data[i].attributes.exist_plan_capacitacion + response.data.data[i].attributes.exist_legislacion + response.data.data[i].attributes.exist_plan_accion + response.data.data[i].attributes.exist_coordinador + response.data.data[i].attributes.exist_diagnostico + response.data.data[i].attributes.exist_politica + response.data.data[i].attributes.exist_indicadores
                                    }
                                    if (!data2[index]) {
                                        data2[index] = 13
                                    }
                                    else {
                                        data2[index] = data2[index] + 13
                                    }
                                }
                            }

                            for (let index = 0; index < category.length; index++) {
                                data3[index] = (data1[index] / data2[index] * 100).toFixed(2)
                                if(data3[index]=='NaN') data3[index]=0
                            }


                        } else if (data.organismo == 'OSDE' && response.data.data[i].attributes.entidad.data[0].attributes.osde.data != null) {
                            if (response.data.data[i].attributes.entidad.data[0].attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data[0].attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                            if (!category.includes(response.data.data[i].attributes.entidad.data[0].attributes.osde.data.attributes.nombre)) category.push(response.data.data[i].attributes.entidad.data[0].attributes.osde.data.attributes.nombre);

                            for (let index = 0; index < category.length; index++) {
                                if (category[index] == response.data.data[i].attributes.entidad.data[0].attributes.osde.data.attributes.nombre) {
                                    if (!data1[index]) {
                                        data1[index] = response.data.data[i].attributes.disminucion_carga_contaminante + response.data.data[i].attributes.exist_sistem_tratamiento + response.data.data[i].attributes.aprovechamiento_economico + response.data.data[i].attributes.exist_recurso_financiero + response.data.data[i].attributes.exist_program_gestionambiental + response.data.data[i].attributes.exist_accionespml + response.data.data[i].attributes.exist_plan_capacitacion + response.data.data[i].attributes.exist_legislacion + response.data.data[i].attributes.exist_plan_accion + response.data.data[i].attributes.exist_coordinador + response.data.data[i].attributes.exist_diagnostico + response.data.data[i].attributes.exist_politica + response.data.data[i].attributes.exist_indicadores
                                    }
                                    else {
                                        data1[index] = data1[index] + response.data.data[i].attributes.disminucion_carga_contaminante + response.data.data[i].attributes.exist_sistem_tratamiento + response.data.data[i].attributes.aprovechamiento_economico + response.data.data[i].attributes.exist_recurso_financiero + response.data.data[i].attributes.exist_program_gestionambiental + response.data.data[i].attributes.exist_accionespml + response.data.data[i].attributes.exist_plan_capacitacion + response.data.data[i].attributes.exist_legislacion + response.data.data[i].attributes.exist_plan_accion + response.data.data[i].attributes.exist_coordinador + response.data.data[i].attributes.exist_diagnostico + response.data.data[i].attributes.exist_politica + response.data.data[i].attributes.exist_indicadores
                                    }
                                    if (!data2[index]) {
                                        data2[index] = 13
                                    }
                                    else {
                                        data2[index] = data2[index] + 13
                                    }
                                }
                            }

                            for (let index = 0; index < category.length; index++) {
                                data3[index] = (data1[index] / data2[index] * 100).toFixed(2)
                                if(data3[index]=='NaN') data3[index]=0
                            }
                        }
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    
    data.chartOptions = {
        xaxis: {
            categories: category
        }
    };
    data.series = [
        {
            name: data.fecha_anterior,
            data: data3,
        },
        {
            name: data.fecha_actual,
            data: data4,
        }
    ]

}

</script>