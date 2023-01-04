<template>
    <div >
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Carga contaminante" dense :rows="data.rows" :columns="columns"
                    row-key="name" :selected-rows-label="getSelectedString" selection="multiple"
                    v-model:selected="selected" v-model:pagination="pagination" />
            </q-card-section>

            <q-card-actions class="justify-end">
                <q-btn no-caps class="text-white bg-secondary" @click="data.cardCreate = true">Insertar</q-btn>
                <q-dialog v-model="data.cardCreate">
                    <q-card class="my-card bg-primary" flat bordered>
                        <q-item>
                            <q-item-section>
                                <q-item-label><b>Nueva: "Carga Contaminante"</b></q-item-label>
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
                                <div class="column items-start">
                                    <q-input outlined dense v-model="data._DB05" type="number" label="DB0₅(mg/l)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data._DQ0" type="number" label="DQ0(mg/l)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data._PT" type="number" label="PT(mg/l)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data._NTK" type="number" label="NTK(mg/l)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data._ST" type="number" label="ST(mg/l)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data._SSED" type="number" label="S.SED(mg/l)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data._PH" type="number" label="pH(U)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data._TEMP" type="number" label="TEMP(⁰C)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data._COND" type="number" label="COND(µS/cm)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data.Hidrocarburos" type="number"
                                        label="Hidrocarburos(mg/l)" class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data.Flujo" type="number" label="Flujo(m³/día)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data.Grasas" type="number"
                                        label="Grasas y aceites(mg/l)" class="col-2 q-pa-xs" />
                                </div>
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
                                    <q-input outlined dense v-model="data.añoEdit" type="number" hint="Año" class="col-2" />
                                </div>
                                <div class="column items-start">
                                    <q-input outlined dense v-model="data._DB05Edit" type="number" label="DB0₅(mg/l)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data._DQ0Edit" type="number" label="DQ0(mg/l)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data._PTEdit" type="number" label="PT(mg/l)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data._NTKEdit" type="number" label="NTK(mg/l)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data._STEdit" type="number" label="ST(mg/l)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data._SSEDEdit" type="number" label="S.SED(mg/l)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data._PHEdit" type="number" label="pH(U)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data._TEMPEdit" type="number" label="TEMP(⁰C)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data._CONDEdit" type="number" label="COND(µS/cm)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data.HidrocarburosEdit" type="number"
                                        label="Hidrocarburos(mg/l)" class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data.FlujoEdit" type="number" label="Flujo(m³/día)"
                                        class="col-2 q-pa-xs" />
                                    <q-input outlined dense v-model="data.GrasasEdit" type="number"
                                        label="Grasas y aceites(mg/l)" class="col-2 q-pa-xs" />
                                </div>
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
        name: "anno",
        align: "center",
        label: "Año",
        field: "anno",
        sortable: true,
    },
    {
        name: "DB05",
        align: "center",
        label: "DB0₅",
        field: "DB05",
        sortable: true,
    },
    {
        name: "DQ0",
        align: "center",
        label: "DQ0",
        field: "DQ0",
        sortable: true,
    },
    {
        name: "PT",
        align: "center",
        label: "PT",
        field: "PT",
        sortable: true,
    },
    {
        name: "NTK",
        align: "center",
        label: "NTK",
        field: "NTK",
        sortable: true,
    },
    {
        name: "S_SED",
        align: "center",
        label: "SSED",
        field: "S_SED",
        sortable: true,
    },
    {
        name: "PH",
        align: "center",
        label: "pH",
        field: "PH",
        sortable: true,
    },
    {
        name: "TEMP",
        align: "center",
        label: "TEMP",
        field: "TEMP",
        sortable: true,
    },
    {
        name: "COND",
        align: "center",
        label: "COND",
        field: "COND",
        sortable: true,
    },
    {
        name: "Hidrocarburos",
        align: "center",
        label: "Hidrocarburos",
        field: "Hidrocarburos",
        sortable: true,
    },
    {
        name: "Flujo",
        align: "center",
        label: "Flujo",
        field: "Flujo",
        sortable: true,
    },
    {
        name: "Grasas_aceites",
        align: "center",
        label: "Grasas y Aceites",
        field: "Grasas_aceites",
        sortable: true,
    },
];

const stringOptions = []
const model = ref([])
const options = ref(stringOptions)

let data = reactive({
    rows: [],
    _DB05: "0",
    _DQ0: "0",
    _PT: "0",
    _NTK: "0",
    _ST: "0",
    _SSED: "0",
    _PH: "0",
    _TEMP: "0",
    _COND: "0",
    Hidrocarburos: "0",
    Flujo: "0",
    Grasas: "0",
    año:"0",

    _DB05Edit: "0",
    _DQ0Edit: "0",
    _PTEdit: "0",
    _NTKEdit: "0",
    _STEdit: "0",
    _SSEDEdit: "0",
    _PHEdit: "0",
    _TEMPEdit: "0",
    _CONDEdit: "0",
    HidrocarburosEdit: "0",
    FlujoEdit: "0",
    GrasasEdit: "0",
    añoEdit:"0",
    entidadEdit:"",

    entidades: [],
    tempEntidad:"",
    identidadEdit:"",

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
    getContaminantes()
    getEntidad()
});

