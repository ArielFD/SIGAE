<template>
    <div>
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Desempeño ambiental" dense :rows="data.rows"
                    :columns="columns" row-key="name" :selected-rows-label="getSelectedString" selection="multiple"
                    v-model:selected="selected" v-model:pagination="pagination" :filter="filter">
                    <template v-slot:top>
                        <div style="width: 100%" class="row justify-between">
                            <div class="col-3 text-h6">Desempeño ambiental</div>
                            <div class="col-3">
                                <div class="row justify-center">
                                    <q-input outlined dense v-model="data.fecha_actual" type="number" label="Año"
                                        class="col-3" />
                                    <q-btn flat round color="secondary" icon="search" class="col-1"
                                        @click="getDesempeño()" />
                                </div>
                            </div>
                            <div class="col" style="max-width: 300px">
                                <q-input dense debounce="400" color="primary" v-model="filter">
                                    <template v-slot:prepend>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>
                            </div>
                        </div>
                    </template>
                </q-table>
            </q-card-section>

            <q-card-actions class="justify-end">
                <q-btn no-caps class="text-white bg-secondary" @click="data.cardCreate = true">Insertar</q-btn>
                <q-dialog v-model="data.cardCreate">
                    <q-card class="my-card bg-primary" flat bordered>
                        <q-item>
                            <q-item-section>
                                <q-item-label><b>Nuevo: "Desempeño Ambiental" {{ data.tempEntidad }}</b></q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />

                        <q-card-section>
                            <div>
                                <div class="row">
                                    <q-select class="col-8 q-mr-xl text-black" use-input input-debounce="0" dense
                                        outlined v-model="model" :options="options" @filter="filterFn"
                                        label="Entidad" />
                                    <q-input outlined dense v-model="data.año" type="number" hint="Año" class="col-2" />
                                </div>
                                <div class="column items-start" v-if="data.rowsAnt.length > 0">
                                    <div class="row justify-between">
                                        <q-toggle class="col-6" v-model="data.coordinador" color="secondary"
                                            label="Existencia de coordinador" left-label :true-value="1"
                                            :false-value="0" />
                                        <q-toggle class="col-6" v-model="data.rowsAnt[0].coordinador" color="secondary"
                                            disable label="Ultimo registro" left-label :true-value="1"
                                            :false-value="0" />
                                    </div>
                                    <div class="row justify-between">
                                        <q-toggle class="col-6" v-model="data.diagnostico" color="secondary"
                                            label="Existencia de diagnostico" left-label :true-value="1"
                                            :false-value="0" />
                                        <q-toggle class="col-6" v-model="data.rowsAnt[0].diagnostico" color="secondary"
                                            disable label="Ultimo registro" left-label :true-value="1"
                                            :false-value="0" />
                                    </div>
                                    <div class="row justify-between">
                                        <q-toggle class="col-6" v-model="data.politica" color="secondary"
                                            label="Existencia de politica" left-label :true-value="1"
                                            :false-value="0" />
                                        <q-toggle class="col-6" v-model="data.rowsAnt[0].politica" color="secondary"
                                            disable label="Ultimo registro" left-label :true-value="1"
                                            :false-value="0" />
                                    </div>
                                    <div class="row justify-between">
                                        <q-toggle class="col-6" v-model="data.indicadores" color="secondary"
                                            label="Existencia de indicadores" left-label :true-value="1"
                                            :false-value="0" />
                                        <q-toggle class="col-6" v-model="data.rowsAnt[0].indicadores" color="secondary"
                                            disable label="Ultimo registro" left-label :true-value="1"
                                            :false-value="0" />
                                    </div>
                                    <div class="row justify-between">
                                        <q-toggle class="col-6" v-model="data.plan" color="secondary"
                                            label="Existencia de plan de accion" left-label :true-value="1"
                                            :false-value="0" />
                                        <q-toggle class="col-6" v-model="data.rowsAnt[0].plan" color="secondary" disable
                                            label="Ultimo registro" left-label :true-value="1" :false-value="0" />
                                    </div>
                                    <div class="row justify-between">
                                        <q-toggle class="col-6" v-model="data.legislacion" color="secondary"
                                            label="Existencia de legislacion" left-label :true-value="1"
                                            :false-value="0" />
                                        <q-toggle class="col-6" v-model="data.rowsAnt[0].legislacion" color="secondary"
                                            disable label="Ultimo registro" left-label :true-value="1"
                                            :false-value="0" />
                                    </div>
                                    <div class="row justify-between">
                                        <q-toggle class="col-6" v-model="data.capacitacion" color="secondary"
                                            label="Existencia de plan de capacitacion" left-label :true-value="1"
                                            :false-value="0" />
                                        <q-toggle class="col-6" v-model="data.rowsAnt[0].capacitacion" color="secondary"
                                            disable label="Ultimo registro" left-label :true-value="1"
                                            :false-value="0" />
                                    </div>
                                    <div class="row justify-between">
                                        <q-toggle class="col-6" v-model="data.acciones" color="secondary"
                                            label="Existencia de acciones PML" left-label :true-value="1"
                                            :false-value="0" />
                                        <q-toggle class="col-6" v-model="data.rowsAnt[0].acciones" color="secondary"
                                            disable label="Ultimo registro" left-label :true-value="1"
                                            :false-value="0" />
                                    </div>
                                    <div class="row justify-between">
                                        <q-toggle class="col-6" v-model="data.programa" color="secondary"
                                            label="Existencia de programa de gestion ambiental" left-label
                                            :true-value="1" :false-value="0" />
                                        <q-toggle class="col-6" v-model="data.rowsAnt[0].programa" color="secondary"
                                            disable label="Ultimo registro" left-label :true-value="1"
                                            :false-value="0" />
                                    </div>
                                    <div class="row justify-between">
                                        <q-toggle class="col-6" v-model="data.recurso" color="secondary"
                                            label="Existencia de recurso financiero" left-label :true-value="1"
                                            :false-value="0" />
                                        <q-toggle class="col-6" v-model="data.rowsAnt[0].recurso" color="secondary"
                                            disable label="Ultimo registro" left-label :true-value="1"
                                            :false-value="0" />
                                    </div>
                                    <div class="row justify-between">
                                        <q-toggle class="col-6" v-model="data.aprovechamiento" color="secondary"
                                            label="Aprovechamiento economico" left-label :true-value="1"
                                            :false-value="0" />
                                        <q-toggle class="col-6" v-model="data.rowsAnt[0].aprovechamiento"
                                            color="secondary" disable label="Ultimo registro" left-label :true-value="1"
                                            :false-value="0" />
                                    </div>
                                    <div class="row justify-between">
                                        <q-toggle class="col-6" v-model="data.sistema" color="secondary"
                                            label="Existencia de sistema de tratamiento" left-label :true-value="1"
                                            :false-value="0" />
                                        <q-toggle class="col-6" v-model="data.rowsAnt[0].sistema" color="secondary"
                                            disable label="Ultimo registro" left-label :true-value="1"
                                            :false-value="0" />
                                    </div>
                                    <div class="row justify-between">
                                        <q-toggle class="col-6" v-model="data.carga" color="secondary"
                                            label="Disminucion de carga contaminante" left-label :true-value="1"
                                            :false-value="0" />
                                        <q-toggle class="col-6" v-model="data.rowsAnt[0].carga" color="secondary"
                                            disable label="Ultimo registro" left-label :true-value="1"
                                            :false-value="0" />
                                    </div>
                                </div>
                                <div class="column items-start" v-else>
                                    <q-toggle v-model="data.coordinador" color="secondary"
                                        label="Existencia de coordinador" left-label :true-value="1" :false-value="0" />
                                    <q-toggle v-model="data.diagnostico" color="secondary"
                                        label="Existencia de diagnostico" left-label :true-value="1" :false-value="0" />
                                    <q-toggle v-model="data.politica" color="secondary" label="Existencia de politica"
                                        left-label :true-value="1" :false-value="0" />
                                    <q-toggle v-model="data.indicadores" color="secondary"
                                        label="Existencia de indicadores" left-label :true-value="1" :false-value="0" />
                                    <q-toggle v-model="data.plan" color="secondary" label="Existencia de plan de accion"
                                        left-label :true-value="1" :false-value="0" />
                                    <q-toggle v-model="data.legislacion" color="secondary"
                                        label="Existencia de legislacion" left-label :true-value="1" :false-value="0" />
                                    <q-toggle v-model="data.capacitacion" color="secondary"
                                        label="Existencia de plan de capacitacion" left-label :true-value="1"
                                        :false-value="0" />
                                    <q-toggle v-model="data.acciones" color="secondary"
                                        label="Existencia de acciones PML" left-label :true-value="1"
                                        :false-value="0" />
                                    <q-toggle v-model="data.programa" color="secondary"
                                        label="Existencia de programa de gestion ambiental" left-label :true-value="1"
                                        :false-value="0" />
                                    <q-toggle v-model="data.recurso" color="secondary"
                                        label="Existencia de recurso financiero" left-label :true-value="1"
                                        :false-value="0" />
                                    <q-toggle v-model="data.aprovechamiento" color="secondary"
                                        label="Aprovechamiento economico" left-label :true-value="1" :false-value="0" />
                                    <q-toggle v-model="data.sistema" color="secondary"
                                        label="Existencia de sistema de tratamiento" left-label :true-value="1"
                                        :false-value="0" />
                                    <q-toggle v-model="data.carga" color="secondary"
                                        label="Disminucion de carga contaminante" left-label :true-value="1"
                                        :false-value="0" />
                                </div>
                                <q-input outlined dense v-model="data.observaciones" type="textarea"
                                    label="Observaciones" class="q-pa-xs" />
                            </div>
                        </q-card-section>

                        <q-separator dark />

                        <q-card-actions class="justify-end">
                            <q-btn no-caps class="text-white bg-secondary" @click="Create">Agregar</q-btn>
                            <q-btn no-caps class="text-white bg-secondary">Limpiar Campos</q-btn>
                        </q-card-actions>
                    </q-card>
                </q-dialog>
                <q-btn no-caps class="text-white bg-secondary" @click="editFields">Editar</q-btn>
                <q-dialog v-model="data.cardEdit">
                    <q-card class="my-card bg-primary" flat bordered>
                        <q-item>
                            <q-item-section>
                                <q-item-label><b>Editar: "Carga Contaminante"</b></q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />

                        <q-card-section>
                            <div>
                                <div class="row">
                                    <q-select class="col-8 q-mr-xl text-black" use-input input-debounce="0" dense
                                        outlined v-model="data.entidadEdit" :options="options" @filter="filterFn"
                                        label="Entidad" />
                                    <q-input outlined dense v-model="data.añoEdit" type="number" hint="Año"
                                        class="col-2" />
                                </div>
                                <div class="column items-start">
                                    <q-toggle v-model="data.coordinadorEdit" color="secondary"
                                        label="Existencia de coordinador" left-label true-value="si" false-value="no" />
                                    <q-toggle v-model="data.diagnosticoEdit" color="secondary"
                                        label="Existencia de diagnostico" left-label true-value="si" false-value="no" />
                                    <q-toggle v-model="data.politicaEdit" color="secondary"
                                        label="Existencia de politica" left-label true-value="si" false-value="no" />
                                    <q-toggle v-model="data.indicadoresEdit" color="secondary"
                                        label="Existencia de indicadores" left-label true-value="si" false-value="no" />
                                    <q-toggle v-model="data.planEdit" color="secondary"
                                        label="Existencia de plan de accion" left-label true-value="si"
                                        false-value="no" />
                                    <q-toggle v-model="data.legislacionEdit" color="secondary"
                                        label="Existencia de legislacion" left-label true-value="si" false-value="no" />
                                    <q-toggle v-model="data.capacitacionEdit" color="secondary"
                                        label="Existencia de plan de capacitacion" left-label true-value="si"
                                        false-value="no" />
                                    <q-toggle v-model="data.accionesEdit" color="secondary"
                                        label="Existencia de acciones PML" left-label true-value="si"
                                        false-value="no" />
                                    <q-toggle v-model="data.programaEdit" color="secondary"
                                        label="Existencia de programa de gestion ambiental" left-label true-value="si"
                                        false-value="no" />
                                    <q-toggle v-model="data.recursoEdit" color="secondary"
                                        label="Existencia de recurso financiero" left-label true-value="si"
                                        false-value="no" />
                                    <q-toggle v-model="data.aprovechamientoEdit" color="secondary"
                                        label="Aprovechamiento economico" left-label true-value="si" false-value="no" />
                                    <q-toggle v-model="data.sistemaEdit" color="secondary"
                                        label="Existencia de sistema de tratamiento" left-label true-value="si"
                                        false-value="no" />
                                    <q-toggle v-model="data.cargaEdit" color="secondary"
                                        label="Disminucion de carga contaminante" left-label true-value="si"
                                        false-value="no" />
                                </div>
                                <q-input outlined dense v-model="data.observacionesEdit" type="textarea"
                                    label="Observaciones" class="q-pa-xs" />
                            </div>
                        </q-card-section>

                        <q-separator dark />

                        <q-card-actions class="justify-end">
                            <q-btn no-caps class="text-white bg-secondary" @click="Edit">Editar</q-btn>
                        </q-card-actions>
                    </q-card>
                </q-dialog>
                <q-btn no-caps class="text-white bg-secondary" @click="Delete">Eliminar</q-btn>
            </q-card-actions>
        </q-card>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
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
const filter = ref('');
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
        name: "anno",
        align: "center",
        label: "Año",
        field: "anno",
        sortable: true,
    },
    {
        name: "coordinador",
        align: "center",
        label: "Coordinador",
        field: "coordinador",
        sortable: true,
    },
    {
        name: "diagnostico",
        align: "center",
        label: "Diagnostico",
        field: "diagnostico",
        sortable: true,
    },
    {
        name: "politica",
        align: "center",
        label: "Politica",
        field: "politica",
        sortable: true,
    },
    {
        name: "indicadores",
        align: "center",
        label: "Indicadores",
        field: "indicadores",
        sortable: true,
    },
    {
        name: "plan",
        align: "center",
        label: "Plan de accion",
        field: "plan",
        sortable: true,
    },
    {
        name: "legislacion",
        align: "center",
        label: "Legislacion",
        field: "legislacion",
        sortable: true,
    },
    {
        name: "capacitacion",
        align: "center",
        label: "Plan de Capacitacion",
        field: "capacitacion",
        sortable: true,
    },
    {
        name: "acciones",
        align: "center",
        label: "Acciones PML",
        field: "acciones",
        sortable: true,
    },
    {
        name: "programa",
        align: "center",
        label: "Programa de gestion ambiental",
        field: "programa",
        sortable: true,
    },
    {
        name: "recurso",
        align: "center",
        label: "Recurso finaciero",
        field: "recurso",
        sortable: true,
    },
    {
        name: "aprovechamiento",
        align: "center",
        label: "Aprovechamiento economico",
        field: "aprovechamiento",
        sortable: true,
    },
    {
        name: "sistema",
        align: "center",
        label: "Sistema de tratamiento",
        field: "sistema",
        sortable: true,
    },
    {
        name: "carga",
        align: "center",
        label: "Disminucion de carga contaminante",
        field: "carga",
        sortable: true,
    },
    {
        name: "total",
        align: "center",
        label: "Total",
        field: "total",
        sortable: true,
    }];

