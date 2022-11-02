<template>
    <div>
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Plan de enfrentamiento" dense :rows="data.rows"
                    :columns="columns" row-key="name" :selected-rows-label="getSelectedString" selection="multiple"
                    v-model:selected="selected" v-model:pagination="pagination" />
            </q-card-section>

            <q-card-actions class="justify-end">
                <q-btn no-caps class="text-white bg-secondary" @click="data.cardCreate = true">Insertar</q-btn>
                <q-dialog v-model="data.cardCreate">
                    <q-card class="my-card bg-primary" flat bordered>
                        <q-item>
                            <q-item-section>
                                <q-item-label><b>Nuevo: "Plan de enfrentamiento"</b></q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />

                        <q-card-section>
                            <div class="row">
                                <q-select class="col-8 q-mr-xl text-black" use-input input-debounce="0" dense outlined
                                    v-model="model" :options="options" @filter="filterFn" label="Entidad"
                                    style="max-width: 50%" />
                                    <q-input outlined dense v-model="data.fecha" type="date" hint="Fecha" />
                            </div>
                            <div>
                                <q-item>
                                    <q-item-section avatar>Plan correctamente elaborado:</q-item-section>
                                    <q-item-section>
                                        <div class="row">
                                            <q-radio v-model="data.plan" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="si" label="Si"
                                                color="secondary" />
                                            <q-radio v-model="data.plan" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="no" label="No"
                                                color="secondary" />
                                        </div>
                                    </q-item-section>
                                </q-item>
                            </div>
                            <div v-if="data.plan=='si'">
                                <div>
                                    Acerca del plan:
                                    <q-item>
                                        <q-item-section>
                                            <div class="row">
                                                <q-input outlined dense v-model="data.medidas" class="q-pa-sm col-3"
                                                    type="number" hint="Total de medidas" style="max-width: 150px" />
                                                <q-input outlined dense v-model="data.cumplidas" class="q-pa-sm col-3"
                                                    type="number" style="max-width: 170px" hint="Cumplidas" />
                                                <q-input outlined dense v-model="data.evaluadas" class="q-pa-sm col-3"
                                                    type="number" style="max-width: 150px" hint="No evaluadas" />
                                                <q-input outlined dense v-model="data.incumplidas" class="q-pa-sm col-3"
                                                    type="number" style="max-width: 170px" hint="Incumplidas" />
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                </div>
                            </div>
                            <div>
                                <q-item>
                                    <q-item-section avatar>Tiene permiso de vertimiento:</q-item-section>
                                    <q-item-section>
                                        <div class="row">
                                            <q-radio v-model="data.permiso" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="si" label="Si"
                                                color="secondary" />
                                            <q-radio v-model="data.permiso" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="no" label="No"
                                                color="secondary" />
                                        </div>
                                    </q-item-section>
                                </q-item>

                            </div>
                            <div v-if="data.permiso=='si'">
                                <div>
                                    Detalles:
                                    <q-item>
                                        <q-item-section>
                                            <div>
                                                <q-input outlined dense v-model="data.nombrePermiso" class="q-pa-sm"
                                                    type="text" label="Nombre del documento" style="max-width: 100%" />
                                                <q-input outlined dense v-model="data.cuerpo" class="q-pa-sm"
                                                    type="text" style="max-width: 100%" label="Cuerpo receptor" />
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                </div>
                            </div>
                            <div>
                                <q-item>
                                    <q-item-section avatar>Licencia ambiental actualizada:</q-item-section>
                                    <q-item-section>
                                        <div class="row">
                                            <q-radio v-model="data.licencia" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="si" label="Si"
                                                color="secondary" />
                                            <q-radio v-model="data.licencia" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="no" label="No"
                                                color="secondary" />
                                        </div>
                                    </q-item-section>
                                </q-item>

                            </div>
                            <div v-if="data.licencia=='si'">
                                <div>
                                    Detalles:
                                    <q-item>
                                        <q-item-section>
                                            <div>
                                                <q-input outlined dense v-model="data.nombreLicencia" class="q-pa-sm"
                                                    type="text" label="Nombre del documento" style="max-width: 100%" />
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                </div>
                            </div>
                            <div>
                                <q-item>
                                    <q-item-section avatar>Tiene plan de manejo de desechos peligrosos:</q-item-section>
                                    <q-item-section>
                                        <div class="row">
                                            <q-radio v-model="data.desechos" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="si" label="Si"
                                                color="secondary" />
                                            <q-radio v-model="data.desechos" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="no" label="No"
                                                color="secondary" />
                                        </div>
                                    </q-item-section>
                                </q-item>

                            </div>
                            <div v-if="data.desechos=='si'">
                                <div>
                                    <q-item>
                                        <q-item-section>
                                            <div>
                                                <q-input outlined dense v-model="data.observacionesDesechos"
                                                    class="q-pa-sm" type="textarea" label="Observaciones"
                                                    style="max-width: 100%" />
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                </div>
                            </div>
                            <div>
                                <q-item>
                                    <q-item-section avatar>Inversiones en ejecucion o preparacion:</q-item-section>
                                    <q-item-section>
                                        <div class="row">
                                            <q-radio v-model="data.inversiones" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="si" label="Si"
                                                color="secondary" />
                                            <q-radio v-model="data.inversiones" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="no" label="No"
                                                color="secondary" />
                                        </div>
                                    </q-item-section>
                                </q-item>

                            </div>
                            <div v-if="data.inversiones=='si'">
                                <div>
                                    Detalles:
                                    <q-item>
                                        <q-item-section>
                                            <q-item>
                                                <q-item-section avatar>Marcha acorde al cronograma:</q-item-section>
                                                <q-item-section>
                                                    <div class="row">
                                                        <q-radio v-model="data.marcha" checked-icon="task_alt"
                                                            unchecked-icon="panorama_fish_eye" val="si" label="Si"
                                                            color="secondary" />
                                                        <q-radio v-model="data.marcha" checked-icon="task_alt"
                                                            unchecked-icon="panorama_fish_eye" val="no" label="No"
                                                            color="secondary" />
                                                    </div>
                                                </q-item-section>
                                            </q-item>
                                            <div>
                                                <q-input outlined dense v-model="data.descripcion" class="q-pa-sm"
                                                    type="textarea" label="Descripcion" style="max-width: 100%" />
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                </div>
                            </div>
                            <q-input v-model="data.observaciones" filled type="textarea" label="Observaciones"
                                class="q-mt-xl q-mb-md q-pa-sm" style="min-width: 400px; width: 50%" />
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
                                <q-item-label><b>Editar: "Plan de enfrentamiento"</b></q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />

                        <q-card-section>
                            <div class="row">
                                <q-select class="col-8 q-mr-xl text-black" use-input input-debounce="0" dense outlined
                                    v-model="data.entidadEdit" :options="options" @filter="filterFn" label="Entidad"
                                    style="max-width: 50%" />
                                    <q-input outlined dense v-model="data.fechaEdit" type="date" hint="Fecha" />
                            </div>
                            <div>
                                <q-item>
                                    <q-item-section avatar>Plan correctamente elaborado:</q-item-section>
                                    <q-item-section>
                                        <div class="row">
                                            <q-radio v-model="data.planEdit" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="si" label="Si"
                                                color="secondary" />
                                            <q-radio v-model="data.planEdit" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="no" label="No"
                                                color="secondary" />
                                        </div>
                                    </q-item-section>
                                </q-item>
                            </div>
                            <div v-if="data.planEdit=='si'">
                                <div>
                                    <q-item>
                                        <q-item-section avatar>Acerca del plan:</q-item-section>
                                        <q-item-section>
                                            <div class="row">
                                                <q-input outlined dense v-model="data.medidasEdit" class="q-pa-sm col-3"
                                                    type="number" hint="Total de medidas" style="max-width: 150px" />
                                                <q-input outlined dense v-model="data.cumplidasEdit"
                                                    class="q-pa-sm col-3" type="number" style="max-width: 170px"
                                                    hint="Cumplidas" />
                                                <q-input outlined dense v-model="data.evaluadasEdit"
                                                    class="q-pa-sm col-3" type="number" style="max-width: 150px"
                                                    hint="No evaluadas" />
                                                <q-input outlined dense v-model="data.incumplidasEdit"
                                                    class="q-pa-sm col-3" type="number" style="max-width: 170px"
                                                    hint="Incumplidas" />
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                </div>
                            </div>
                            <div>
                                <q-item>
                                    <q-item-section avatar>Tiene permiso de vertimiento:</q-item-section>
                                    <q-item-section>
                                        <div class="row">
                                            <q-radio v-model="data.permisoEdit" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="si" label="Si"
                                                color="secondary" />
                                            <q-radio v-model="data.permisoEdit" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="no" label="No"
                                                color="secondary" />
                                        </div>
                                    </q-item-section>
                                </q-item>

                            </div>
                            <div v-if="data.permisoEdit=='si'">
                                <div>
                                    Detalles:
                                    <q-item>
                                        <q-item-section>
                                            <div>
                                                <q-input outlined dense v-model="data.nombrePermisoEdit" class="q-pa-sm"
                                                    type="text" label="Nombre del documento" style="max-width: 100%" />
                                                <q-input outlined dense v-model="data.cuerpoEdit" class="q-pa-sm"
                                                    type="text" style="max-width: 100%" label="Cuerpo receptor" />
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                </div>
                            </div>
                            <div>
                                <q-item>
                                    <q-item-section avatar>Licencia ambiental actualizada:</q-item-section>
                                    <q-item-section>
                                        <div class="row">
                                            <q-radio v-model="data.licenciaEdit" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="si" label="Si"
                                                color="secondary" />
                                            <q-radio v-model="data.licenciaEdit" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="no" label="No"
                                                color="secondary" />
                                        </div>
                                    </q-item-section>
                                </q-item>

                            </div>
                            <div v-if="data.licenciaEdit=='si'">
                                <div>
                                    Detalles:
                                    <q-item>
                                        <q-item-section>
                                            <div>
                                                <q-input outlined dense v-model="data.nombreLicenciaEdit"
                                                    class="q-pa-sm" type="text" label="Nombre del documento"
                                                    style="max-width: 100%" />
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                </div>
                            </div>
                            <div>
                                <q-item>
                                    <q-item-section avatar>Tiene plan de manejo de desechos peligrosos:</q-item-section>
                                    <q-item-section>
                                        <div class="row">
                                            <q-radio v-model="data.desechosEdit" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="si" label="Si"
                                                color="secondary" />
                                            <q-radio v-model="data.desechosEdit" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="no" label="No"
                                                color="secondary" />
                                        </div>
                                    </q-item-section>
                                </q-item>

                            </div>
                            <div v-if="data.desechosEdit=='si'">
                                <div>
                                    <q-item>
                                        <q-item-section>
                                            <div>
                                                <q-input outlined dense v-model="data.observacionesDesechosEdit"
                                                    class="q-pa-sm" type="textarea" label="Observaciones"
                                                    style="max-width: 100%" />
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                </div>
                            </div>
                            <div>
                                <q-item>
                                    <q-item-section avatar>Inversiones en ejecucion o preparacion:</q-item-section>
                                    <q-item-section>
                                        <div class="row">
                                            <q-radio v-model="data.inversionesEdit" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="si" label="Si"
                                                color="secondary" />
                                            <q-radio v-model="data.inversionesEdit" checked-icon="task_alt"
                                                unchecked-icon="panorama_fish_eye" val="no" label="No"
                                                color="secondary" />
                                        </div>
                                    </q-item-section>
                                </q-item>

                            </div>
                            <div v-if="data.inversionesEdit=='si'">
                                <div>
                                    Detalles:
                                    <q-item>
                                        <q-item-section>
                                            <q-item>
                                                <q-item-section avatar>Marcha acorde al cronograma:</q-item-section>
                                                <q-item-section>
                                                    <div class="row">
                                                        <q-radio v-model="data.marchaEdit" checked-icon="task_alt"
                                                            unchecked-icon="panorama_fish_eye" val="si" label="Si"
                                                            color="secondary" />
                                                        <q-radio v-model="data.marchaEdit" checked-icon="task_alt"
                                                            unchecked-icon="panorama_fish_eye" val="no" label="No"
                                                            color="secondary" />
                                                    </div>
                                                </q-item-section>
                                            </q-item>
                                            <div>
                                                <q-input outlined dense v-model="data.descripcionEdit" class="q-pa-sm"
                                                    type="textarea" label="Descripcion" style="max-width: 100%" />
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                </div>
                            </div>
                            <q-input v-model="data.observacionesEdit" filled type="textarea" label="Observaciones"
                                class="q-mt-xl q-mb-md q-pa-sm" style="min-width: 400px; width: 50%" />
                        </q-card-section>

                        <q-separator dark />

                        <q-card-actions class="justify-end">
                            <q-btn no-caps class="text-white bg-secondary" @click="Edit">Editar</q-btn>
                            <q-btn no-caps class="text-white bg-secondary">Limpiar Campos</q-btn>
                        </q-card-actions>
                    </q-card>
                </q-dialog>
                <q-btn no-caps class="text-white bg-secondary" @click="Delete">Eliminar</q-btn>
            </q-card-actions>
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
        label: "Entidad",
        field: "entidad",
        sortable: true,
    },
    {
        name: "fecha",
        align: "center",
        label: "Fecha",
        field: "fecha",
        sortable: true,
    },
    {
        name: "plan",
        align: "center",
        label: "Plan correctamente elaborado",
        field: "plan",
        sortable: true,
    },
    {
        name: "licencia",
        align: "center",
        label: "Licencia ambiental actualizada",
        field: "licencia",
        sortable: true,
    },
    {
        name: "desechos",
        align: "center",
        label: "Tiene plan de manejo de desechos peligrosos",
        field: "desechos",
        sortable: true,
    },
    {
        name: "inversiones",
        align: "center",
        label: "Inversiones en ejecucion o preparacion",
        field: "inversiones",
        sortable: true,
    }
];

