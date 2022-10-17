<template>
    <div>
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Riesgo Tecnologico" :rows="data.rows" :columns="columns"
                    row-key="name" :selected-rows-label="getSelectedString" selection="multiple"
                    v-model:selected="selected" v-model:pagination="pagination" />
            </q-card-section>

            <q-card-actions class="justify-end">
                <q-btn no-caps class="text-white bg-secondary" @click="data.cardCreate = true">Insertar</q-btn>
                <q-dialog v-model="data.cardCreate">
                    <q-card class="my-card bg-primary" flat bordered>
                        <q-item>
                            <q-item-section>
                                <q-item-label><b>Nuevo: "Nuevo riesgo tecnologico"</b></q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />

                        <q-card-section>
                            <div class="row">
                                <q-select class="col-8 q-mr-xl text-black" use-input input-debounce="0" dense outlined
                                    v-model="model" :options="options" @filter="filterFn" label="Entidad" />
                                <q-input outlined dense v-model="data.año" type="number" hint="Año"
                                    class="col-2" />
                            </div>
                        </q-card-section>

                        <q-checkbox v-model="data.aprovechamiento" color="secondary"
                            label="Materiales o sustancias peligrosas" true-value="si" false-value="no"
                            class="full-width justify-center" />

                        <div class="q-pa-md" v-if="data.aprovechamiento=='si'">
                            <q-table title="Tabla de Materiales y Sustancias peligrosas" :rows="data.rowsMateriales"
                                :columns="columnsMateriales" row-key="name" selection="single"
                                v-model:selected="selected" />

                            <q-btn no-caps class="text-white bg-secondary q-pa-sm q-ma-sm"
                                @click="data.cardCreate=true">Agregar</q-btn>
                            <q-dialog v-model="data.cardCreateMaterial">
                                <q-card class="my-card bg-primary">
                                    <q-card-section>
                                        <div class="text-h6">Nuevo Material o Sustancia</div>
                                    </q-card-section>

                                    <q-card-section class="q-pa-sm">
                                        <q-input outlined dense v-model="data.tipoResidual" label="Nombre del material"
                                            class="my-input" lazy-rules :rules="alerts.inputRules" />
                                        <q-select class="col-8 q-mr-xl text-black" dense outlined
                                            v-model="data.categoria" :options="data.category" label="Categoria" />
                                        <q-input outlined dense v-model="data.cantidadGenerada" label="Cantidad"
                                            type="number" class="my-input" lazy-rules :rules="alerts.inputRules" />
                                        <q-select class="col-8 q-mr-xl text-black" dense outlined v-model="data.unidad"
                                            :options="data.unid" label="Unidad" />
                                        <q-input outlined dense v-model="data.disposicionFinal"
                                            label="Forma de contencion" class="my-input" lazy-rules
                                            :rules="alerts.inputRules" />
                                        <q-input outlined dense v-model="data.aprovechamiento" label="Alcance"
                                            class="my-input" lazy-rules :rules="alerts.inputRules" />
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
    rowsPerPage: 10,
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
    tempEntidad:[],
    año:"",
    id_Sustancia:[]
})

onMounted(() => {
    getCategorias()
    getUnidades()
    getEntidad()
    getInstalacion()
    getSustancias()
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

function Create() {
    console.log(model.value);
  data.entidades.forEach(element => {
    if (element.nombre == model.value) {
        data.tempEntidad = { id: element.id }
        console.log("Entra", model.value[0]);
    }
  });
  const dataRest = {
    data: {
        entidad: data.tempEntidad,
        anno: data.año,
        sustancias: data.id_Sustancia,
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
      console.log(response);
      getInstalacion();
    })
    .catch(function (error) {
      console.log(error.response);
    });
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
            console.log(response);
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
            console.log(response);
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
            console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
                data.entidades.push({
                    nombre: response.data.data[i].attributes.entidad,
                    id: response.data.data[i].id
                }
                )
            }
            console.log(data.entidades);
            data.entidades.forEach(element => {
                stringOptions.push(element.nombre)
            });
        }).catch(function (error) {
            console.log(error.response);
        });
}

async function getSustancias(params) {
    data.rows = [];
    let count = 1
    for (let index = 1; index < 15; index++) {
        await api
            .get(`/sustancias?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100`, {
                headers: {
                    Authorization: "Bearer " + auth.jwt,
                },
            })
            .then(function (response) {
                console.log(response);

                for (let i = 0; i < response.data.data.length; i++) {
                    let temp = "";
                    //   const element = [];
                    //   for (let index = 0; index < response.data.data[i].attributes.residuals.data.length; index++) {
                    //     element.push(response.data.data[i].attributes.residuals.data[index].id)
                    //   }
                    // if(response.data.data[i].attributes.sustancias.data.length==0) temp="no"
                    // else temp="si"
                    data.rowsMateriales.push({
                        name: count,
                        descripcion: response.data.data[i].attributes.descripcion,
                        categoria: response.data.data[i].attributes.categoria.data[0].attributes.categoria,
                        cantidad: response.data.data[i].attributes.cantidad,
                        unidad: response.data.data[i].attributes.unidad.data[0].attributes.unidad,
                        contencion: response.data.data[i].attributes.contencion,
                        alcance: response.data.data[i].attributes.alcance,
                    });
                    count++
                }
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
                console.log(response);

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
                    if (response.data.data[i].attributes.entidad.data!=null) {
                    if(response.data.data[i].attributes.anno==null) response.data.data[i].attributes.anno="-"
                    if (response.data.data[i].attributes.sustancias.data.length == 0) temp = "no"
                    else temp = "si"
                    data.rows.push({
                        name: count,
                        entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
                        año: response.data.data[i].attributes.anno,
                        sustancia: temp,
                        sustancia: element,
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