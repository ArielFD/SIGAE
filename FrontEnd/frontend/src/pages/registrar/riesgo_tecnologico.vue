<template>
    <div>
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Riesgo Tecnologico" dense :rows="data.rows"
                    :columns="columns" row-key="name" :selected-rows-label="getSelectedString" selection="multiple"
                    v-model:selected="selected" v-model:pagination="pagination" wrap-cells/>
            </q-card-section>

            <q-card-actions class="justify-end">
                <q-btn no-caps class="text-white bg-secondary"
                    @click="data.cardCreate = true; data.rowsMateriales = [],clear()">Insertar</q-btn>
                <q-dialog v-model="data.cardCreate" persistent>
                    <q-card class="my-card bg-primary" flat bordered>
                        <q-item>
                            <q-item-section>
                                <q-item-label><b>Nuevo: "Riesgo tecnologico"</b></q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />
                        <form @submit.prevent.stop="onCreate">
                            <q-card-section>
                                <div class="row">
                                    <q-select class="col-8 q-mr-xl text-black" use-input input-debounce="0" dense
                                        outlined v-model="model" :options="options" @filter="filterFn" label="Entidad"
                                        lazy-rules :rules="alerts.inputRules" ref="modelo" />
                                    <q-input outlined dense v-model="data.año" type="number" hint="Año" class="col-2" />
                                </div>
                            </q-card-section>

                            <q-checkbox v-model="data.sustancia" color="secondary"
                                label="Materiales o sustancias peligrosas" true-value="si" false-value="no"
                                class="full-width justify-center" />

                            <div class="q-pa-md" v-if="data.sustancia == 'si'">
                                <q-table title="Tabla de Materiales y Sustancias peligrosas" :rows="data.rowsMateriales"
                                    :columns="columnsMateriales" row-key="name" selection="single"
                                    v-model:selected="selected" />

                                <q-btn no-caps class="text-white bg-secondary q-pa-sm q-ma-sm"
                                    @click="data.cardCreateMaterial = true">Agregar</q-btn>
                                <q-dialog v-model="data.cardCreateMaterial">
                                    <q-card class="my-card bg-primary" style="width:375px">
                                        <q-card-section>
                                            <div class="text-h6">Nuevo Material o Sustancia</div>
                                        </q-card-section>
                                        <form @submit.prevent.stop="onCreateMaterial">
                                            <q-card-section class="row q-pa-sm">
                                                <q-input outlined dense v-model="data.tipoMaterial"
                                                    label="Nombre del material" class="col-6 q-pa-sm text-black"
                                                    lazy-rules :rules="alerts.inputRules" ref="tipoMaterial" />
                                                <q-select class="col-6 q-pa-sm text-black" dense outlined
                                                    v-model="data.categoria" :options="data.category" label="Categoria"
                                                    lazy-rules :rules="alerts.inputRules" ref="categoria" />
                                                <q-input outlined dense v-model="data.cantidad" label="Cantidad"
                                                    type="number" class="col-6 q-pa-sm text-black" lazy-rules
                                                    :rules="alerts.inputRules" ref="cantidad" />
                                                <q-select class="col-6 q-pa-sm text-black" dense outlined
                                                    v-model="data.unidad" :options="data.unid" label="Unidad" lazy-rules
                                                    :rules="alerts.inputRules" ref="unidad" />
                                                <q-input outlined dense v-model="data.contencion"
                                                    label="Forma de contencion" class="col-12 q-pa-sm text-black"
                                                    lazy-rules :rules="alerts.inputRules" ref="contencion" />
                                                <q-input outlined dense v-model="data.alcance" label="Alcance"
                                                    class="col-12 q-pa-sm text-black" lazy-rules
                                                    :rules="alerts.inputRules" ref="alcance" />
                                            </q-card-section>

                                            <q-separator />

                                            <q-card-actions align="right">
                                                <q-btn flat color="secondary" label="Crear" type="submit" />
                                            </q-card-actions>
                                        </form>
                                    </q-card>
                                </q-dialog>
                                <q-btn no-caps class="text-white bg-secondary q-pa-sm q-ma-sm" @click="DeleteMaterial">
                                    Eliminar
                                </q-btn>
                            </div>

                            <q-separator dark />

                            <q-card-actions class="justify-end">
                                <q-btn no-caps class="text-white bg-secondary" type="submit">Agregar</q-btn>
                                <q-btn no-caps class="text-white bg-secondary" @click="clear" v-close-popup>Cerrar</q-btn>
                            </q-card-actions>
                        </form>
                    </q-card>
                </q-dialog>
                <q-btn no-caps class="text-white bg-secondary" @click="editFields">Editar</q-btn>
                <q-dialog v-model="data.cardEdit" persistent>
                    <q-card class="my-card bg-primary" flat bordered>
                        <q-item>
                            <q-item-section>
                                <q-item-label><b>Editar: "Riesgo tecnologico"</b></q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />
                        <form @submit.prevent.stop="onEdit">
                            <q-card-section>
                                <div class="row">
                                    <q-select class="col-8 q-mr-xl text-black" use-input input-debounce="0" dense
                                        outlined v-model="data.entidadEdit" :options="options" @filter="filterFn"
                                        label="Entidad" lazy-rules :rules="alerts.inputRules" ref="modeloEdit" />
                                    <q-input outlined dense v-model="data.añoEdit" type="number" hint="Año"
                                        class="col-2" />
                                </div>
                            </q-card-section>

                            <q-checkbox v-model="data.sustanciaEdit" color="secondary"
                                label="Materiales o sustancias peligrosas" true-value="si" false-value="no"
                                class="full-width justify-center" />

                            <div class="q-pa-md" v-if="data.sustanciaEdit == 'si'">
                                <q-table title="Tabla de Materiales y Sustancias peligrosas" :rows="data.rowsMateriales"
                                    :columns="columnsMateriales" row-key="name" selection="single"
                                    v-model:selected="selected" />

                                <q-btn no-caps class="text-white bg-secondary q-pa-sm q-ma-sm"
                                    @click="data.cardCreateMaterial = true">Agregar</q-btn>
                                <q-dialog v-model="data.cardCreateMaterial">
                                    <q-card class="my-card bg-primary" style="width:375px">
                                        <q-card-section>
                                            <div class="text-h6">Nuevo Material o Sustancia</div>
                                        </q-card-section>
                                        <form @submit.prevent.stop="onCreateMaterial">
                                            <q-card-section class="row q-pa-sm">
                                                <q-input outlined dense v-model="data.tipoMaterial"
                                                    label="Nombre del material" class="col-6 q-pa-sm text-black"
                                                    lazy-rules :rules="alerts.inputRules" ref="tipoMaterial" />
                                                <q-select class="col-6 q-pa-sm text-black" dense outlined
                                                    v-model="data.categoria" :options="data.category" label="Categoria"
                                                    lazy-rules :rules="alerts.inputRules" ref="categoria" />
                                                <q-input outlined dense v-model="data.cantidad" label="Cantidad"
                                                    type="number" class="col-6 q-pa-sm text-black" lazy-rules
                                                    :rules="alerts.inputRules" ref="cantidad" />
                                                <q-select class="col-6 q-pa-sm text-black" dense outlined
                                                    v-model="data.unidad" :options="data.unid" label="Unidad" lazy-rules
                                                    :rules="alerts.inputRules" ref="unidad" />
                                                <q-input outlined dense v-model="data.contencion"
                                                    label="Forma de contencion" class="col-12 q-pa-sm text-black"
                                                    lazy-rules :rules="alerts.inputRules" ref="contencion" />
                                                <q-input outlined dense v-model="data.alcance" label="Alcance"
                                                    class="col-12 q-pa-sm text-black" lazy-rules
                                                    :rules="alerts.inputRules" ref="alcance" />
                                            </q-card-section>

                                            <q-separator />

                                            <q-card-actions align="right">
                                                <q-btn flat color="secondary" label="Crear" type="submit" />
                                            </q-card-actions>
                                        </form>
                                    </q-card>
                                </q-dialog>
                                <q-btn no-caps class="text-white bg-secondary q-pa-sm q-ma-sm" @click="DeleteMaterial">
                                    Eliminar
                                </q-btn>
                            </div>

                            <q-separator dark />

                            <q-card-actions class="justify-end">
                                <q-btn no-caps class="text-white bg-secondary" type="submit">Editar</q-btn>
                                <q-btn no-caps class="text-white bg-secondary" @click="clear" v-close-popup>Cerrar</q-btn>
                            </q-card-actions>
                        </form>
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
import { useQuasar } from "quasar";
import { useDataStore } from "src/stores/data-store";

