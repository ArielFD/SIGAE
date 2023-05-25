<template>
    <div class="col-12">
        <div class="text-center q-mt-xl" v-if="auth.printMode == true">
            <q-img src="~assets/Layout_/GTE-BH_print.png" class="banner" />
        </div>
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Plan de medidas" dense :rows="data.rows" :columns="columns"
                    row-key="name" v-model:selected="selected" v-model:pagination="pagination" :hide-bottom="auth.printMode"
                    wrap-cells no-data-label="Datos no disponibles">
                    <template v-slot:top>
                        <div style="width: 100%" class="row justify-center" v-if="auth.printMode == true">
                            <div class="col-2 text-h6">
                                <q-btn flat :label="data.titulo + data.fecha_actual" class="col-1  q-pa-xs"
                                    @click="auth.printMode = !auth.printMode" />
                            </div>
                        </div>
                        <div style="width: 100%" class="row justify-start" v-else>
                            <div class="col-3 text-h6" v-if="auth.jwt">
                                <q-btn flat label="Plan de medidas" icon="print" class="col-1  q-pa-xs"
                                    @click="auth.printMode = !auth.printMode" />
                            </div>
                            <div class="col-3 text-h6" v-else>
                                <q-btn flat label="Plan de medidas" class="col-1  q-pa-xs" />
                            </div>
                            <div class="col-2">
                                <q-select class="text-black q-pa-xs" dense outlined v-model="data.opcion"
                                    :options="data.opcions" label="Búsqueda por:" />
                            </div>
                            <div class="col-4" v-if="data.opcion == 'Entidad'">
                                <q-select class="text-black q-pa-xs" use-input input-debounce="0" dense outlined
                                    v-model="modelEntidad" :options="optionsEntidad" @filter="filterFnEntidad"
                                    label="Entidad" />
                            </div>
                            <div class="col-4" v-if="data.opcion == 'OACE'">
                                <q-select class="text-black q-pa-xs" use-input input-debounce="0" dense outlined
                                    v-model="modelOrganismo" :options="optionsOrganismo" @filter="filterFnOrganismo"
                                    label="OACE" />
                            </div>
                            <div class="col-4" v-if="data.opcion == 'OSDE'">
                                <q-select class="text-black q-pa-xs" use-input input-debounce="0" dense outlined
                                    v-model="modelOsde" :options="optionsOsde" @filter="filterFnOsde" label="OSDE" />
                            </div>
                            <div class="col-3">
                                <div class="row justify-start">
                                    <q-input outlined dense v-model="data.fecha_actual" type="number" label="Año"
                                        class="col-4 text-black q-pa-xs" />
                                    <q-btn flat round color="secondary" icon="search" class="col-1 text-black q-pa-xs"
                                        @click="getActacontrol()" />

                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-slot:bottom-row>
                        <q-tr>
                            <q-td>
                                Total
                            </q-td>
                            <q-td>
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.medidas_corto }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.cumplidas_corto }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.porcientoCorto }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.medidas_mediano }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.cumplidas_mediano }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.porcientoMedio }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.medidas_largo }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.cumplidas_largo }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.porcientoLargo }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.totalMedidas }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.totalCumplidas }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.porcientoTotal }}
                            </q-td>
                        </q-tr>
                    </template>
                </q-table>
            </q-card-section>
        </q-card>
        <div class="text-center q-mt-xl" v-if="auth.printMode == true">
            <p>_______________________________________</p>
            <p>Director de Gestion Ambiental</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { api } from "boot/axios.js";
import { useAuthStore } from "src/stores/auth-store";
import { useDataStore } from "src/stores/data-store";
import { useAlertsRulesStore } from "src/stores/alerts-rules-store";

const pagination = ref({
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 17,
});

