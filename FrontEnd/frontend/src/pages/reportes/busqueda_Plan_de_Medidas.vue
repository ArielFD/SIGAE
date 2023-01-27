<template>
    <div class="col-12">
        <div  class="text-center q-mt-xl" v-if="auth.printMode == true">
            <q-img src="~assets/Layout_/baner_1.png" class="banner" />
        </div>
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Plan de medidas" dense :rows="data.rows"
                    :columns="columns" row-key="name" v-model:selected="selected" v-model:pagination="pagination" :hide-bottom="auth.printMode">
                    <template v-slot:top>
                        <div style="width: 100%" class="row justify-start">
                            <div class="col-3 text-h6">
                                <q-btn flat label="Plan de medidas"  class="col-1  q-pa-xs"
                                        @click="auth.printMode = !auth.printMode" v-if="auth.printMode == true" />
                                    <q-btn flat label="Plan de medidas" icon="print" class="col-1  q-pa-xs"
                                        @click="auth.printMode = !auth.printMode" v-else />
                            </div>
                            <div class="col-2" v-if="auth.printMode == false">
                                <q-select class="text-black q-pa-xs" dense outlined v-model="data.opcion"
                                    :options="data.opcions" label="Busqueda por:" />
                            </div>
                            <div class="col-4" v-if="data.opcion == 'Entidad' && auth.printMode == false">
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
                                    <q-input outlined dense v-model="data.fecha_actual" type="number"
                                        label="Año a buscar" class="col-4 text-black q-pa-xs" v-if="auth.printMode == false"/>
                                    <q-input outlined dense v-model="data.fecha_cliente" type="number"
                                        label="Año a comparar" class="col-4 text-black q-pa-xs" v-if="auth.printMode == false"/>
                                    <q-btn flat round color="secondary" icon="search" class="col-1 text-black q-pa-xs"
                                        @click="getActacontrol()" v-if="auth.printMode == false"/>
                                    
                                </div>
                            </div>
                        </div>
                    </template>
                </q-table>
            </q-card-section>
        </q-card>
        <div  class="text-center q-mt-xl" v-if="auth.printMode == true">
            <p>_______________________________________</p>
            <p>Firma de la Direccion</p>
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
    temp: false,
    rows: [],
    rows1: [],
    opcion: "",
    opcions: ["Entidad", "OACE", "OSDE"],

    histogramOptions: {
        year1: [],
        year2: [],
    },
    entidades: [],
    organismos: [],
    osdes: [],

    fecha_actual: new Date(),
    fecha_cliente: "",
});

