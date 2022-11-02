<template>
    <div>
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Plan de medidas" dense :rows="data.rows"
                    :columns="columns" row-key="name" v-model:pagination="pagination">
                    <template v-slot:top>
                        <div style="width: 100%" class="row justify-between">
                            <div class="col-3 text-h6">Sistema de tratamiento</div>
                            <div class="col-4">
                                <q-select class="text-black q-pa-xs" use-input input-debounce="0" dense outlined
                                    v-model="modelOrganismo" :options="optionsOrganismo" @filter="filterFnOrganismo"
                                    label="Organismo" />
                            </div>
                            <div class="col-3">
                                <div class="row justify-center">
                                    <q-input outlined dense v-model="data.fecha_actual" type="number" label="Año"
                                        class="col-4 text-black q-pa-xs" />
                                    <q-toggle :label="data.tratamiento" color="secondary" false-value="No"
                                        true-value="Si" v-model="data.tratamiento" />
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
        field: (row) => row.entidad,
        format: (val) => `${val}`,
        field: "entidad",
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
        name: "sistema",
        align: "center",
        label: "Sistema de tratamiento",
        field: "sistema",
        sortable: true,
    }
];

const stringOptionsOrganismo = []
const modelOrganismo = ref(["MINAL"])
const optionsOrganismo = ref(stringOptionsOrganismo)

let data = reactive({
    rows: [],
    organismos: [],
    tratamiento: "No",
    fecha_actual: new Date(),
    entidades: []

});

onMounted(() => {
    getYear(),
        getOrganismos(),
        getActacontrol()
});

function getYear(params) {
    data.fecha_actual = data.fecha_actual.getFullYear()
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
        .get(`/actacontrols?populate[entidad][populate][0]=organismo&filters[fechavisita][$containsi]=${data.fecha_actual}`, {
            headers: {
                Authorization: "Bearer " + auth.jwt,
            },
        })
        .then(function (response) {
            //console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                if (response.data.data[i].attributes.entidad.data != null) {
                    if (response.data.data[i].attributes.entidad.data.attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                    data.rows.push({
                        name:count,
                        sistema: "No",
                        entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                    });
                    count++
                }
            }
            getSistema()
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
                console.log(response);
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

async function getSistema(params) {
    // data.rows = [];
    //getActacontrol()
    let count = 1
    for (let index = 1; index < 10; index++) {
        //populate[0]=actacontrol.entidad&
        //&sort[0]=anno%3Adesc&filters[anno][$containsi]=${data.fecha_actual}
        await api
            .get(`/sis-tratamientos?populate[0]=actacontrol.entidad.organismo&pagination[page]=${index}&pagination[pageSize]=100&filters[actacontrol][fechavisita][$containsi]=${data.fecha_actual}`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
            .then(function (response) {
                console.log(response);
                for (let i = 0; i < response.data.data.length; i++) {
                    if (response.data.data[i].attributes.actacontrol.data.attributes.entidad.data != null) {
                        if (response.data.data[i].attributes.actacontrol.data.attributes.entidad.data.attributes.organismo.data.length > 0 && response.data.data[i].attributes.actacontrol.data.attributes.entidad.data.attributes.organismo.data[0].attributes.organismo == modelOrganismo.value) {
                            data.rows.forEach(element => {
                                if(element.entidad==response.data.data[i].attributes.actacontrol.data.attributes.entidad.data.attributes.entidad){
                                    element.sistema="Si"
                                }
                            });
                        }
                    }
                    
                }
                if(data.tratamiento=="Si"){
                    for (let index = 0; index < data.rows.length; index++) {
                        if(data.rows[index].sistema=="No") data.rows.splice(index,1)
                    }
                }else{
                    for (let index = 0; index < data.rows.length; index++) {
                        if(data.rows[index].sistema=="Si") data.rows.splice(index,1)
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

</script>