const stringOptions = []
const model = ref([])
const options = ref(stringOptions)

let data = reactive({
    rows: [],

    desechos: "no",
    inversiones: "no",
    licencia: "no",
    observaciones: "",
    permiso: "no",
    plan: "no",
    sistema: "no",
    trampa: "no",
    medidas: "",
    cumplidas: "",
    evaluadas: "",
    incumplidas: "",
    nombrePermiso: "",
    cuerpo: "",
    nombreLicencia: "",
    observacionesDesechos: "",
    marcha: "",
    descripcion: "",
    fecha:"",

    desechosEdit: "",
    inversionesEdit: "",
    licenciaEdit: "",
    observacionesEdit: "",
    permisoEdit: "",
    planEdit: "",
    sistemaEdit: "no",
    trampaEdit: "no",
    medidasEdit: "",
    cumplidasEdit: "",
    evaluadasEdit: "",
    incumplidasEdit: "",
    nombrePermisoEdit: "",
    cuerpoEdit: "",
    nombreLicenciaEdit: "",
    observacionesDesechosEdit: "",
    marchaEdit: "",
    descripcionEdit: "",
    fechaEdit:"",

    categoriaEdit: "",
    cardEdit: false,
    cardCreate: false,

    entidades: [],
    tempEntidad: [],
    entidadEdit: "",
    identidadEdit: ""
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
    getEnfrentamiento()
    getEntidad()

});