const stringOptions = []
const model = ref([])
const options = ref(stringOptions)

let data = reactive({
    rows: [],
    rowsAnt: [],
    coordinador: 1,
    diagnostico: 1,
    politica: 1,
    indicadores: 1,
    plan: 1,
    legislacion: 1,
    capacitacion: 1,
    acciones: 1,
    programa: 1,
    recurso: 1,
    aprovechamiento: 1,
    sistema: 1,
    carga: 1,
    año: "",
    observaciones: "",

    coordinadorEdit: "0",
    diagnosticoEdit: "0",
    politicaEdit: "0",
    indicadoresEdit: "0",
    planEdit: "0",
    legislacionEdit: "0",
    capacitacionEdit: "0",
    accionesEdit: "0",
    programaEdit: "0",
    recursoEdit: "",
    aprovechamientoEdit: "",
    sistemaEdit: "",
    cargaEdit: "0",
    añoEdit: "",
    observacionesEdit: "",
    entidadEdit: "",

    fecha_actual: new Date(),
    fecha_annoAnt: new Date(),

    entidades: [],
    tempEntidad: "",
    identidadEdit: "",

    cardEdit: false,
    cardCreate: false,
});

function filterFn(val, update) {
    if (val === '') {
        update(() => {
            options.value = stringOptions

            // here you have access to "ref" which
            // is the Vue reference of the QSelect
        })
        return
    }

    update(() => {
        const needle = val.toLowerCase()
        options.value = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
    })
}

