<template>
    <div>
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Plan de medidas" dense :rows="data.rows"
                    :columns="columns" row-key="name" :selected-rows-label="getSelectedString"
                    v-model:selected="selected" v-model:pagination="pagination">
                    <template v-slot:top>
                        <div style="width: 100%" class="row justify-start">
                            <div class="col-3 text-h6">Residuales</div>
                            <div class="col-2">
                                <q-select class="text-black q-pa-xs" dense outlined v-model="data.opcion"
                                    :options="data.opcions" label="Residuales por:" />
                            </div>
                            <div class="col-4" v-if="data.opcion=='Categoria'">
                                <q-select class="text-black q-pa-xs" use-input input-debounce="0" dense outlined
                                    v-model="modelCategoria" :options="optionsCategoria" @filter="filterFnCategoria"
                                    label="Categoria" />
                            </div>
                            <div class="col-4" v-if="data.opcion=='Ministerio y Categoria'">
                                <q-select class="text-black q-pa-xs" use-input input-debounce="0" dense outlined
                                    v-model="modelOrganismo" :options="optionsOrganismo" @filter="filterFnOrganismo"
                                    label="Minsiterio" />
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
        label: "Categoria",
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

let data = reactive({
    rows: [],
    opcion: "",
    opcions: ["Categoria", "Ministerio y Categoria"],

    categorias: [],
    organismos: [],

    fecha_actual: new Date(),

});

function getYear(params) {
    data.fecha_actual = data.fecha_actual.getFullYear()
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
        getOrganismos()
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

function getCategoria(params) {
    api
        .get(`/categorias`, {
            headers: {
                Authorization: "Bearer " + auth.jwt,
            },
        }).then(function (response) {
            console.log(response);
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
        .get(`/actacontrols?populate[0]=entidad.organismo&populate[1]=residuals.categorias&filters[fechavisita][$containsi]=${data.fecha_actual}`, {
            headers: {
                Authorization: "Bearer " + auth.jwt,
            },
        })
        .then(function (response) {
            console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                if (response.data.data[i].attributes.entidad.data != null) {
                    if (data.opcion == 'Categoria' && response.data.data[i].attributes.residuals.data.length > 0 && response.data.data[i].attributes.residuals.data[0].attributes.categorias.data.length > 0 && response.data.data[i].attributes.residuals.data[0].attributes.categorias.data[0].attributes.categoria == modelCategoria.value) {
                        if (response.data.data[i].attributes.entidad.data.attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                        data.rows.push({
                            name: count,
                            id: response.data.data[i].id,
                            cantidadGenerada: response.data.data[i].attributes.residuals.data[0].attributes.cantidad,
                            unidad_medida: response.data.data[i].attributes.residuals.data[0].attributes.disposicion,
                            disposicion: response.data.data[i].attributes.residuals.data[0].attributes.disposicion,
                            aprovechamiento: response.data.data[i].attributes.residuals.data[0].attributes.aprovechamiento_cant,
                            fecha: response.data.data[i].attributes.residuals.data[0].attributes.fecha_residual,
                            tipo_residual: response.data.data[i].attributes.residuals.data[0].attributes.tipo_residual,
                            categoria: response.data.data[i].attributes.residuals.data[0].attributes.categorias.data[0].attributes.categoria,
                            entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                            organismo: response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo
                        });
                        count++
                    } else if (data.opcion == 'Ministerio y Categoria'&& response.data.data[i].attributes.entidad.data.attributes.organismo.data.length > 0 && response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo == modelOrganismo.value && response.data.data[i].attributes.residuals.data.length > 0 && response.data.data[i].attributes.residuals.data[0].attributes.categorias.data.length > 0 && response.data.data[i].attributes.residuals.data[0].attributes.categorias.data[0].attributes.categoria == modelCategoria.value) {
                        if (response.data.data[i].attributes.entidad.data.attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data.attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                        data.rows.push({
                            name: count,
                            id: response.data.data[i].id,
                            cantidadGenerada: response.data.data[i].attributes.residuals.data[0].attributes.cantidad,
                            unidad_medida: response.data.data[i].attributes.residuals.data[0].attributes.disposicion,
                            disposicion: response.data.data[i].attributes.residuals.data[0].attributes.disposicion,
                            aprovechamiento: response.data.data[i].attributes.residuals.data[0].attributes.aprovechamiento_cant,
                            fecha: response.data.data[i].attributes.residuals.data[0].attributes.fecha_residual,
                            tipo_residual: response.data.data[i].attributes.residuals.data[0].attributes.tipo_residual,
                            categoria: response.data.data[i].attributes.residuals.data[0].attributes.categorias.data[0].attributes.categoria,
                            entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                            organismo: response.data.data[i].attributes.entidad.data.attributes.organismo.data[0].attributes.organismo
                        });
                        count++
                    }
                }
            }
            let cantidadGenerada = 0
            data.rows.forEach(element => {
                cantidadGenerada += element.cantidadGenerada
            });
            data.rows.push({
                name: "Total",
                cantidadGenerada: cantidadGenerada,
                unidad_medida: "",
                disposicion: "",
                aprovechamiento: "",
                fecha: "",
                tipo_residual: "",
                categoria: "",
                entidad: "",
                organismo: ""
            });
        })
        .catch(function (error) {
            console.log(error);
        });

}

</script>

