<template>
    <div class="col-12">
        <div class="text-center q-mt-xl" v-if="auth.printMode == true">
            <q-img src="~assets/Layout_/GTE-BH_print.png" class="banner" />
        </div>
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Entidades" dense :rows="data.rows"
                    :columns="data.columns" row-key="name" v-model:pagination="pagination" wrap-cells :hide-bottom="auth.printMode">
                    <template v-slot:top>
                        <div style="width: 100%" class="row justify-center" v-if="auth.printMode == true">
                            <div class="col-3 text-h6">
                                <q-btn flat :label="data.titulo + data.fecha_actual" class="col-1  q-pa-xs"
                                    @click="auth.printMode = !auth.printMode" />
                            </div>
                        </div>
                        <div style="width: 100%" class="row justify-between" v-else>
                            <div class="col-3 text-h6" v-if="auth.jwt">
                                <q-btn flat label="Entidades" icon="print" class="col-1  q-pa-xs"
                                    @click="auth.printMode = !auth.printMode" v-if="data.titulo=='' ? disable:!disable"/>
                            </div>
                            <div class="col-3 text-h6" v-else>
                                <q-btn flat label="Entidades" class="col-1  q-pa-xs" />
                            </div>
                            <div class="col-9">
                                <div class="row justify-start">
                                    <q-btn no-caps class="q-ma-xs text-white bg-secondary" dense
                                        @click="historial">Historial de Entidades</q-btn>
                                    <q-btn no-caps class="q-ma-xs text-white bg-secondary" @click="cerradas">
                                        Entidades Cerradas</q-btn>
                                    <q-btn no-caps class="q-ma-xs text-white bg-secondary" @click="noVisitadas">
                                        Entidades no Visitadas</q-btn>
                                    <q-btn no-caps class="q-ma-xs text-white bg-secondary" @click="ministerio">
                                        Entidades por Ministerio</q-btn>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-slot:body-cell="props">
                        <q-td :props="props"
                            :class="(props.row.entidad == '') ? 'bg-primary text-black' : 'bg-white text-black'">{{
        props.value
}}
                        </q-td>
                    </template>
                    <template v-slot:body="props" v-if="data.cellProps">
                        <q-tr :props="props">
                            <q-td key="name" :props="props">
                                {{ props.row.name }}
                            </q-td>
                            <q-td key="nombreActual" :props="props">
                                    {{ props.row.nombreActual }}
                            </q-td>
                            <q-td key="nombresAnterior" :props="props"  :class="(props.row.nombresAnterior == '') ? 'bg-primary text-black' : 'bg-white text-black'">
                                    {{ props.row.nombresAnterior }}
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

const columnsHistorial = [
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
        name: "nombreActual",
        align: "center",
        required: true,
        label: "Nombre Actual",
        field: "nombreActual",
        sortable: true,
    },
    {
        name: "nombresAnterior",
        align: "center",
        label: "Nombres Anteriores",
        field: "nombresAnterior",
        sortable: true,
    }
];

const columnsECerradas = [
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
        name: "nombre",
        align: "center",
        required: true,
        label: "Nombre",
        field: "nombre",
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
        name: "municipio",
        align: "center",
        label: "Municipio",
        field: "municipio",
        sortable: true,
    }
];

const columnsENoVisitadas = [
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
        name: "municipio",
        align: "center",
        label: "Municipio",
        field: "municipio",
        sortable: true,
    },
    {
        name: "director",
        align: "center",
        label: "Director",
        field: "director",
        sortable: true,
    },
    {
        name: "telefono",
        align: "center",
        label: "Telefono",
        field: "telefono",
        sortable: true,
    },
    {
        name: "coordinador",
        align: "center",
        label: "Coordinador",
        field: "coordinador",
        sortable: true,
    }
];

const columnsEMinisterio = [
    {
        name: "name",
        align: "center",
        required: true,
        label: "No",
        field: (row) => row.name,
        format: (val) => `${val}`,
        field: "name",
        sortable: false,
    },
    {
        name: "entidad",
        align: "center",
        required: true,
        label: "Entidad",
        field: "entidad",
        sortable: false,
    },
    {
        name: "organismo",
        align: "center",
        label: "Organismo",
        field: "organismo",
        sortable: false,
    },
    {
        name: "municipio",
        align: "center",
        label: "Municipio",
        field: "municipio",
        sortable: false,
    },
    {
        name: "director",
        align: "center",
        label: "Director",
        field: "director",
        sortable: false,
    },
    {
        name: "telefono",
        align: "center",
        label: "Telefono",
        field: "telefono",
        sortable: false,
    },
    {
        name: "coordinador",
        align: "center",
        label: "Coordinador",
        field: "coordinador",
        sortable: false,
    },
    {
        name: "tipo_fuente",
        align: "center",
        label: "Tipo de Fuente",
        field: "tipo_fuente",
        sortable: false,
    }
];

