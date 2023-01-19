<template>
    <div class="col-12">
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Plan de medidas" dense :rows="data.rows"
                    :columns="columns" row-key="name" v-model:pagination="pagination">
                    <template v-slot:top>
                        <div style="width: 100%" class="row justify-between">
                            <div class="col-3 text-h6">Trampa de grasa</div>
                            <div class="col-2">
                                <q-select class="text-black q-pa-xs" dense outlined v-model="data.opcion"
                                    :options="data.opcions" label="Busqueda por:" />
                            </div>
                            <div class="col-4" v-if="data.opcion=='OACE'">
                                <q-select class="text-black q-pa-xs" use-input input-debounce="0" dense outlined
                                    v-model="modelOrganismo" :options="optionsOrganismo" @filter="filterFnOrganismo"
                                    label="OACE" />
                            </div>
                            <div class="col-4" v-if="data.opcion=='OSDE'">
                                <q-select class="text-black q-pa-xs" use-input input-debounce="0" dense outlined
                                    v-model="modelOsde" :options="optionsOsde" @filter="filterFnOsde"
                                    label="OSDE" />
                            </div>
                            <div class="col-4" v-if="data.opcion=='Prioridad'">
                                <q-select class="text-black q-pa-xs" use-input input-debounce="0" dense outlined
                                    v-model="modelPrioridad" :options="optionsPrioridad" @filter="filterFnPrioridad"
                                    label="Prioridad" />
                            </div>
                            <div class="col-3">
                                <div class="row justify-center">
                                    <q-input outlined dense v-model="data.fecha_actual" type="number" label="Año"
                                        class="col-4 text-black q-pa-xs" />
                                    <!-- <q-toggle :label="data.tratamiento" color="secondary" false-value="No"
                                        true-value="Si" v-model="data.tratamiento" /> -->
                                    <q-btn flat round color="secondary" icon="search" class="col-2 text-black q-pa-xs"
                                        @click="getActacontrol()" />
                                </div>
                            </div>
                        </div>
                    </template>
                </q-table>
            </q-card-section>
        </q-card>
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
        name: "name",
        align: "center",
        required: true,
        label: "No",
        field: (row) => row.name,
        format: (val) => `${val}`,
        field: "name",
        sortable: true,
    },
    {
        name: "entidad",
        align: "center",
        required: true,
        label: "Nombre de la entidad",
        field: "entidad",
        sortable: true,
    },
    {
        name: "organismo",
        align: "center",
        required: true,
        label: "Organismo",
        field: "organismo",
        sortable: true,
    },
    {
        name: "osde",
        align: "center",
        required: true,
        label: "Osde",
        field: "osde",
        sortable: true,
    },
    // {
    //     name: "anno",
    //     align: "center",
    //     label: "Año",
    //     field: "anno",
    //     sortable: true,
    // },
    {
        name: "trampa",
        align: "center",
        label: "Trampa de grasa",
        field: "trampa",
        sortable: true,
    }
];

const stringOptionsPrioridad = []
const modelPrioridad = ref([])
const optionsPrioridad = ref(stringOptionsPrioridad)

const stringOptionsOsde = []
const modelOsde = ref([])
const optionsOsde = ref(stringOptionsOsde)

const stringOptionsOrganismo = []
const modelOrganismo = ref([])
const optionsOrganismo = ref(stringOptionsOrganismo)

let data = reactive({
    rows: [],
    organismos: [],
    osdes:[],
    prioridads:[],
    tratamiento: "No",
    fecha_actual: new Date(),
    entidades: [],
    opcions:["OACE","OSDE","Prioridad"],
    opcion:""

});

onMounted(() => {
    getYear()
    getOrganismos()
    getOSDE()
    getPrioridad()
});

function getYear(params) {
    data.fecha_actual = data.fecha_actual.getFullYear()
}

function filterFnPrioridad(val, update) {
    if (val === '') {
        update(() => {
            optionsPrioridad.value = stringOptionsPrioridad

            // here you have access to "ref" which
            // is the Vue reference of the QSelect
        })
        return
    }

    update(() => {
        const needle = val.toLowerCase()
        optionsPrioridad.value = stringOptionsPrioridad.filter(v => v.toLowerCase().indexOf(needle) > -1)
    })
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


async function getActacontrol(params) {
    data.rows = [];
    let count = 1
    await api
        .get(`/actacontrols?populate[0]=trampa_grasa&populate[1]=entidad.organismo&populate[2]=entidad.osde&populate[3]=entidad.prioridad&filters[fechavisita][$containsi]=${data.fecha_actual}`, {
            headers: {
                Authorization: "Bearer " + auth.jwt,
            },
        })
        .then(function (response) {
            console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                let sistemaTemp="No"
                if(response.data.data[i].attributes.trampa_grasa.data!=null) sistemaTemp="Si"
                if (response.data.data[i].attributes.entidad.data != null) {
                    if (response.data.data[i].attributes.entidad.data.attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                    if(response.data.data[i].attributes.entidad.data.attributes.osde.data==null) response.data.data[i].attributes.entidad.data.attributes.osde.data ={attributes: { nombre: "-" }}
                    if(response.data.data[i].attributes.entidad.data.attributes.prioridad.data==null) response.data.data[i].attributes.entidad.data.attributes.prioridad.data ={attributes: { prioridad: "-" }}
                    if(data.opcion=="OACE" && response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo==modelOrganismo.value){
                        data.rows.push({
                            name:count,
                            trampa: sistemaTemp,
                            entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                            organismo: response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo,
                            osde: response.data.data[i].attributes.entidad.data.attributes.osde.data.attributes.nombre
                        });
                        count++
                    }
                    else if(data.opcion=="OSDE" && response.data.data[i].attributes.entidad.data.attributes.osde.data.attributes.nombre==modelOsde.value){
                        data.rows.push({
                            name:count,
                            trampa: sistemaTemp,
                            entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                            organismo: response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo,
                            osde: response.data.data[i].attributes.entidad.data.attributes.osde.data.attributes.nombre
                        });
                        count++
                    }
                    else if(data.opcion=="Prioridad" && response.data.data[i].attributes.entidad.data.attributes.prioridad.data.attributes.prioridad==modelPrioridad.value){
                        data.rows.push({
                            name:count,
                            trampa: sistemaTemp,
                            entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                            organismo: response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo,
                            osde: response.data.data[i].attributes.entidad.data.attributes.osde.data.attributes.nombre
                        });
                        count++
                    }
                    
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}

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

async function getPrioridad(params) {
    for (let index = 1; index < 2; index++) {
        await api
            .get(`/prioridads`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
            .then(function (response) {
                //console.log(response);
                for (let i = 0; i < response.data.data.length; i++) {
                    data.prioridads.push({
                        id: response.data.data[i].id,
                        prioridad: response.data.data[i].attributes.prioridad
                    });
                }
                data.prioridads.forEach(element => {
                    stringOptionsPrioridad.push(element.prioridad)
                });
            })
            .catch(function (error) {
                console.log(error.response);
            });
    }
}
</script>

