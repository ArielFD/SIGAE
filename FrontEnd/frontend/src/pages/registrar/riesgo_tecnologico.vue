<template>
    <div>
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Riesgo Tecnologico" dense :rows="data.rows" :columns="columns"
                    row-key="name" :selected-rows-label="getSelectedString" selection="multiple"
                    v-model:selected="selected" v-model:pagination="pagination" />
            </q-card-section>

            <q-card-actions class="justify-end">
                <q-btn no-caps class="text-white bg-secondary" @click="data.cardCreate = true">Insertar</q-btn>
                <q-dialog v-model="data.cardCreate">
                    <q-card class="my-card bg-primary" flat bordered>
                        <q-item>
                            <q-item-section>
                                <q-item-label><b>Nuevo: "Riesgo tecnologico"</b></q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />

                        <q-card-section>
                            <div class="row">
                                <q-select class="col-8 q-mr-xl text-black" use-input input-debounce="0" dense outlined
                                    v-model="model" :options="options" @filter="filterFn" label="Entidad" />
                                <q-input outlined dense v-model="data.año" type="number" hint="Año" class="col-2" />
                            </div>
                        </q-card-section>

                        <q-checkbox v-model="data.sustancia" color="secondary"
                            label="Materiales o sustancias peligrosas" true-value="si" false-value="no"
                            class="full-width justify-center" />

                        <div class="q-pa-md" v-if="data.sustancia=='si'">
                            <q-table title="Tabla de Materiales y Sustancias peligrosas" :rows="data.rowsMateriales"
                                :columns="columnsMateriales" row-key="name" selection="single"
                                v-model:selected="selected" />

                            <q-btn no-caps class="text-white bg-secondary q-pa-sm q-ma-sm"
                                @click="data.cardCreateMaterial=true">Agregar</q-btn>
                            <q-dialog v-model="data.cardCreateMaterial">
                                <q-card class="my-card bg-primary">
                                    <q-card-section>
                                        <div class="text-h6">Nuevo Material o Sustancia</div>
                                    </q-card-section>

                                    <q-card-section class="q-pa-sm">
                                        <q-input outlined dense v-model="data.tipoMaterial" label="Nombre del material"
                                            class="my-input" lazy-rules :rules="alerts.inputRules" />
                                        <q-select class="col-8 q-mr-xl text-black" dense outlined
                                            v-model="data.categoria" :options="data.category" label="Categoria" />
                                        <q-input outlined dense v-model="data.cantidad" label="Cantidad" type="number"
                                            class="my-input" lazy-rules :rules="alerts.inputRules" />
                                        <q-select class="col-8 q-mr-xl text-black" dense outlined v-model="data.unidad"
                                            :options="data.unid" label="Unidad" />
                                        <q-input outlined dense v-model="data.contencion" label="Forma de contencion"
                                            class="my-input" lazy-rules :rules="alerts.inputRules" />
                                        <q-input outlined dense v-model="data.alcance" label="Alcance" class="my-input"
                                            lazy-rules :rules="alerts.inputRules" />
                                    </q-card-section>

                                    <q-separator />

                                    <q-card-actions align="right">
                                        <q-btn v-close-popup flat color="secondary" label="Crear"
                                            @click="CreateMaterial" />
                                    </q-card-actions>
                                </q-card>
                            </q-dialog>
                            <q-btn no-caps class="text-white bg-secondary q-pa-sm q-ma-sm" @click="DeleteMaterial">
                                Eliminar
                            </q-btn>
                        </div>

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
                                <q-item-label><b>Editar: "Riesgo tecnologico"</b></q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />

                        <q-card-section>
                            <div class="row">
                                <q-select class="col-8 q-mr-xl text-black" use-input input-debounce="0" dense outlined
                                    v-model="data.entidadEdit" :options="options" @filter="filterFn" label="Entidad" />
                                <q-input outlined dense v-model="data.añoEdit" type="number" hint="Año" class="col-2" />
                            </div>
                        </q-card-section>

                        <q-checkbox v-model="data.sustanciaEdit" color="secondary"
                            label="Materiales o sustancias peligrosas" true-value="si" false-value="no"
                            class="full-width justify-center" />

                        <div class="q-pa-md" v-if="data.sustanciaEdit=='si'">
                            <q-table title="Tabla de Materiales y Sustancias peligrosas" :rows="data.rowsMateriales"
                                :columns="columnsMateriales" row-key="name" selection="single"
                                v-model:selected="selected" />

                            <q-btn no-caps class="text-white bg-secondary q-pa-sm q-ma-sm"
                                @click="data.cardCreateMaterial=true">Agregar</q-btn>
                            <q-dialog v-model="data.cardCreateMaterial">
                                <q-card class="my-card bg-primary">
                                    <q-card-section>
                                        <div class="text-h6">Nuevo Material o Sustancia</div>
                                    </q-card-section>

                                    <q-card-section class="q-pa-sm">
                                        <q-input outlined dense v-model="data.tipoMaterial" label="Nombre del material"
                                            class="my-input" lazy-rules :rules="alerts.inputRules" />
                                        <q-select class="col-8 q-mr-xl text-black" dense outlined
                                            v-model="data.categoria" :options="data.category" label="Categoria" />
                                        <q-input outlined dense v-model="data.cantidad" label="Cantidad" type="number"
                                            class="my-input" lazy-rules :rules="alerts.inputRules" />
                                        <q-select class="col-8 q-mr-xl text-black" dense outlined v-model="data.unidad"
                                            :options="data.unid" label="Unidad" />
                                        <q-input outlined dense v-model="data.contencion" label="Forma de contencion"
                                            class="my-input" lazy-rules :rules="alerts.inputRules" />
                                        <q-input outlined dense v-model="data.alcance" label="Alcance" class="my-input"
                                            lazy-rules :rules="alerts.inputRules" />
                                    </q-card-section>

                                    <q-separator />

                                    <q-card-actions align="right">
                                        <q-btn v-close-popup flat color="secondary" label="Crear"
                                            @click="CreateMaterial" />
                                    </q-card-actions>
                                </q-card>
                            </q-dialog>
                            <q-btn no-caps class="text-white bg-secondary q-pa-sm q-ma-sm" @click="DeleteMaterial">
                                Eliminar
                            </q-btn>
                        </div>

                        <q-separator dark />

                        <q-card-actions class="justify-end">
                            <q-btn no-caps class="text-white bg-secondary" @click="Create">Agregar</q-btn>
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
import { ref, onMounted, reactive } from 'vue'
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
        name: 'No',
        required: true,
        label: 'No',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true
    },
    { name: 'entidad', align: 'center', label: 'Entidad', field: 'entidad', sortable: true },
    { name: 'año', label: 'Año', field: 'año', sortable: true },
    { name: 'sustancia', label: 'Sustancia', field: 'sustancia' },
]