let data = reactive({
    titulo: "",
    rows: [],
    fecha_actual: new Date(),
    columns: [],
    entidades: [],
    cellProps:false
});

onMounted(() => {
    getYear()
});

function getYear(params) {
    data.fecha_actual = data.fecha_actual.getFullYear()
}

function cerradas(params) {
    data.titulo="Entidades cerradas "
    data.cellProps=false
    data.rows = [];
    data.columns = columnsECerradas
    let count = 1
    for (let index = 1; index < 3; index++) {
        api
            .get(`/entidads?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100&filters[activo][$eq]=c`)
            .then(function (response) {
                //console.log(response);
                for (let i = 0; i < response.data.data.length; i++) {
                    if (response.data.data[i].attributes.organismo.data.length == 0) response.data.data[i].attributes.organismo.data.push({ attributes: { organismo: "-" } })
                    if (response.data.data[i].attributes.municipio.data.length == 0) response.data.data[i].attributes.municipio.data.push({ attributes: { municipio: "-" } })
                    if (response.data.data[i].attributes.salida.data == null) response.data.data[i].attributes.salida.data = { attributes: { salida: "-" } }
                    if (response.data.data[i].attributes.prioridad.data == null) response.data.data[i].attributes.prioridad.data = { attributes: { prioridad: "-" } }
                    if (response.data.data[i].attributes.osde.data == null) response.data.data[i].attributes.osde.data = { attributes: { nombre: "-" } }
                    data.rows.push({
                        name: count,
                        id: response.data.data[i].id,
                        nombre: response.data.data[i].attributes.entidad,
                        organismo: response.data.data[i].attributes.organismo.data[0].attributes.organismo,
                        municipio: response.data.data[i].attributes.municipio.data[0].attributes.municipio,
                    });
                    count++
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

function entidadesHistorial() {
    return new Promise(resolve => {
        let count = 1, cant = 1
        api
            .get(`/entidads?populate=%2A&filters[activo][$eq]=s`)
            .then(function (response) {
                // console.log(response);
                for (let i = 0; i < response.data.data.length; i++) {
                    if (response.data.data[i].attributes.organismo.data.length == 0) response.data.data[i].attributes.organismo.data.push({ attributes: { organismo: "-" } })
                    if (response.data.data[i].attributes.municipio.data.length == 0) response.data.data[i].attributes.municipio.data.push({ attributes: { municipio: "-" } })
                    if (response.data.data[i].attributes.salida.data == null) response.data.data[i].attributes.salida.data = { attributes: { salida: "-" } }
                    if (response.data.data[i].attributes.prioridad.data == null) response.data.data[i].attributes.prioridad.data = { attributes: { prioridad: "-" } }
                    if (response.data.data[i].attributes.osde.data == null) response.data.data[i].attributes.osde.data = { attributes: { nombre: "-" } }
                    let temp = []
                    let nombresAnteriores = ""
                    if (response.data.data[i].attributes.referencia != null && response.data.data[i].attributes.referencia != "-") {
                        temp = (response.data.data[i].attributes.referencia).match(/\d+/g)

                        for (let index = 0; index < temp.length; index++) {
                            if (index == 0) {
                                data.rows.push({
                                    name: count,
                                    id: response.data.data[i].id,
                                    nombreActual: response.data.data[i].attributes.entidad,
                                    referencia: temp[index],
                                    nombresAnterior: nombresAnteriores
                                });
                                count++
                            }
                            else {
                                data.rows.push({
                                    name: "",
                                    id: "",
                                    nombreActual: "",
                                    referencia: temp[index],
                                    nombresAnterior: nombresAnteriores
                                });
                            }
                        }
                    } else {
                        data.rows.push({
                            name: count,
                            id: response.data.data[i].id,
                            nombreActual: response.data.data[i].attributes.entidad,
                            referencia: "",
                            nombresAnterior: nombresAnteriores
                        });
                        count++
                    }

                }
                resolve(data.rows)
            })
            .catch(function (error) {
                console.log(error);
            });

    })
}

async function historial(params) {
    data.titulo="Historial de entidades "
    data.cellProps=true
    data.rows = [];
    data.columns = columnsHistorial
    let count = 1

    let entidades = await entidadesHistorial()
    pagination.value.rowsPerPage = entidades.length

    entidades.forEach(element => {
        if (element.referencia != "") {
            for (let index = 0; index < element.referencia.split(",").length; index++) {
                api
                    .get(`/entidads/${element.referencia.split(",")[index]}`).then(function (response) {
                        // console.log(response);
                        if (element.nombresAnterior == "") element.nombresAnterior = element.nombresAnterior.concat(response.data.data.attributes.entidad)
                        else element.nombresAnterior = element.nombresAnterior.concat(", " + response.data.data.attributes.entidad)
                    }).catch(function (error) {
                        console.log(error);
                    });
            }
        }
    });
}

function entidadesActivas() {
    return new Promise(resolve => {
        let count = 1
        api
            .get(`/entidads?filters[activo][$eq]=s&populate[0]=organismo&populate[1]=municipio`).then(function (response) {
                // console.log(response);
                for (let i = 0; i < response.data.data.length; i++) {
                    if (response.data.data[i].attributes.organismo.data.length == 0) response.data.data[i].attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                    if (response.data.data[i].attributes.municipio.data.length == 0) response.data.data[i].attributes.municipio.data[0] = { attributes: { municipio: "-" } }
                    data.rows.push({
                        name: count,
                        id: response.data.data[i].id,
                        entidad: response.data.data[i].attributes.entidad,
                        organismo: response.data.data[i].attributes.organismo.data[0].attributes.organismo,
                        municipio: response.data.data[i].attributes.municipio.data[0].attributes.municipio,
                        director: response.data.data[i].attributes.nomb_director,
                        telefono: response.data.data[i].attributes.num_telefono,
                        coordinador: response.data.data[i].attributes.nomb_coordinador
                    })
                    count++
                }
                resolve(data.rows)

            }).catch(function (error) {
                console.log(error);
            });
    })
}

async function noVisitadas(params) {
    data.titulo="Entidades no visitadas "
    data.cellProps=false
    data.rows = [];
    data.columns = columnsENoVisitadas

    let entidades = await entidadesActivas()

    let temp = []
    api
        .get(`/actacontrols?populate[0]=entidad&filters[fechavisita][$containsi]=${data.fecha_actual}`)
        .then(function (response) {
            // console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                if (response.data.data[i].attributes.entidad.data != null) temp.push(response.data.data[i].attributes.entidad.data.attributes.entidad)
            }
            let unique = [...new Set(temp)]

            for (let index = 0; index < unique.length; index++) {
                entidades.forEach((element, indexF) => {
                    // console.log(element.entidad);
                    if (element.entidad == unique[index]) {
                        // console.log("Entra");
                        entidades.splice(indexF, 1)
                    }
                });
            }
            // console.log(temp);
        })
        .catch(function (error) {
            console.log(error);
        });



}

async function ministerio(params) {
    data.titulo="Entidades por ministerio "
    data.cellProps=false
    data.rows = [];
    data.columns = columnsEMinisterio
    let count = 1
    let organismo = ""
    api
        .get(`/entidads?populate[0]=organismo&populate[1]=municipio&filters[activo][$eq]=s&sort[0]=organismo.organismo%3Aasc`).then(function (response) {
            // console.log(response);

            for (let i = 0; i < response.data.data.length; i++) {
                if (response.data.data[i].attributes.organismo.data.length == 0) response.data.data[i].attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                if (response.data.data[i].attributes.municipio.data.length == 0) response.data.data[i].attributes.municipio.data[0] = { attributes: { municipio: "-" } }
                if (organismo !== response.data.data[i].attributes.organismo.data[0].attributes.organismo) {
                    count = 1
                    data.rows.push({
                        name: response.data.data[i].attributes.organismo.data[0].attributes.organismo,
                        id: "",
                        entidad: "",
                        organismo: "",
                        municipio: "",
                        director: "",
                        telefono: "",
                        coordinador: "",
                        tipo_fuente: ""
                    })
                    organismo = response.data.data[i].attributes.organismo.data[0].attributes.organismo
                    data.rows.push({
                        name: count,
                        id: response.data.data[i].id,
                        entidad: response.data.data[i].attributes.entidad,
                        organismo: response.data.data[i].attributes.organismo.data[0].attributes.organismo,
                        municipio: response.data.data[i].attributes.municipio.data[0].attributes.municipio,
                        director: response.data.data[i].attributes.nomb_director,
                        telefono: response.data.data[i].attributes.num_telefono,
                        coordinador: response.data.data[i].attributes.nomb_coordinador,
                        tipo_fuente: response.data.data[i].attributes.tipo_fuente
                    })
                }
                else {
                    data.rows.push({
                        name: count,
                        id: response.data.data[i].id,
                        entidad: response.data.data[i].attributes.entidad,
                        organismo: response.data.data[i].attributes.organismo.data[0].attributes.organismo,
                        municipio: response.data.data[i].attributes.municipio.data[0].attributes.municipio,
                        director: response.data.data[i].attributes.nomb_director,
                        telefono: response.data.data[i].attributes.num_telefono,
                        coordinador: response.data.data[i].attributes.nomb_coordinador,
                        tipo_fuente: response.data.data[i].attributes.tipo_fuente
                    })
                }
                count++
            }
            pagination.value.rowsPerPage = data.rows.length
        }).catch(function (error) {
            console.log(error);
        });




}

</script>