function getYear(params) {
    data.fecha_actual = data.fecha_actual.getFullYear()
    data.fecha_cliente=data.fecha_actual-1
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
    for (let index = 1; index < 2; index++) {
        await api
            .get(`/organismos?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
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
                console.log(error.response);
            });
    }
}

async function getOSDE(params) {
    for (let index = 1; index < 2; index++) {
        await api
            .get(`/osdes`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
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
                console.log(error.response);
            });
    }
}

function getEntidad(params) {
    api
        .get(`/entidads?filters[activo][$eq]=s`, {
            headers: {
                Authorization: "Bearer " + auth.jwt,
            },
        }).then(function (response) {
            ////console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                data.entidades.push({
                    nombre: response.data.data[i].attributes.entidad,
                    id: response.data.data[i].id
                }
                )
            }
            data.entidades.forEach(element => {
                stringOptionsEntidad.push(element.nombre)
            });
        }).catch(function (error) {
            console.log(error.response);
        });
}

async function getActacontrol(params) {
    data.histogramOptions = {
        year1: [],
        year2: [],
    },
        data.rows = [];
    data.rows1 = [];

    let count = 1
    await api
        .get(`/actacontrols?populate[entidad][populate][0]=organismo&populate[entidad][populate][1]=osde&filters[fechavisita][$containsi]=${data.fecha_actual}`, {
            headers: {
                Authorization: "Bearer " + auth.jwt,
            },
        })
        .then(function (response) {
            //console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                //Unidad de Camiones # 1
                if (response.data.data[i].attributes.entidad.data != null) {
                    if (data.opcion == 'Entidad' && response.data.data[i].attributes.entidad.data.attributes.entidad == modelEntidad.value) {
                        if (response.data.data[i].attributes.entidad.data.attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                        data.rows.push({
                            year: data.fecha_actual,
                            name: count,
                            id: response.data.data[i].id,
                            cumplidas_corto: response.data.data[i].attributes.cumplidas_corto,
                            cumplidas_largo: response.data.data[i].attributes.cumplidas_largo,
                            cumplidas_mediano: response.data.data[i].attributes.cumplidas_mediano,
                            medidas_corto: response.data.data[i].attributes.medidas_corto,
                            medidas_largo: response.data.data[i].attributes.medidas_largo,
                            medidas_mediano: response.data.data[i].attributes.medidas_mediano,
                            totalMedidas: response.data.data[i].attributes.medidas_corto + response.data.data[i].attributes.medidas_largo + response.data.data[i].attributes.medidas_mediano,
                            totalCumplidas: response.data.data[i].attributes.cumplidas_largo + response.data.data[i].attributes.cumplidas_corto + response.data.data[i].attributes.cumplidas_mediano,
                            porcientoCorto: ((response.data.data[i].attributes.cumplidas_corto / response.data.data[i].attributes.medidas_corto) * 100).toFixed(2),
                            porcientoMedio: (response.data.data[i].attributes.cumplidas_mediano / response.data.data[i].attributes.medidas_mediano) * 100,
                            porcientoLargo: (response.data.data[i].attributes.cumplidas_largo / response.data.data[i].attributes.medidas_largo) * 100,
                            porcientoTotal: ((response.data.data[i].attributes.cumplidas_largo + response.data.data[i].attributes.cumplidas_corto + response.data.data[i].attributes.cumplidas_mediano) / (response.data.data[i].attributes.medidas_corto + response.data.data[i].attributes.medidas_largo + response.data.data[i].attributes.medidas_mediano)) * 100,
                            entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                            organismo: response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo
                        });
                        data.histogramOptions.year2.push(data.rows)
                        count++
                    } else if (data.opcion == 'OACE' && response.data.data[i].attributes.entidad.data.attributes.organismo.data.length > 0 && response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo == modelOrganismo.value) {
                        if (response.data.data[i].attributes.entidad.data.attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                        data.rows.push({
                            year: data.fecha_actual,
                            name: count,
                            id: response.data.data[i].id,
                            cumplidas_corto: response.data.data[i].attributes.cumplidas_corto,
                            cumplidas_largo: response.data.data[i].attributes.cumplidas_largo,
                            cumplidas_mediano: response.data.data[i].attributes.cumplidas_mediano,
                            medidas_corto: response.data.data[i].attributes.medidas_corto,
                            medidas_largo: response.data.data[i].attributes.medidas_largo,
                            medidas_mediano: response.data.data[i].attributes.medidas_mediano,
                            totalMedidas: response.data.data[i].attributes.medidas_corto + response.data.data[i].attributes.medidas_largo + response.data.data[i].attributes.medidas_mediano,
                            totalCumplidas: response.data.data[i].attributes.cumplidas_largo + response.data.data[i].attributes.cumplidas_corto + response.data.data[i].attributes.cumplidas_mediano,
                            porcientoCorto: ((response.data.data[i].attributes.cumplidas_corto / response.data.data[i].attributes.medidas_corto) * 100).toFixed(2),
                            porcientoMedio: ((response.data.data[i].attributes.cumplidas_mediano / response.data.data[i].attributes.medidas_mediano) * 100).toFixed(2),
                            porcientoLargo: ((response.data.data[i].attributes.cumplidas_largo / response.data.data[i].attributes.medidas_largo) * 100).toFixed(2),
                            porcientoTotal: (((response.data.data[i].attributes.cumplidas_largo + response.data.data[i].attributes.cumplidas_corto + response.data.data[i].attributes.cumplidas_mediano) / (response.data.data[i].attributes.medidas_corto + response.data.data[i].attributes.medidas_largo + response.data.data[i].attributes.medidas_mediano)) * 100).toFixed(2),
                            entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                            organismo: response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo
                        });
                        data.histogramOptions.year2.push(data.rows)
                        count++
                    } else if (data.opcion == 'OSDE' && response.data.data[i].attributes.entidad.data.attributes.osde.data != null && response.data.data[i].attributes.entidad.data.attributes.osde.data.attributes.nombre == modelOsde.value) {
                        if (response.data.data[i].attributes.entidad.data.attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                        data.rows.push({
                            year: data.fecha_actual,
                            name: count,
                            id: response.data.data[i].id,
                            cumplidas_corto: response.data.data[i].attributes.cumplidas_corto,
                            cumplidas_largo: response.data.data[i].attributes.cumplidas_largo,
                            cumplidas_mediano: response.data.data[i].attributes.cumplidas_mediano,
                            medidas_corto: response.data.data[i].attributes.medidas_corto,
                            medidas_largo: response.data.data[i].attributes.medidas_largo,
                            medidas_mediano: response.data.data[i].attributes.medidas_mediano,
                            totalMedidas: response.data.data[i].attributes.medidas_corto + response.data.data[i].attributes.medidas_largo + response.data.data[i].attributes.medidas_mediano,
                            totalCumplidas: response.data.data[i].attributes.cumplidas_largo + response.data.data[i].attributes.cumplidas_corto + response.data.data[i].attributes.cumplidas_mediano,
                            porcientoCorto: ((response.data.data[i].attributes.cumplidas_corto / response.data.data[i].attributes.medidas_corto) * 100).toFixed(2),
                            porcientoMedio: ((response.data.data[i].attributes.cumplidas_mediano / response.data.data[i].attributes.medidas_mediano) * 100).toFixed(2),
                            porcientoLargo: ((response.data.data[i].attributes.cumplidas_largo / response.data.data[i].attributes.medidas_largo) * 100).toFixed(2),
                            porcientoTotal: (((response.data.data[i].attributes.cumplidas_largo + response.data.data[i].attributes.cumplidas_corto + response.data.data[i].attributes.cumplidas_mediano) / (response.data.data[i].attributes.medidas_corto + response.data.data[i].attributes.medidas_largo + response.data.data[i].attributes.medidas_mediano)) * 100).toFixed(2),
                            entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                            organismo: response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo
                        });
                        data.histogramOptions.year2.push(data.rows)
                        count++
                    }
                }
            }

            // let cumplidas_corto = 0, cumplidas_largo = 0, cumplidas_mediano = 0, medidas_corto = 0, medidas_largo = 0, medidas_mediano = 0, totalMedidas = 0, totalCumplidas = 0, porcientoCorto = 0, porcientoMedio = 0.00, porcientoLargo = 0.00, porcientoTotal = 0.00;
            // data.rows.forEach(element => {
            //     // if(element.porcientoCorto=="NaN") element.porcientoCorto=0
            //     // if(element.porcientoMedio=="NaN") element.porcientoMedio=0
            //     // if(element.porcientoLargo=="NaN") element.porcientoLargo=0
            //     // if(element.porcientoTotal=="NaN") element.porcientoTotal=0
            //     cumplidas_corto += element.cumplidas_corto
            //     cumplidas_largo += element.cumplidas_largo
            //     cumplidas_mediano += element.cumplidas_mediano
            //     medidas_corto += element.medidas_corto
            //     medidas_mediano += element.medidas_mediano
            //     medidas_largo += element.medidas_largo
            //     totalMedidas += element.totalMedidas
            //     totalCumplidas += element.totalCumplidas
            //     porcientoCorto = ((cumplidas_corto / medidas_corto) * 100).toFixed(2)
            //     porcientoMedio = ((cumplidas_mediano / medidas_mediano) * 100).toFixed(2)
            //     porcientoLargo = ((cumplidas_largo / medidas_largo) * 100).toFixed(2)
            //     porcientoTotal = ((totalCumplidas / totalMedidas) * 100).toFixed(2)
            // });
        })
        .catch(function (error) {
            console.log(error);
        });

    await api
        .get(`/actacontrols?populate[entidad][populate][0]=organismo&populate[entidad][populate][1]=osde&filters[fechavisita][$containsi]=${data.fecha_cliente}`, {
            headers: {
                Authorization: "Bearer " + auth.jwt,
            },
        })
        .then(function (response) {
            //console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                //Unidad de Camiones # 1
                if (response.data.data[i].attributes.entidad.data != null) {
                    if (data.opcion == 'Entidad' && response.data.data[i].attributes.entidad.data.attributes.entidad == modelEntidad.value) {
                        if (response.data.data[i].attributes.entidad.data.attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                        data.rows1.push({
                            porcientoCorto: (response.data.data[i].attributes.cumplidas_corto / response.data.data[i].attributes.medidas_corto) * 100,
                            year: data.fecha_cliente,
                            porcientoMedio: (response.data.data[i].attributes.cumplidas_mediano / response.data.data[i].attributes.medidas_mediano) * 100,
                            porcientoLargo: (response.data.data[i].attributes.cumplidas_largo / response.data.data[i].attributes.medidas_largo) * 100,
                            porcientoTotal: ((response.data.data[i].attributes.cumplidas_largo + response.data.data[i].attributes.cumplidas_corto + response.data.data[i].attributes.cumplidas_mediano) / (response.data.data[i].attributes.medidas_corto + response.data.data[i].attributes.medidas_largo + response.data.data[i].attributes.medidas_mediano)) * 100,
                            porcientoCorto: ((response.data.data[i].attributes.cumplidas_corto / response.data.data[i].attributes.medidas_corto) * 100).toFixed(2),
                            entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                        });
                        data.histogramOptions.year1.push(data.rows1)
                    } else if (data.opcion == 'OACE' && response.data.data[i].attributes.entidad.data.attributes.organismo.data.length > 0 && response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo == modelOrganismo.value) {
                        if (response.data.data[i].attributes.entidad.data.attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                        data.rows1.push({
                            year: data.fecha_cliente,
                            porcientoMedio: (response.data.data[i].attributes.cumplidas_mediano / response.data.data[i].attributes.medidas_mediano) * 100,
                            porcientoLargo: (response.data.data[i].attributes.cumplidas_largo / response.data.data[i].attributes.medidas_largo) * 100,
                            porcientoTotal: ((response.data.data[i].attributes.cumplidas_largo + response.data.data[i].attributes.cumplidas_corto + response.data.data[i].attributes.cumplidas_mediano) / (response.data.data[i].attributes.medidas_corto + response.data.data[i].attributes.medidas_largo + response.data.data[i].attributes.medidas_mediano)) * 100,
                            porcientoCorto: ((response.data.data[i].attributes.cumplidas_corto / response.data.data[i].attributes.medidas_corto) * 100).toFixed(2),
                            entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                        });
                        data.histogramOptions.year1.push(data.rows1)
                    } else if (data.opcion == 'OSDE' && response.data.data[i].attributes.entidad.data.attributes.osde.data != null && response.data.data[i].attributes.entidad.data.attributes.osde.data.attributes.nombre == modelOsde.value) {
                        if (response.data.data[i].attributes.entidad.data.attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                        data.rows1.push({
                            year: data.fecha_cliente,
                            porcientoMedio: (response.data.data[i].attributes.cumplidas_mediano / response.data.data[i].attributes.medidas_mediano) * 100,
                            porcientoLargo: (response.data.data[i].attributes.cumplidas_largo / response.data.data[i].attributes.medidas_largo) * 100,
                            porcientoTotal: ((response.data.data[i].attributes.cumplidas_largo + response.data.data[i].attributes.cumplidas_corto + response.data.data[i].attributes.cumplidas_mediano) / (response.data.data[i].attributes.medidas_corto + response.data.data[i].attributes.medidas_largo + response.data.data[i].attributes.medidas_mediano)) * 100,
                            porcientoCorto: ((response.data.data[i].attributes.cumplidas_corto / response.data.data[i].attributes.medidas_corto) * 100).toFixed(2),
                            entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                        });
                        data.histogramOptions.year1.push(data.rows1)
                    }
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}

</script>

<style lang="sass" scoped>
.banner
  max-width: 500px
  max-height: 100px
</style>