const columnsMateriales = [
    {
        name: 'No',
        required: true,
        label: 'No',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true
    },
    { name: 'descripcion', align: 'center', label: 'Nombre del Material', field: 'descripcion', sortable: true },
    { name: 'categoria', label: 'Categoria', field: 'categoria', sortable: true },
    { name: 'cantidad', label: 'Cantidad', field: 'cantidad' },
    { name: 'unidad', label: 'Unidad', field: 'unidad' },
    { name: 'contencion', label: 'Forma de contencion', field: 'contencion' },
    { name: 'alcance', label: 'Alcance', field: 'alcance' },
]

const stringOptions = []
const model = ref([])
const options = ref(stringOptions)

let data = reactive({
    rows: [],
    rowsMateriales: [],
    categorias: [],
    category: [],
    unidades: [],
    unid: [],
    entidades: [],
    tempEntidad: [],
    año: "",
    id_Sustancia: [],
    id_Sustancias: [],
    categoria: "",
    unidad: "",
    tipoMaterial: "",
    cantidad: "",
    contencion: "",
    alcance: "",
    sustancia: "no",
    identidadEdit:"",
    sustanciaEdit:"no",
    id_ResidualEdit:[],
    entidadEdit:"",
    añoEdit:"",
    id_SustanciaEdit:[],

    cardEdit: false,
    cardCreate: false,
    cardCreateMaterial: false,

})

onMounted(() => {
    getCategorias()
    getUnidades()
    getEntidad()
    getInstalacion()
    getSustancias(data.id_Sustancia)
})

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

function editFields(params) {
  data.entidades.forEach(element => {
    if (element.nombre == selected.value[0].entidad) data.identidadEdit = { id: element.id }
  });
  if (selected.value[0].id_sustancia.length > 0) { 
    data.sustanciaEdit = "si"
    for (let index = 0; index < selected.value[0].id_sustancia.length; index++) {
      data.id_SustanciaEdit.push({id:selected.value[0].id_sustancia[index]})
      data.id_Sustancia.push(selected.value[0].id_sustancia[index])
    }
    getSustancias(data.id_Sustancia)
   }
  else { data.sustanciaEdit = "no" }
  (data.añoEdit = selected.value[0].año),
    (data.entidadEdit = selected.value[0].entidad),
    (data.cardEdit = true);
}

function CreateMaterial(params) {
    let tempCategory = ""
    let tempUnid = ""

    data.categorias.forEach(element => {
        if (element.categoria == data.categoria) tempCategory = element.id
    });

    data.unidades.forEach(element => {
        if (element.unidad == data.unidad) tempUnid = element.id
    });

    const dataRest = {
        data: {
            descripcion: data.tipoMaterial,
            categoria: tempCategory,
            cantidad: data.cantidad,
            unidad: tempUnid,
            contencion: data.contencion,
            alcance: data.alcance,
        },
    };

    const authorization = {
        headers: {
            Authorization: `Bearer ${auth.jwt}`,
        },
    };

    api
        .post("/sustancias", dataRest, authorization)
        .then(function (response) {
            //console.log(response);
            data.id_Sustancia.push(response.data.data.id)
            getSustancias(data.id_Sustancia);
            data.id_Sustancias.push({ id: response.data.data.id })
        })
        .catch(function (error) {
            console.log(error.response);
        });
}