onMounted(() => {
    getYear()
    getDesempeño()
    getEntidad()
});

watch(() => model.value, (value) => {
    console.log(value);
    // data.rowsAnt.forEach(element => {
    //     console.log(value);
    //     console.log(element.entidad);
    //     //if(element.entidad==value) 
    // });
    let temp = ""
    data.entidades.forEach(element => {
        if (element.nombre == model.value) temp = element.id
    });
    console.log(temp);
    getDesempeñoID(temp)
})

function getYear(params) {
    data.fecha_actual = data.fecha_actual.getFullYear()
    data.fecha_annoAnt = data.fecha_annoAnt.getFullYear()
}

function editFields(params) {
    (data.coordinadorEdit = selected.value[0].coordinador),
        (data.diagnosticoEdit = selected.value[0].diagnostico),
        (data.politicaEdit = selected.value[0].politica),
        (data.indicadoresEdit = selected.value[0].indicadores),
        (data.planEdit = selected.value[0].plan),
        (data.legislacionEdit = selected.value[0].legislacion),
        (data.capacitacionEdit = selected.value[0].capacitacion),
        (data.accionesEdit = selected.value[0].acciones),
        (data.programaEdit = selected.value[0].programa),
        (data.recursoEdit = selected.value[0].recurso),
        (data.aprovechamientoEdit = selected.value[0].aprovechamiento),
        (data.sistemaEdit = selected.value[0].sistema),
        (data.cargaEdit = selected.value[0].carga),
        (data.observacionesEdit = selected.value[0].observaciones),
        (data.añoEdit = selected.value[0].anno),
        (data.entidadEdit = selected.value[0].entidad),
        (data.cardEdit = true);
}

