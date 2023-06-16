<template>
    <div class="col-12">
        <div class="text-center q-mt-xl" v-if="auth.printMode == true">
            <q-img src="~assets/Layout_/GTE-BH_print.png" class="banner" />
        </div>
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Plan de enfrentamiento" dense :rows="data.rows"
                    :columns="columns" row-key="name" selection="single" v-model:selected="selected"
                    v-model:pagination="pagination" wrap-cells :hide-bottom="auth.printMode"
                    no-data-label="Datos no disponibles">
                    <template v-slot:top>
                        <div style="width: 100%" class="row justify-center" v-if="auth.printMode == true">
                            <div class="col-3 text-h6">
                                <q-btn flat :label="data.titulo" class="col-1  q-pa-xs"
                                    @click="auth.printMode = !auth.printMode" />
                            </div>
                        </div>
                        <div style="width: 100%" class="row justify-start" v-else>
                            <div class="col-3 text-h6" v-if="auth.jwt">
                                <q-btn flat label="Plan de enfrentamiento" icon="print" class="col-1  q-pa-xs"
                                    @click="auth.printMode = !auth.printMode" />
                            </div>
                            <div class="col-3 text-h6" v-else>
                                <q-btn flat label="Plan de enfrentamiento" class="col-1  q-pa-xs" />
                            </div>
                            <div class="col-2">
                                <q-select class="text-black q-pa-xs" dense outlined v-model="data.opcion"
                                    :options="data.opcions" label="Búsqueda por:" />
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
                                <div class="row justify-center">
                                    <q-input outlined dense v-model="data.fecha_actual" type="number" label="Año"
                                        class="col-4 text-black q-pa-xs" />
                                    <q-btn flat round color="secondary" icon="search" class="col-2 text-black q-pa-xs"
                                        @click="getEnfrentamiento()" />
                                </div>
                            </div>
                        </div>
                    </template>
                </q-table>
            </q-card-section>
        </q-card>
        <div class="text-center q-mt-xl" v-if="auth.printMode == true">
            <p>_______________________________________</p>
            <p>Director de Gestión Ambiental</p>
        </div>
    </div>
</template>
  
<script setup>
import { onMounted, reactive, ref } from "vue";
import { api } from "boot/axios.js";
import { useAuthStore } from "src/stores/auth-store";
import { useAlertsRulesStore } from "src/stores/alerts-rules-store";

const pagination = ref({
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 17,
});

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
    {
        name: "oace",
        align: "center",
        label: "OACE",
        field: "oace",
        sortable: true,
    },
    {
        name: "osde",
        align: "center",
        label: "OSDE",
        field: "osde",
        sortable: true,
    },
    {
        name: "medidas",
        align: "center",
        label: "Total de Medidas",
        field: "medidas",
        sortable: true,
    },
    {
        name: "cumplidas",
        align: "center",
        label: "Total de Medidas Cumplidas",
        field: "cumplidas",
        sortable: true,
    },
    {
        name: "incumplidas",
        align: "center",
        label: "Total de Medidas Incumplidas",
        field: "incumplidas",
        sortable: true,
    },
    {
        name: "funcionaBien",
        align: "center",
        label: "Funciona Bien",
        field: "funcionaBien",
        sortable: true,
    },
    {
        name: "monitoreo",
        align: "center",
        label: "Monitoreo",
        field: "monitoreo",
        sortable: true,
    },
    {
        name: "inversiones",
        align: "center",
        label: "Inversiones",
        field: "inversiones",
        sortable: true,
    },
    {
        name: "permiso",
        align: "center",
        label: "Permiso de Vertimiento",
        field: "permiso",
        sortable: true,
    },
    {
        name: "nombreLicencia",
        align: "center",
        label: "Licencia Ambiental",
        field: "nombreLicencia",
        sortable: true,
    },
    {
        name: "plan",
        align: "center",
        label: "Plan de Manejo",
        field: "plan",
        sortable: true,
    }
];

const stringOptionsOrganismo = []
const modelOrganismo = ref([])
const optionsOrganismo = ref(stringOptionsOrganismo)

const stringOptionsOsde = []
const modelOsde = ref([])
const optionsOsde = ref(stringOptionsOsde)

let data = reactive({
    titulo: "Plan de enfrentamiento",
    temp: false,
    rows: [],
    rows1: [],
    rows2: [],
    opcion: "",
    opcions: ["OACE", "OSDE"],

    organismos: [],
    osdes: [],

    fecha_actual: new Date(),
});

function getYear(params) {
    data.fecha_actual = data.fecha_actual.getFullYear()
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
    getOrganismos(),
        getOSDE()
        getYear()
});