function Create() {
    data.entidades.forEach(element => {
        if (element.nombre == model.value) {
            data.tempEntidad = { id: element.id }
        }
    });
    const dataRest = {
        data: {
            entidad: data.tempEntidad,
            anno: data.año,
            sustancias: data.id_Sustancias,
        },
    };

    const authorization = {
        headers: {
            Authorization: `Bearer ${auth.jwt}`,
        },
    };

    api
        .post("/instalacionespeligrosas", dataRest, authorization)
        .then(function (response) {
            //console.log(response);
            getInstalacion();
        })
        .catch(function (error) {
            console.log(error.response);
        });
}

function DeleteMaterial(params) {
    let tempId = selected.value[0].id
    api
        .delete(`/sustancias/${tempId}`, {
            headers: {
                Authorization: "Bearer " + auth.jwt,
            },
        })
        .then(function (response) {
            //console.log(response);
            for (let index = 0; index < data.id_Sustancia.length; index++) {
                if (tempId == data.id_Sustancia[index]) {
                    data.id_Sustancia.splice(index, 1)
                }
            }
            getSustancias(data.id_Sustancia)
        })
        .catch(function (error) {
            console.log(error);
        });
    selected.value = []
}

function Delete(params) {
    for (let index = 0; index < selected.value.length; index++) {
        api
            .delete(`/instalacionespeligrosas/${selected.value[index].id}`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
            .then(function (response) {
                getInstalacion()
            })
            .catch(function (error) {
                console.log(error);
            });

    }
    selected.value = []
}

function getCategorias(params) {
    api
        .get("/categorias", {
            headers: {
                Authorization: "Bearer " + auth.jwt,
            },
        })
        .then(function (response) {
            //console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                data.categorias.push({
                    id: response.data.data[i].id,
                    categoria: response.data.data[i].attributes.categoria,
                });
            }
            data.categorias.forEach(element => {
                data.category.push(element.categoria)
            });
        })
        .catch(function (error) {
            console.log(error.response);
        });
}

function getUnidades(params) {
    api
        .get("/unidads", {
            headers: {
                Authorization: "Bearer " + auth.jwt,
            },
        })
        .then(function (response) {
            //console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                data.unidades.push({
                    id: response.data.data[i].id,
                    unidad: response.data.data[i].attributes.unidad,
                });
            }
            data.unidades.forEach(element => {
                data.unid.push(element.unidad)
            });
        })
        .catch(function (error) {
            console.log(error.response);
        });
}

function getEntidad(params) {
    api
        .get(`/entidads`, {
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

async function getSustancias(params) {
    data.rowsMateriales = [];
    let count = 1
    for (let index = 0; index < params.length; index++) {
        await api
            .get(`/sustancias/${params[index]}?populate=%2A`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
            .then(function (response) {
                //console.log(response);
                data.rowsMateriales.push({
                    name: count,
                    id: params[index],
                    descripcion: response.data.data.attributes.descripcion,
                    categoria: response.data.data.attributes.categoria.data[0].attributes.categoria,
                    cantidad: response.data.data.attributes.cantidad,
                    unidad: response.data.data.attributes.unidad.data[0].attributes.unidad,
                    contencion: response.data.data.attributes.contencion,
                    alcance: response.data.data.attributes.alcance,
                });
                count++
            })
            .catch(function (error) {
                console.log(error.response);
            });
    }
}

async function getInstalacion(params) {
    data.rows = [];
    let count = 1
    for (let index = 1; index < 15; index++) {
        //&pagination[page]=${index}&pagination[pageSize]=100
        await api
            .get(`/instalacionespeligrosas/?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
            .then(function (response) {
                //console.log(response);

                for (let i = 0; i < response.data.data.length; i++) {
                    const element = [];
                    for (let index = 0; index < response.data.data[i].attributes.sustancias.data.length; index++) {
                        element.push(response.data.data[i].attributes.sustancias.data[index].id)
                    }
                    let temp = "";
                    //   const element = [];
                    //   for (let index = 0; index < response.data.data[i].attributes.residuals.data.length; index++) {
                    //     element.push(response.data.data[i].attributes.residuals.data[index].id)
                    //   }
                    if (response.data.data[i].attributes.entidad.data != null) {
                        if (response.data.data[i].attributes.anno == null) response.data.data[i].attributes.anno = "-"
                        if (response.data.data[i].attributes.sustancias.data.length == 0) temp = "no"
                        else temp = "si"
                        data.rows.push({
                            name: count,
                            entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                            año: response.data.data[i].attributes.anno,
                            sustancia: temp,
                            id_sustancia: element,
                            id: response.data.data[i].id
                        });
                    }
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