function editFields(params) {
    (data.planEdit = selected.value[0].plan),
        (data.sistemaEdit = selected.value[0].sistema),
        (data.trampaEdit = selected.value[0].trampa),
        (data.permisoEdit = selected.value[0].permiso),
        (data.licenciaEdit = selected.value[0].licencia),
        (data.desechosEdit = selected.value[0].desechos),
        (data.inversionesEdit = selected.value[0].inversiones),
        (data.observacionesEdit = selected.value[0].observaciones),
        (data.medidasEdit = selected.value[0].medidas),
        (data.cumplidasEdit = selected.value[0].cumplidas),
        (data.evaluadasEdit = selected.value[0].evaluadas),
        (data.nombrePermisoEdit = selected.value[0].nombrePermiso),
        (data.cuerpoEdit = selected.value[0].cuerpoReceptor),
        (data.nombreLicenciaEdit = selected.value[0].nombreLicencia),
        (data.observacionesDesechosEdit = selected.value[0].observacionesDesechos),
        (data.marchaEdit = selected.value[0].marchaAcorde),
        (data.descripcionEdit = selected.value[0].descripcion),
        (data.fechaEdit = selected.value[0].fecha),
        (data.incumplidasEdit = selected.value[0].incumplidas),
        (data.entidadEdit = selected.value[0].entidad),
        (data.cardEdit = true);
}