const dataStore = useDataStore();
const pagination = ref({
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 17,
});

const $q = useQuasar();
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

const modelo = ref(null);
const modeloEdit = ref(null);

const categoria = ref(null);
const unidad = ref(null);
const tipoMaterial = ref(null);
const cantidad = ref(null);
const contencion = ref(null);
const alcance = ref(null);

let data = reactive({
    fecha_actual: new Date(),
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
    identidadEdit: "",
    sustanciaEdit: "no",
    id_ResidualEdit: [],
    entidadEdit: "",
    añoEdit: "",
    id_SustanciaEdit: [],

    cardEdit: false,
    cardCreate: false,
    cardCreateMaterial: false,

    temp:null
})

function clear(params) {
    data.año= data.fecha_actual,
    data.categoria= "",
    data.unidad= "",
    data.tipoMaterial= "",
    data.cantidad= "",
    data.contencion= "",
    data.alcance= "",
    data.sustancia= "no",
    model.value = []
}

onMounted(() => {
    getYear()
    getCategorias()
    getUnidades()
    getEntidad()
    getInstalacion()
    getSustancias(data.id_Sustancia)
})

function getYear(params) {
    data.fecha_actual = data.fecha_actual.getFullYear()
    data.año = data.fecha_actual
}

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
    data.id_Sustancia = []
    data.entidades.forEach(element => {
        if (element.nombre == selected.value[0].entidad) data.identidadEdit = { id: element.id }
    });
    if (selected.value[0].id_sustancia.length > 0) {
        data.sustanciaEdit = "si"
        for (let index = 0; index < selected.value[0].id_sustancia.length; index++) {
            data.id_SustanciaEdit.push({ id: selected.value[0].id_sustancia[index] })
            data.id_Sustancia.push(selected.value[0].id_sustancia[index])
        }
        getSustancias(data.id_Sustancia)
    }
    else { data.sustanciaEdit = "no" }
    (data.añoEdit = selected.value[0].año),
        (data.entidadEdit = selected.value[0].entidad),
        (data.cardEdit = true);
        (data.temp=selected.value[0].id)
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
            // console.log(response);
            data.cardCreateMaterial = false
            alerts.alerts[1].message = "Material creado";
            $q.notify(alerts.alerts[1]);
            data.id_Sustancia.push(response.data.data.id)
            data.id_Sustancias.push({ id: response.data.data.id })
            getSustancias(data.id_Sustancia);
        })
        .catch(function (error) {
            alerts.alerts[0].message = "Fallo creando el Material";
            $q.notify(alerts.alerts[0]);
            console.log(error);
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
            ////console.log(response);
            data.cardCreate = false
            alerts.alerts[1].message = "Riesgo tecnologico creado";
            $q.notify(alerts.alerts[1]);
            auth.postTraza("Riesgo tecnologico creado", "Satisfactorio")
            data.rowsMateriales = [];
            getInstalacion();
        })
        .catch(function (error) {
            alerts.alerts[0].message = "Fallo creando el Riesgo tecnologico";
            $q.notify(alerts.alerts[0]);
            auth.postTraza("Riesgo tecnologico creado", "Fallo")
            console.log(error);
        });
}