function Edit(params) {
    data.entidades.forEach(element => {
        if (element.nombre == data.entidadEdit) {
            data.identidadEdit = [{ id: element.id }]
        }
    });

    const dataRest = {
        data: {
            exist_program_gestionambiental: data.programaEdit,
            exist_coordinador: data.coordinadorEdit,
            exist_diagnostico: data.diagnosticoEdit,
            aprovechamiento_economico: data.aprovechamientoEdit,
            exist_sistem_tratamiento: data.sistemaEdit,
            exist_recurso_financiero: data.recursoEdit,
            exist_indicadores: data.indicadoresEdit,
            exist_plan_capacitacion: data.capacitacionEdit,
            disminucion_carga_contaminante: data.cargaEdit,
            exist_politica: data.politicaEdit,
            exist_plan_accion: data.planEdit,
            exist_legislacion: data.legislacionEdit,
            exist_accionespml: data.accionesEdit,
            observaciones: data.observacionesEdit,
            anno: data.añoEdit,
            entidad: data.identidadEdit,
        },
    };

    Object.keys(dataRest.data).forEach(function (key) {
        if (dataRest.data[key] === "si") {
            dataRest.data[key] = 1
        } else if (dataRest.data[key] === "no") {
            dataRest.data[key] = 0
        }
    })

    const authorization = {
        headers: {
            Authorization: `Bearer ${auth.jwt}`,
        },
    };

    api
        .put(`/desempenoambientals/${selected.value[0].id}`, dataRest, authorization)
        .then(function (response) {
            //console.log(response);
            getDesempeño();
        })
        .catch(function (error) {
            console.log(error.response);
        });
}