function Edit(params) {
    data.entidades.forEach(element => {
        if (element.nombre == data.entidadEdit) data.identidadEdit = { id: element.id }
    });
    const dataRest = {
        data: {
            desechos: data.desechosEdit,
            inversiones: data.inversionesEdit,
            licencia: data.licenciaEdit,
            observaciones: data.observacionesEdit,
            permiso: data.permisoEdit,
            plan: data.planEdit,
            sistema: data.sistemaEdit,
            trampa: data.trampaEdit,
            medidas: data.medidasEdit,
            cumplidas: data.cumplidasEdit,
            evaluadas: data.evaluadasEdit,
            incumplidas: data.incumplidasEdit,
            entidad: data.identidadEdit,
            nombrePermiso: data.nombrePermisoEdit,
            cuerpoReceptor: data.cuerpoEdit,
            nombreLicencia: data.nombreLicenciaEdit,
            observacionesDesechos: data.observacionesDesechosEdit,
            marchaAcorde: data.marchaEdit,
            descripcion: data.descripcionEdit,
            fecha: data.fechaEdit
        },
    };

    console.log(dataRest);

    Object.keys(dataRest.data).forEach(function (key) {
        if (dataRest.data[key] === "si") {
            dataRest.data[key] = true
        } else if (dataRest.data[key] === "no") {
            dataRest.data[key] = false
        }
    })

    console.log(dataRest);

    const authorization = {
        headers: {
            Authorization: `Bearer ${auth.jwt}`,
        },
    };

    api
        .put(`/plan-enfrentamientos/${selected.value[0].id}`, dataRest, authorization)
        .then(function (response) {
            //console.log(response);
            getEnfrentamiento();
        })
        .catch(function (error) {
            console.log(error.response);
        });
}