const dataStore = useDataStore()
const auth = useAuthStore();
const alerts = useAlertsRulesStore();
const selected = ref([]);
const columns = [
    {
        name: "No",
        required: true,
        align: "center",
        label: "No",
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
    },
    {
        name: "entidad",
        align: "center",
        label: "Entidad",
        field: "entidad",
        sortable: true,
    },
    // {
    //     name: "organismo",
    //     align: "center",
    //     label: "Organismo",
    //     field: "organismo",
    //     sortable: true,
    // },
    {
        name: "medidas_corto",
        align: "center",
        label: "Medidas/C",
        field: "medidas_corto",
        sortable: true,
    },
    {
        name: "cumplidas_corto",
        align: "center",
        label: "Cumplidas/C",
        field: "cumplidas_corto",
        sortable: true,
    },
    {
        name: "porcientoCorto",
        align: "center",
        label: "%/C",
        field: "porcientoCorto",
        sortable: true,
    },
    {
        name: "medidas_mediano",
        align: "center",
        label: "Medidas/M",
        field: "medidas_mediano",
        sortable: true,
    },
    {
        name: "cumplidas_mediano",
        align: "center",
        label: "Cumplidas/M",
        field: "cumplidas_mediano",
        sortable: true,
    },
    {
        name: "porcientoMedio",
        align: "center",
        label: "%/M",
        field: "porcientoMedio",
        sortable: true,
    },
    {
        name: "medidas_largo",
        align: "center",
        label: "Medidas/L",
        field: "medidas_largo",
        sortable: true,
    },
    {
        name: "cumplidas_largo",
        align: "center",
        label: "Cumplidas/L",
        field: "cumplidas_largo",
        sortable: true,
    },
    {
        name: "porcientoLargo",
        align: "center",
        label: "%/L",
        field: "porcientoLargo",
        sortable: true,
    },
    {
        name: "totalMedidas",
        align: "center",
        label: "Total Medidas",
        field: "totalMedidas",
        sortable: true,
    },
    {
        name: "totalCumplidas",
        align: "center",
        label: "Total Cumplidas",
        field: "totalCumplidas",
        sortable: true,
    },
    {
        name: "porcientoTotal",
        align: "center",
        label: "%/Total",
        field: "porcientoTotal",
        sortable: true,
    },
];

const stringOptionsOrganismo = []
const modelOrganismo = ref([])
const optionsOrganismo = ref(stringOptionsOrganismo)

const stringOptionsEntidad = []
const modelEntidad = ref([])
const optionsEntidad = ref(stringOptionsEntidad)

const stringOptionsOsde = []
const modelOsde = ref([])
const optionsOsde = ref(stringOptionsOsde)

let data = reactive({
    titulo: "Plan de medias ",
    rows: [],
    rowTotal: {},
    opcion: "",
    opcions: ["Entidad", "OACE", "OSDE"],
    entidades: [],
    organismos: [],
    osdes: [],

    fecha_actual: new Date(),
    fecha_cliente: "",
});

function getYear(params) {
    data.fecha_actual = data.fecha_actual.getFullYear()
    data.fecha_cliente = data.fecha_actual - 1
}

function filterFnOsde(val, update) {
    if (val === '') {
        update(() => {
            optionsOsde.value = stringOptionsOsde

            // here you have access to "ref" which
            // is the Vue reference of the QSelect
        })
        return
    }

    update(() => {
        const needle = val.toLowerCase()
        optionsOsde.value = stringOptionsOsde.filter(v => v.toLowerCase().indexOf(needle) > -1)
    })
}

function filterFnEntidad(val, update) {
    if (val === '') {
        update(() => {
            optionsEntidad.value = stringOptionsEntidad

            // here you have access to "ref" which
            // is the Vue reference of the QSelect
        })
        return
    }

    update(() => {
        const needle = val.toLowerCase()
        optionsEntidad.value = stringOptionsEntidad.filter(v => v.toLowerCase().indexOf(needle) > -1)
    })
}

function filterFnOrganismo(val, update) {
    if (val === '') {
        update(() => {
            optionsOrganismo.value = stringOptionsOrganismo

            // here you have access to "ref" which
            // is the Vue reference of the QSelect
        })
        return
    }

    update(() => {
        const needle = val.toLowerCase()
        optionsOrganismo.value = stringOptionsOrganismo.filter(v => v.toLowerCase().indexOf(needle) > -1)
    })
}

onMounted(() => {
    getYear(),
        getEntidad(),
        getOrganismos(),
        getOSDE()
});


async function getOrganismos(params) {
    dataStore.organismo.forEach(element => {
        stringOptionsOrganismo.push(element.organismo)
    });
}

async function getOSDE(params) {
    dataStore.osde.forEach(element => {
        stringOptionsOsde.push(element.Nombre)
    });
}

async function getEntidad(params) {
    dataStore.entidad.forEach(element => {
        stringOptionsEntidad.push(element.entidad)
    });
}

async function getActacontrol(params) {
    data.rows = [];

    const dataRest = {
        fecha: data.fecha_actual,
        opcion: data.opcion,
        modelo: modelEntidad.value
    }

    api
        .get(`/getActacontrol?filters[0]=${data.fecha_actual}&filters[1]=${data.opcion}&filters[2]=${modelEntidad.value}&filters[3]=${modelOrganismo.value}&filters[4]=${modelOsde.value}`).then(function (response) {
            console.log(response);
            data.rows = response.data.rows
            data.rowTotal = response.data.rowTotal
        }).catch(function (error) {
            console.log(error);
        });
}

</script>

<style scoped>
.q-td {
    text-align: center;
}
</style>