function Create() {
    data.entidades.forEach(element => {
        if (element.nombre == model.value) data.tempEntidad = [{ id: element.id }]
    });
    const dataRest = {
        data: {
            exist_program_gestionambiental: data.programa,
            exist_coordinador: data.coordinador,
            exist_diagnostico: data.diagnostico,
            aprovechamiento_economico: data.aprovechamiento,
            exist_sistem_tratamiento: data.sistema,
            exist_recurso_financiero: data.recurso,
            exist_indicadores: data.indicadores,
            exist_plan_capacitacion: data.capacitacion,
            disminucion_carga_contaminante: data.carga,
            exist_politica: data.politica,
            exist_plan_accion: data.plan,
            exist_legislacion: data.legislacion,
            exist_accionespml: data.acciones,
            observaciones: data.observaciones,
            anno: data.año,
            entidad: data.tempEntidad,
        },
    };

    const authorization = {
        headers: {
            Authorization: `Bearer ${auth.jwt}`,
        },
    };

    api
        .post("/desempenoambientals", dataRest, authorization)
        .then(function (response) {
            //////console.log(response);
            getDesempeño();
        })
        .catch(function (error) {
            console.log(error.response);
        });
}

function Delete(params) {
    for (let index = 0; index < selected.value.length; index++) {
        api
            .delete(`/desempenoambientals/${selected.value[index].id}`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
            .then(function (response) {
                getDesempeño()
            })
            .catch(function (error) {
                console.log(error);
            });

    }
    selected.value = []
}

function getEntidad(params) {
    api
        .get(`/entidads`, {
            headers: {
                Authorization: "Bearer " + auth.jwt,
            },
        }).then(function (response) {
            //////console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                data.entidades.push({
                    nombre: response.data.data[i].attributes.entidad,
                    id: response.data.data[i].id
                }
                )
            }
            data.entidades.forEach(element => {
                stringOptions.push(element.nombre)
            });
        }).catch(function (error) {
            console.log(error.response);
        });
}