async function getOrganismos(params) {
    for (let index = 1; index < 2; index++) {
        await api
            .get(`/organismos?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100`)
            .then(function (response) {
                //console.log(response);
                for (let i = 0; i < response.data.data.length; i++) {
                    data.organismos.push({
                        id: response.data.data[i].id,
                        organismo: response.data.data[i].attributes.organismo
                    });
                }
                data.organismos.forEach(element => {
                    stringOptionsOrganismo.push(element.organismo)
                });
            })
            .catch(function (error) {
                console.log(error);
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
                    data.osdes.push({
                        id: response.data.data[i].id,
                        osde: response.data.data[i].attributes.nombre
                    });
                }
                data.osdes.forEach(element => {
                    stringOptionsOsde.push(element.osde)
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

async function getEnfrentamiento(params) {
    data.rows = [];
    let count = 1
    await api
        .get(`/plan-enfrentamientos?populate[0]=entidad.organismo&populate[1]=entidad.osde&filters[fecha][$containsi]=${data.fecha_actual}`)
        .then(function (response) {
            console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                if (response.data.data[i].attributes.entidad.data != null) {
                    if (data.opcion == 'OACE' && response.data.data[i].attributes.entidad.data.attributes.organismo.data.length > 0 && response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo == modelOrganismo.value) {
                        if (response.data.data[i].attributes.entidad.data.attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                        if (response.data.data[i].attributes.entidad.data.attributes.osde.data == null) {
                            response.data.data[i].attributes.entidad.data.attributes.osde.data = { attributes: { nombre: "-" } }
                        }
                        // console.log(response);
                        data.rows.push({
                            name: count,
                            id: response.data.data[i].id,
                            entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                            desechos: response.data.data[i].attributes.desechos,
                            inversiones: response.data.data[i].attributes.inversiones,
                            licencia: response.data.data[i].attributes.licencia,
                            observaciones: response.data.data[i].attributes.observaciones,
                            permiso: response.data.data[i].attributes.permiso,
                            plan: response.data.data[i].attributes.plan,
                            sistema: response.data.data[i].attributes.sistema,
                            trampa: response.data.data[i].attributes.trampa,
                            medidas: response.data.data[i].attributes.medidas,
                            cumplidas: response.data.data[i].attributes.cumplidas,
                            evaluadas: response.data.data[i].attributes.evaluadas,
                            incumplidas: response.data.data[i].attributes.incumplidas,
                            cuerpoReceptor: response.data.data[i].attributes.cuerpoReceptor,
                            descripcion: response.data.data[i].attributes.descripcion,
                            marchaAcorde: response.data.data[i].attributes.marchaAcorde,
                            nombreLicencia: response.data.data[i].attributes.nombreLicencia,
                            nombrePermiso: response.data.data[i].attributes.nombrePermiso,
                            observacionesDesechos: response.data.data[i].attributes.observacionesDesechos,
                            fecha: response.data.data[i].attributes.fecha,
                            monitoreo: response.data.data[i].attributes.licencia,
                            funcionaBien: response.data.data[i].attributes.permiso,
                            Inversiones: response.data.data[i].attributes.licencia,
                            oace: response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo,
                            osde: response.data.data[i].attributes.entidad.data.attributes.osde.data.attributes.nombre
                        });
                        count++
                    } else if (data.opcion == 'OSDE' && response.data.data[i].attributes.entidad.data.attributes.osde.data != null && response.data.data[i].attributes.entidad.data.attributes.osde.data.attributes.nombre == modelOsde.value) {
                        if (response.data.data[i].attributes.entidad.data.attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                        data.rows.push({
                            name: count,
                            id: response.data.data[i].id,
                            entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                            desechos: response.data.data[i].attributes.desechos,
                            inversiones: response.data.data[i].attributes.inversiones,
                            licencia: response.data.data[i].attributes.licencia,
                            observaciones: response.data.data[i].attributes.observaciones,
                            permiso: response.data.data[i].attributes.permiso,
                            plan: response.data.data[i].attributes.plan,
                            sistema: response.data.data[i].attributes.sistema,
                            trampa: response.data.data[i].attributes.trampa,
                            medidas: response.data.data[i].attributes.medidas,
                            cumplidas: response.data.data[i].attributes.cumplidas,
                            evaluadas: response.data.data[i].attributes.evaluadas,
                            incumplidas: response.data.data[i].attributes.incumplidas,
                            cuerpoReceptor: response.data.data[i].attributes.cuerpoReceptor,
                            descripcion: response.data.data[i].attributes.descripcion,
                            marchaAcorde: response.data.data[i].attributes.marchaAcorde,
                            nombreLicencia: response.data.data[i].attributes.nombreLicencia,
                            nombrePermiso: response.data.data[i].attributes.nombrePermiso,
                            observacionesDesechos: response.data.data[i].attributes.observacionesDesechos,
                            fecha: response.data.data[i].attributes.fecha,
                            monitoreo: response.data.data[i].attributes.licencia,
                            funcionaBien: response.data.data[i].attributes.permiso,
                            Inversiones: response.data.data[i].attributes.licencia,
                            oace: response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo,
                            osde: response.data.data[i].attributes.entidad.data.attributes.osde.data.attributes.nombre
                        });
                        count++
                    }
                }
            }
            for (let i = 0; i < data.rows.length; i++) {
                    Object.keys(data.rows[i]).forEach(function (key) {
                        if (data.rows[i][key] === true) {
                            data.rows[i][key] = "si"
                        } else if (data.rows[i][key] === false) {
                            data.rows[i][key] = "no"
                        }
                    })
                

            }
        })
        .catch(function (error) {
            console.log(error);
        });

}

</script>