function Create() {
    data.entidades.forEach(element => {
        if (element.nombre == model.value) data.tempEntidad = { id: element.id }
    });
    const dataRest = {
        data: {
            desechos: data.desechos,
            inversiones: data.inversiones,
            licencia: data.licencia,
            observaciones: data.observaciones,
            permiso: data.permiso,
            plan: data.plan,
            sistema: data.sistema,
            trampa: data.trampa,
            medidas: data.medidas,
            cumplidas: data.cumplidas,
            evaluadas: data.evaluadas,
            incumplidas: data.incumplidas,
            entidad: data.tempEntidad,
            nombrePermiso: data.nombrePermiso,
            cuerpoReceptor: data.cuerpo,
            nombreLicencia: data.nombreLicencia,
            observacionesDesechos: data.observacionesDesechos,
            marchaAcorde: data.marcha,
            descripcion: data.descripcion,
            fecha:data.fecha
        },
    };

    Object.keys(dataRest.data).forEach(function (key) {
        if (dataRest.data[key] === "si") {
            dataRest.data[key] = true
        } else if (dataRest.data[key] === "no") {
            dataRest.data[key] = false
        }
    })

    const authorization = {
        headers: {
            Authorization: `Bearer ${auth.jwt}`,
        },
    };

    api
        .post("/plan-enfrentamientos", dataRest, authorization)
        .then(function (response) {
            //console.log(response);
            getEnfrentamiento();
        })
        .catch(function (error) {
            console.log(error.response);
        });
}

function Delete(params) {
    for (let index = 0; index < selected.value.length; index++) {
        api
            .delete(`/plan-enfrentamientos/${selected.value[index].id}`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
            .then(function (response) {
                getEnfrentamiento()
            })
            .catch(function (error) {
                console.log(error);
            });

    }
    selected.value = []
}

function getEntidad(params) {
    api
        .get(`/entidads?filters[activo][$eq]=s`, {
            headers: {
                Authorization: "Bearer " + auth.jwt,
            },
        }).then(function (response) {
            //console.log(response);
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

async function getEnfrentamiento(params) {
    data.rows = [];
    let count = 1
    for (let index = 1; index < 2; index++) {
        await api
            .get(`/plan-enfrentamientos?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
            .then(function (response) {
                console.log(response);
                for (let i = 0; i < response.data.data.length; i++) {
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
                    });
                    Object.keys(data.rows[i]).forEach(function (key) {
                        if (data.rows[i][key] === true) {
                            data.rows[i][key] = "si"
                        } else if (data.rows[i][key] === false) {
                            data.rows[i][key] = "no"
                        }
                    })
                    count++
                }
            })
            .catch(function (error) {
                console.log(error.response);
            });
    }
}

function getSelectedString() {
    return selected.value.length === 0
        ? ""
        : `${selected.value.length} record${selected.value.length > 1 ? "s" : ""
        } selected of ${data.rows.length}`;
}

</script>
  
<!-- <style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 600px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #c1f4cd

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style> -->