<template>
    <div>
        <div  class="text-center q-mt-xl" v-if="auth.printMode == true">
            <q-img src="~assets/Layout_/GTE-BH_print.png" class="banner" />
        </div>
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Plan de medidas" dense :rows="data.rows"
                    :columns="columns" row-key="name" v-model:selected="selected" v-model:pagination="pagination" wrap-cells :hide-bottom="auth.printMode">
                    <template v-slot:top>
                        <div style="width: 100%" class="row justify-center" v-if="auth.printMode == true">
                            <div class="col-4 text-h6">
                                <q-btn flat :label="data.titulo + data.fecha_actual" class="col-1  q-pa-xs"
                                    @click="auth.printMode = !auth.printMode" />
                            </div>
                        </div>
                        <div style="width: 100%" class="row justify-start" v-else>
                            <div class="col-4 text-h6" v-if="auth.jwt">
                                <q-btn flat label="Residuales por categorias" icon="print" class="col-1  q-pa-xs"
                                    @click="auth.printMode = !auth.printMode" />
                            </div>
                            <div class="col-4 text-h6" v-else>
                                <q-btn flat label="Residuales por categorias" class="col-1  q-pa-xs" />
                            </div>
                            <div class="col-2">
                                <q-select class="text-black q-pa-xs" dense outlined v-model="data.opcion"
                                    :options="data.opcions" label="Residuales por:" />
                            </div>
                            <div class="col-4" v-if="data.opcion == 'Categoria'">
                                <q-select class="text-black q-pa-xs" use-input input-debounce="0" dense outlined
                                    v-model="modelCategoria" :options="optionsCategoria" @filter="filterFnCategoria"
                                    label="Categoria" />
                            </div>
                            <div class="col-4" v-if="data.opcion == 'OACE y Categoria'">
                                <q-select class="text-black q-pa-xs" use-input input-debounce="0" dense outlined
                                    v-model="modelOrganismo" :options="optionsOrganismo" @filter="filterFnOrganismo"
                                    label="OACE" />
                                <q-select class="text-black q-pa-xs" use-input input-debounce="0" dense outlined
                                    v-model="modelCategoria" :options="optionsCategoria" @filter="filterFnCategoria"
                                    label="Categoria" />
                            </div>
                            <div class="col-4" v-if="data.opcion == 'OSDE y Categoria'">
                                <q-select class="text-black q-pa-xs" use-input input-debounce="0" dense outlined
                                    v-model="modelOsde" :options="optionsOsde" @filter="filterFnOsde" label="OSDE" />
                                <q-select class="text-black q-pa-xs" use-input input-debounce="0" dense outlined
                                    v-model="modelCategoria" :options="optionsCategoria" @filter="filterFnCategoria"
                                    label="Categoria" />
                            </div>
                            <div class="col-3">
                                <div class="row justify-center">
                                    <q-input outlined dense v-model="data.fecha_actual" type="number" label="Año"
                                        class="col-6 text-black q-pa-xs" />
                                    <q-btn flat round color="secondary" icon="search" class="col-2 text-black q-pa-xs"
                                        @click="getActacontrol()" />
                                </div>
                            </div>
                        </div>
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
        name: "organismo",
        align: "center",
        label: "Organismo",
        field: "organismo",
        sortable: true,
    },
    {
        name: "categoria",
        align: "center",
        label: "Categoria",
        field: "categoria",
        sortable: true,
    },
    {
        name: "tipo_residual",
        align: "center",
        label: "Tipo de residual",
        field: "tipo_residual",
        sortable: true,
    },
    {
        name: "cantidadGenerada",
        align: "center",
        label: "Cantidad Generada",
        field: "cantidadGenerada",
        sortable: true,
    },
    {
        name: "unidad_medida",
        align: "center",
        label: "U/M",
        field: "unidad_medida",
        sortable: true,
    },
    {
        name: "disposicion",
        align: "center",
        label: "Disposicion",
        field: "disposicion",
        sortable: true,
    },
    {
        name: "aprovechamiento",
        align: "center",
        label: "Aprovechamiento",
        field: "aprovechamiento",
        sortable: true,
    },
    {
        name: "fecha",
        align: "center",
        label: "Fecha",
        field: "fecha",
        sortable: true,
    }
];

const stringOptionsOrganismo = []
const modelOrganismo = ref([])
const optionsOrganismo = ref(stringOptionsOrganismo)

const stringOptionsCategoria = []
const modelCategoria = ref([])
const optionsCategoria = ref(stringOptionsCategoria)

const stringOptionsOsde = []
const modelOsde = ref([])
const optionsOsde = ref(stringOptionsOsde)

let data = reactive({
    titulo:"Residuales por categorias ",
    rows: [],
    opcion: "",
    opcions: ["Categoria", "OACE y Categoria", "OSDE y Categoria"],

    categorias: [],
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

function filterFnCategoria(val, update) {
    if (val === '') {
        update(() => {
            optionsCategoria.value = stringOptionsCategoria

            // here you have access to "ref" which
            // is the Vue reference of the QSelect
        })
        return
    }

    update(() => {
        const needle = val.toLowerCase()
        optionsCategoria.value = stringOptionsCategoria.filter(v => v.toLowerCase().indexOf(needle) > -1)
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
        getCategoria(),
        getOrganismos(),
        getOSDE()
        console.log(auth.printMode);
});

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
                console.log(error.response);
            });
    }
}

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
                console.log(error.response);
            });
    }
}