function editFields(params) {
    (data._DB05Edit = selected.value[0].DB05),
    (data._DQ0Edit = selected.value[0].DQ0),
    (data._PTEdit = selected.value[0].PT),
    (data._NTKEdit = selected.value[0].NTK),
    (data._STEdit = selected.value[0].STE),
    (data._SSEDEdit = selected.value[0].S_SED),
    (data._PHEdit = selected.value[0].PH),
    (data._TEMPEdit = selected.value[0].TEMP),
    (data._CONDEdit = selected.value[0].COND),
    (data.HidrocarburosEdit = selected.value[0].Hidrocarburos),
    (data.FlujoEdit = selected.value[0].Flujo),
    (data.GrasasEdit = selected.value[0].Grasas_aceites),
    (data.añoEdit = selected.value[0].anno),
    (data.entidadEdit = selected.value[0].entidad),
    (data.cardEdit = true);
}

function Edit(params) {
    data.entidades.forEach(element => {
        if (element.nombre == data.entidadEdit) {
        data.identidadEdit = [{ id: element.id }]}
  });

    const dataRest = {
        data: {
            COND:data._CONDEdit,
            DB05:data._DB05Edit,
            DQ0:data._DQ0Edit,
            Flujo:data.FlujoEdit,
            Grasas_aceites:data.GrasasEdit,
            Hidrocarburos:data.HidrocarburosEdit,
            NTK:data._NTKEdit,
            PH:data._PHEdit,
            PT:data._PTEdit,
            ST:data._STEdit,
            S_SED:data._SSEDEdit,
            TEMP:data._TEMPEdit,
            anno:data.añoEdit,
            entidad: data.identidadEdit,
        },
    };

    const authorization = {
        headers: {
            Authorization: `Bearer ${auth.jwt}`,
        },
    };

    api
        .put(`/cargacontaminantes/${selected.value[0].id}`, dataRest, authorization)
        .then(function (response) {
            ////console.log(response);
            getContaminantes();
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
            COND:data._COND,
            DB05:data._DB05,
            DQ0:data._DQ0,
            Flujo:data.Flujo,
            Grasas_aceites:data.Grasas,
            Hidrocarburos:data.Hidrocarburos,
            NTK:data._NTK,
            PH:data._PH,
            PT:data._PT,
            ST:data._ST,
            S_SED:data._SSED,
            TEMP:data._TEMP,
            anno:data.año,
            entidad: data.tempEntidad,
        },
    };

    const authorization = {
        headers: {
            Authorization: `Bearer ${auth.jwt}`,
        },
    };
    
    api
        .post("/cargacontaminantes", dataRest, authorization)
        .then(function (response) {
            ////console.log(response);
            getContaminantes();
        })
        .catch(function (error) {
            console.log(error.response);
        });
}

function Delete(params) {
    for (let index = 0; index < selected.value.length; index++) {
        api
            .delete(`/cargacontaminantes/${selected.value[index].id}`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
            .then(function (response) {
                getContaminantes()
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
            ////console.log(response);
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

async function getContaminantes(params) {
    data.rows = [];
    let count = 1
    for (let index = 1; index < 3; index++) {
        await api
            .get(`/cargacontaminantes?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100&sort[0]=anno%3Adesc`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
            .then(function (response) {
                ////console.log(response);
                for (let i = 0; i < response.data.data.length; i++) {
                    if(response.data.data[i].attributes.entidad.data.length>0){
                    data.rows.push({
                        name: count,
                        id: response.data.data[i].id,
                        entidad: response.data.data[i].attributes.entidad.data[0].attributes.entidad,
                        DB05: response.data.data[i].attributes.DB05,
                        DQ0: response.data.data[i].attributes.DQ0,
                        Flujo: response.data.data[i].attributes.Flujo,
                        Grasas_aceites: response.data.data[i].attributes.Grasas_aceites,
                        Hidrocarburos: response.data.data[i].attributes.Hidrocarburos,
                        NTK: response.data.data[i].attributes.NTK,
                        PH: response.data.data[i].attributes.PH,
                        PIB: response.data.data[i].attributes.PIB,
                        PT: response.data.data[i].attributes.PT,
                        ST: response.data.data[i].attributes.ST,
                        S_SED: response.data.data[i].attributes.S_SED,
                        TEMP: response.data.data[i].attributes.TEMP,
                        anno: response.data.data[i].attributes.anno,
                        COND: response.data.data[i].attributes.COND
                    });
                }
                    count++
                }
            })
            .catch(function (error) {
                console.log(error);
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