async function getDesempeño(params) {
    data.rows = [];
    let count = 1
    for (let index = 1; index < 10; index++) {
        await api
            .get(`/desempenoambientals?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100&sort[0]=anno%3Adesc&filters[anno][$containsi]=${data.fecha_actual}`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
            .then(function (response) {
                console.log(response);
                for (let i = 0; i < response.data.data.length; i++) {
                    if (response.data.data[i].attributes.entidad.data.length > 0) {
                        data.rows.push({
                            name: count.toString(),
                            id: response.data.data[i].id,
                            entidad: response.data.data[i].attributes.entidad.data[0].attributes.entidad,
                            coordinador: response.data.data[i].attributes.exist_coordinador,
                            diagnostico: response.data.data[i].attributes.exist_diagnostico,
                            politica: response.data.data[i].attributes.exist_politica,
                            indicadores: response.data.data[i].attributes.exist_indicadores,
                            plan: response.data.data[i].attributes.exist_plan_accion,
                            legislacion: response.data.data[i].attributes.exist_legislacion,
                            capacitacion: response.data.data[i].attributes.exist_plan_capacitacion,
                            acciones: response.data.data[i].attributes.exist_accionespml,
                            programa: response.data.data[i].attributes.exist_program_gestionambiental,
                            recurso: response.data.data[i].attributes.exist_recurso_financiero,
                            aprovechamiento: response.data.data[i].attributes.aprovechamiento_economico,
                            sistema: response.data.data[i].attributes.exist_sistem_tratamiento,
                            anno: response.data.data[i].attributes.anno,
                            carga: response.data.data[i].attributes.disminucion_carga_contaminante,
                            observaciones: response.data.data[i].attributes.observaciones,
                            total: (response.data.data[i].attributes.disminucion_carga_contaminante + response.data.data[i].attributes.exist_sistem_tratamiento + response.data.data[i].attributes.aprovechamiento_economico + response.data.data[i].attributes.exist_recurso_financiero + response.data.data[i].attributes.exist_program_gestionambiental + response.data.data[i].attributes.exist_accionespml + response.data.data[i].attributes.exist_plan_capacitacion + response.data.data[i].attributes.exist_legislacion + response.data.data[i].attributes.exist_plan_accion + response.data.data[i].attributes.exist_coordinador + response.data.data[i].attributes.exist_diagnostico + response.data.data[i].attributes.exist_politica + response.data.data[i].attributes.exist_indicadores).toString()
                        });
                        Object.keys(data.rows[i]).forEach(function (key) {
                            if (data.rows[i][key] != null || data.rows[i][key] != undefined) {
                                if (data.rows[i][key] === 1) {
                                    data.rows[i][key] = "si"
                                } else if (data.rows[i][key] === 0) {
                                    data.rows[i][key] = "no"
                                }
                            }
                        })
                    }
                    count++
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

async function getDesempeñoID(params) {
    data.rowsAnt = [];
    let count = 1
    let encontrado = true
    let annos = 0
    do {
        for (let index = 1; index < 10; index++) {
            await api
                .get(`/desempenoambientals?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100&sort[0]=anno%3Adesc&filters[anno][$containsi]=${data.fecha_actual - annos}`, {
                    headers: {
                        Authorization: "Bearer " + auth.jwt,
                    },
                })
                .then(function (response) {
                    console.log(response);
                    for (let i = 0; i < response.data.data.length; i++) {
                        if (response.data.data[i].attributes.entidad.data.length > 0 && response.data.data[i].attributes.entidad.data[0].id == params) {
                            encontrado = false
                            data.rowsAnt.push({
                                name: count.toString(),
                                id: response.data.data[i].id,
                                entidad: response.data.data[i].attributes.entidad.data[0].attributes.entidad,
                                coordinador: response.data.data[i].attributes.exist_coordinador,
                                diagnostico: response.data.data[i].attributes.exist_diagnostico,
                                politica: response.data.data[i].attributes.exist_politica,
                                indicadores: response.data.data[i].attributes.exist_indicadores,
                                plan: response.data.data[i].attributes.exist_plan_accion,
                                legislacion: response.data.data[i].attributes.exist_legislacion,
                                capacitacion: response.data.data[i].attributes.exist_plan_capacitacion,
                                acciones: response.data.data[i].attributes.exist_accionespml,
                                programa: response.data.data[i].attributes.exist_program_gestionambiental,
                                recurso: response.data.data[i].attributes.exist_recurso_financiero,
                                aprovechamiento: response.data.data[i].attributes.aprovechamiento_economico,
                                sistema: response.data.data[i].attributes.exist_sistem_tratamiento,
                                anno: response.data.data[i].attributes.anno,
                                carga: response.data.data[i].attributes.disminucion_carga_contaminante,
                                observaciones: response.data.data[i].attributes.observaciones,
                                total: (response.data.data[i].attributes.disminucion_carga_contaminante + response.data.data[i].attributes.exist_sistem_tratamiento + response.data.data[i].attributes.aprovechamiento_economico + response.data.data[i].attributes.exist_recurso_financiero + response.data.data[i].attributes.exist_program_gestionambiental + response.data.data[i].attributes.exist_accionespml + response.data.data[i].attributes.exist_plan_capacitacion + response.data.data[i].attributes.exist_legislacion + response.data.data[i].attributes.exist_plan_accion + response.data.data[i].attributes.exist_coordinador + response.data.data[i].attributes.exist_diagnostico + response.data.data[i].attributes.exist_politica + response.data.data[i].attributes.exist_indicadores).toString()
                            });
                            // Object.keys(data.rowsAnt[i]).forEach(function (key) {
                            //     if (data.rowsAnt[i][key] != null || data.rowsAnt[i][key] != undefined) {
                            //         if (data.rowsAnt[i][key] === 1) {
                            //             data.rowsAnt[i][key] = "si"
                            //         } else if (data.rowsAnt[i][key] === 0) {
                            //             data.rowsAnt[i][key] = "no"
                            //         }
                            //     }
                            // })
                        }
                        count++
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        annos++
        if (annos == 5) break;
        console.log(annos);
    } while (encontrado);
}

function getSelectedString() {
    return selected.value.length === 0
        ? ""
        : `${selected.value.length} record${selected.value.length > 1 ? "s" : ""
        } selected of ${data.rows.length}`;
}

</script>