function Edit() {
    data.id_Sustancias = []
    data.rowsMateriales.forEach(element => {
        if(element.id) data.id_Sustancias.push(element.id)
    });
    const dataRest = {
        data: {
            // entidad: data.tempEntidad,
            // anno: data.año,
            sustancias: data.id_Sustancias,
        },
    };

    const authorization = {
        headers: {
            Authorization: `Bearer ${auth.jwt}`,
        },
    };

    api
        .put(`/instalacionespeligrosas/${data.temp}`, dataRest, authorization)
        .then(function (response) {
            // console.log(response);
            data.cardEdit = false
            alerts.alerts[1].message = "Riesgo tecnologico editado";
            $q.notify(alerts.alerts[1]);
            auth.postTraza("Riesgo tecnologico editado", "Satisfactorio")
            data.rowsMateriales = [];
            getInstalacion();
        })
        .catch(function (error) {
            alerts.alerts[0].message = "Fallo editando el Riesgo tecnologico";
            $q.notify(alerts.alerts[0]);
            auth.postTraza("Riesgo tecnologico editado", "Fallo")
            console.log(error);
        });

    selected.value = []
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
            ////console.log(response);

            for (let index = 0; index < data.id_Sustancia.length; index++) {
                if (tempId == data.id_Sustancia[index]) {
                    data.id_Sustancia.splice(index, 1)
                }
            }
            alerts.alerts[1].message = "Material eliminado";
            $q.notify(alerts.alerts[1]);
            auth.postTraza("Material eliminado", "Satisfactorio")
            getSustancias(data.id_Sustancia)
        })
        .catch(function (error) {
            alerts.alerts[0].message = "Fallo eliminando el Material";
            $q.notify(alerts.alerts[0]);
            auth.postTraza("Material eliminado", "Fallo")
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
                alerts.alerts[1].message = "Riesgo tecnologico eliminado";
                $q.notify(alerts.alerts[1]);
            })
            .catch(function (error) {
                alerts.alerts[0].message = "Fallo eliminando el Riesgo tecnologico";
                $q.notify(alerts.alerts[0]);
                console.log(error);
            });

    }
    getInstalacion()
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
            ////console.log(response);
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
            console.log(error);
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
            ////console.log(response);
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
            console.log(error);
        });
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
            console.log(error);
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
                ////console.log(response);
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
                console.log(error);
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
                ////console.log(response);

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

function onCreate() {
    data.id_Sustancia = []
    data.rowsMateriales = [];
    modelo.value.validate();

    if (modelo.value.hasError) {
        alerts.alerts[0].message = "Rellene todo los campos obligatorios";
        $q.notify(alerts.alerts[0]);
        // form has error
    }
    else {
        Create();
    }
}

function onCreateMaterial() {
    categoria.value.validate();
    unidad.value.validate();
    tipoMaterial.value.validate();
    cantidad.value.validate();
    contencion.value.validate();
    alcance.value.validate();
    if (categoria.value.hasError || unidad.value.hasError || tipoMaterial.value.hasError || cantidad.value.hasError || contencion.value.hasError || alcance.value.hasError) {
        alerts.alerts[0].message = "Rellene todo los campos obligatorios";
        $q.notify(alerts.alerts[0]);
        // form has error
    }
    else {
        CreateMaterial();
    }
}

function onEdit() {
    modeloEdit.value.validate();
    
    if (modeloEdit.value.hasError) {
        alerts.alerts[0].message = "Rellene todo los campos obligatorios";
        $q.notify(alerts.alerts[0]);
        // form has error
    } else {
        Edit();
    }
}
</script>