function getCategoria(params) {
    api
        .get(`/categorias`).then(function (response) {
            //console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                data.categorias.push({
                    categoria: response.data.data[i].attributes.categoria,
                    id: response.data.data[i].id
                }
                )
            }
            data.categorias.forEach(element => {
                stringOptionsCategoria.push(element.categoria)
            });
        }).catch(function (error) {
            console.log(error.response);
        });
}

async function getActacontrol(params) {
    data.rows = [];
    let count = 1
    await api
        .get(`/actacontrols?populate[0]=entidad.organismo&populate[1]=residuals.categorias&populate[2]=entidad.osde&filters[fechavisita][$containsi]=${data.fecha_actual}`)
        .then(function (response) {
            console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                if (response.data.data[i].attributes.entidad.data != null) {
                    if (data.opcion == 'Categoria' && response.data.data[i].attributes.residuals.data.length > 0) {
                        for (let index = 0; index < response.data.data[i].attributes.residuals.data.length; index++) {
                            if (response.data.data[i].attributes.residuals.data[index].attributes.categorias.data.length > 0 && response.data.data[i].attributes.residuals.data[index].attributes.categorias.data[0].attributes.categoria == modelCategoria.value) {

                                if (response.data.data[i].attributes.entidad.data.attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                                console.log(response.data.data[i].id);
                                data.rows.push({
                                    name: count,
                                    id: response.data.data[i].id,
                                    cantidadGenerada: response.data.data[i].attributes.residuals.data[index].attributes.cantidad,
                                    unidad_medida: response.data.data[i].attributes.residuals.data[index].attributes.disposicion,
                                    disposicion: response.data.data[i].attributes.residuals.data[index].attributes.disposicion,
                                    aprovechamiento: response.data.data[i].attributes.residuals.data[index].attributes.aprovechamiento_cant,
                                    fecha: response.data.data[i].attributes.residuals.data[index].attributes.fecha_residual,
                                    tipo_residual: response.data.data[i].attributes.residuals.data[index].attributes.tipo_residual,
                                    categoria: response.data.data[i].attributes.residuals.data[index].attributes.categorias.data[0].attributes.categoria,
                                    entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                                    organismo: response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo
                                });
                                count++

                            }
                        }
                    } else if (data.opcion == 'OACE y Categoria' && response.data.data[i].attributes.entidad.data.attributes.organismo.data.length > 0 && response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo == modelOrganismo.value) {
                        console.log("Paso 1");
                        for (let index = 0; index < response.data.data[i].attributes.residuals.data.length; index++) {
                            console.log("Paso 2");
                            if (response.data.data[i].attributes.residuals.data[index].attributes.categorias.data.length > 0 && response.data.data[i].attributes.residuals.data[index].attributes.categorias.data[0].attributes.categoria == modelCategoria.value) {
                                console.log("Paso 3");
                                if (response.data.data[i].attributes.entidad.data.attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                                data.rows.push({
                                    name: count,
                                    id: response.data.data[i].id,
                                    cantidadGenerada: response.data.data[i].attributes.residuals.data[index].attributes.cantidad,
                                    unidad_medida: response.data.data[i].attributes.residuals.data[index].attributes.disposicion,
                                    disposicion: response.data.data[i].attributes.residuals.data[index].attributes.disposicion,
                                    aprovechamiento: response.data.data[i].attributes.residuals.data[index].attributes.aprovechamiento_cant,
                                    fecha: response.data.data[i].attributes.residuals.data[index].attributes.fecha_residual,
                                    tipo_residual: response.data.data[i].attributes.residuals.data[index].attributes.tipo_residual,
                                    categoria: response.data.data[i].attributes.residuals.data[index].attributes.categorias.data[0].attributes.categoria,
                                    entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                                    organismo: response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo
                                });
                                count++
                            }

                        }
                    } else if (data.opcion == 'OSDE y Categoria' && response.data.data[i].attributes.entidad.data.attributes.osde.data != null && response.data.data[i].attributes.entidad.data.attributes.osde.data.attributes.nombre == modelOsde.value) {
                        console.log("paso 1");
                        for (let index = 0; index < response.data.data[i].attributes.residuals.data.length; index++) {
                            console.log("paso 2");
                            if (response.data.data[i].attributes.residuals.data[index].attributes.categorias.data.length > 0 && response.data.data[i].attributes.residuals.data[index].attributes.categorias.data[0].attributes.categoria == modelCategoria.value) {
                                console.log("paso 3");
                                if (response.data.data[i].attributes.entidad.data.attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                                console.log("paso 4");
                                data.rows.push({
                                    name: count,
                                    id: response.data.data[i].id,
                                    cantidadGenerada: response.data.data[i].attributes.residuals.data[index].attributes.cantidad,
                                    unidad_medida: response.data.data[i].attributes.residuals.data[index].attributes.disposicion,
                                    disposicion: response.data.data[i].attributes.residuals.data[index].attributes.disposicion,
                                    aprovechamiento: response.data.data[i].attributes.residuals.data[index].attributes.aprovechamiento_cant,
                                    fecha: response.data.data[i].attributes.residuals.data[index].attributes.fecha_residual,
                                    tipo_residual: response.data.data[i].attributes.residuals.data[index].attributes.tipo_residual,
                                    categoria: response.data.data[i].attributes.residuals.data[index].attributes.categorias.data[0].attributes.categoria,
                                    entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                                    organismo: response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo
                                });
                                count++
                            }

                        }
                    }
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}

</script>

