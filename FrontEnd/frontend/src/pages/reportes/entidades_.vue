<template>
    <div class="col-12">
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Entidades" dense :rows="data.rows"
                    :columns="data.columns" row-key="name" v-model:pagination="pagination" >
                    <template v-slot:top>
                        <div style="width: 100%" class="row justify-between">
                            <div class="col-3 text-h6">Entidades</div>
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
    },
    // {
    //     name: "referencia",
    //     align: "center",
    //     label: "Referencia",
    //     field: "referencia",
    //     sortable: true,
    // }
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
    rows: [],
    fecha_actual: new Date(),
    columns: [],
    entidades: []
});

onMounted(() => {
    getYear()
});

function getYear(params) {
    data.fecha_actual = data.fecha_actual.getFullYear()
}

function cerradas(params) {
    data.rows = [];
    data.columns = columnsECerradas
    let count = 1
    for (let index = 1; index < 3; index++) {
        api
            .get(`/entidads?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100&filters[activo][$eq]=c`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
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

async function historial(params) {
    console.log("-".match(/\d+/g));

    data.rows = [];
    data.columns = columnsHistorial
    let count = 1
    for (let index = 1; index < 3; index++) {
        api
            .get(`/entidads?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100&filters[activo][$eq]=s`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
            .then(function (response) {
                //console.log(response);
                for (let i = 0; i < response.data.data.length; i++) {
                    if (response.data.data[i].attributes.organismo.data.length == 0) response.data.data[i].attributes.organismo.data.push({ attributes: { organismo: "-" } })
                    if (response.data.data[i].attributes.municipio.data.length == 0) response.data.data[i].attributes.municipio.data.push({ attributes: { municipio: "-" } })
                    if (response.data.data[i].attributes.salida.data == null) response.data.data[i].attributes.salida.data = { attributes: { salida: "-" } }
                    if (response.data.data[i].attributes.prioridad.data == null) response.data.data[i].attributes.prioridad.data = { attributes: { prioridad: "-" } }
                    if (response.data.data[i].attributes.osde.data == null) response.data.data[i].attributes.osde.data = { attributes: { nombre: "-" } }
                    let temp = []
                    let nombresAnteriores = ""
                    if (response.data.data[i].attributes.referencia != null && response.data.data[i].attributes.referencia != "-") { temp = (response.data.data[i].attributes.referencia).match(/\d+/g) }

                    data.rows.push({
                        name: count,
                        id: response.data.data[i].id,
                        nombreActual: response.data.data[i].attributes.entidad,
                        referencia: temp.join(","),
                        nombresAnterior: nombresAnteriores
                    });
                    count++
                }
                data.rows.forEach(element => {
                    //element.referencia.split(",");
                    console.log(element.referencia.split(",").length);
                    for (let index = 0; index < element.referencia.split(",").length; index++) {
                        api
                            .get(`/entidads/${element.referencia.split(",")[index]}`, {
                                headers: {
                                    Authorization: "Bearer " + auth.jwt,
                                },
                            }).then(function (response) {
                                // console.log(response);
                                if (index == 0) element.nombresAnterior = element.nombresAnterior.concat(response.data.data.attributes.entidad)
                                else element.nombresAnterior = element.nombresAnterior.concat(" , " + response.data.data.attributes.entidad)
                            }).catch(function (error) {
                                console.log(error);
                            });
                    }


                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

function entidadesActivas() {
    return new Promise(resolve => {
        let count = 1
        api
        .get(`/entidads?populate[0]=organismo&populate[1]=municipio&[activo][$eq]=s`, {
            headers: {
                Authorization: "Bearer " + auth.jwt,
            },
        }).then(function (response) {
            //console.log(response);
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
    data.rows = [];
    data.columns = columnsENoVisitadas
    
    let entidades = await entidadesActivas()
   
    let temp = []
    api
        .get(`/actacontrols?populate[0]=entidad&filters[fechavisita][$containsi]=${data.fecha_actual}`, {
            headers: {
                Authorization: "Bearer " + auth.jwt,
            },
        })
        .then(function (response) {
            console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                if (response.data.data[i].attributes.entidad.data != null) temp.push(response.data.data[i].attributes.entidad.data.attributes.entidad)
            }
            console.log(temp);
            for (let index = 0; index < temp.length; index++) {
                entidades.forEach((element, indexF) => {
                    console.log(element.entidad);
                    if (element.entidad == temp[index]) {
                        console.log("Entra");
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
    data.rows = [];
    data.columns = columnsEMinisterio
    let count = 1
    let organismo = ""
    api
        .get(`/entidads?populate[0]=organismo&populate[1]=municipio&filters[activo][$eq]=s&sort[0]=organismo.organismo%3Aasc`, {
            headers: {
                Authorization: "Bearer " + auth.jwt,
            },
        }).then(function (response) {
            //console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                if (response.data.data[i].attributes.organismo.data.length == 0) response.data.data[i].attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                if (response.data.data[i].attributes.municipio.data.length == 0) response.data.data[i].attributes.municipio.data[0] = { attributes: { municipio: "-" } }
                if (organismo !== response.data.data[i].attributes.organismo.data[0].attributes.organismo) {
                    count = 1
                    data.rows.push({
                        name: response.data.data[i].attributes.organismo.data[0].attributes.organismo,
                        id: "~~~~~~~~~~~~~~~~~~",
                        entidad: "~~~~~~~~~~~~~~~~~~",
                        organismo: "~~~~~~~~~~~~~~~~~~",
                        municipio: "~~~~~~~~~~~~~~~~~~",
                        director: "~~~~~~~~~~~~~~~~~~",
                        telefono: "~~~~~~~~~~~~~~~~~~",
                        coordinador: "~~~~~~~~~~~~~~~~~~",
                        tipo_fuente: "~~~~~~~~~~~~~~~~~~"
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
        }).catch(function (error) {
            console.log(error.response);
        });




}

</script>

