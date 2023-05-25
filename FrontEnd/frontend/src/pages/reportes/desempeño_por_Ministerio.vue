<template>
    <div class="col-12">
        <div class="text-center q-mt-xl" v-if="auth.printMode == true">
            <q-img src="~assets/Layout_/GTE-BH_print.png" class="banner" />
        </div>
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Plan de medidas" dense :rows="data.rows" :columns="columns"
                    row-key="name" v-model:pagination="pagination" wrap-cells :hide-bottom="auth.printMode">
                    <template v-slot:top>
                        <div style="width: 100%" class="row justify-center" v-if="auth.printMode == true">
                            <div class="col-3 text-h6">
                                <q-btn flat :label="data.titulo + data.fecha_actual" class="col-1  q-pa-xs"
                                    @click="auth.printMode = !auth.printMode" />
                            </div>
                        </div>
                        <div style="width: 100%" class="row justify-between" v-else>
                            <div class="col-3 text-h6" v-if="auth.jwt">
                                <q-btn flat label="Desempeño ambiental" icon="print" class="col-1  q-pa-xs"
                                    @click="auth.printMode = !auth.printMode" />
                            </div>
                            <div class="col-3 text-h6" v-else>
                                <q-btn flat label="Desempeño ambiental" class="col-1  q-pa-xs" />
                            </div>
                            <div class="col-2">
                                <q-select class="text-black q-pa-xs" dense outlined v-model="data.opcion"
                                    :options="data.opcions" label="Búsqueda por:" />
                            </div>
                            <div class="col-3" v-if="data.opcion == 'OACE'">
                                <q-select class="text-black q-pa-xs" use-input input-debounce="0" dense outlined
                                    v-model="modelOrganismo" :options="optionsOrganismo" @filter="filterFnOrganismo"
                                    label="OACE" />
                            </div>
                            <div class="col-3" v-if="data.opcion == 'OSDE'">
                                <q-select class="text-black q-pa-xs" use-input input-debounce="0" dense outlined
                                    v-model="modelOsde" :options="optionsOsde" @filter="filterFnOsde" label="OSDE" />
                            </div>
                            <div class="col-3">
                                <div class="row justify-center">
                                    <q-input outlined dense v-model="data.fecha_actual" type="number" label="Año"
                                        class="col-4 text-black q-pa-xs" />
                                    <q-input outlined dense v-model="data.cantidad" type="number" label="Cantidad"
                                        class="col-4 text-black q-pa-xs" />
                                    <q-btn flat round color="secondary" icon="search" class="col-2 text-black q-pa-xs"
                                        @click="getDesempeño()" />
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-slot:bottom-row>
                        <q-tr>
                            <q-td>
                                Total
                            </q-td>
                            <q-td>
                            </q-td>
                            <q-td>
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.coordinador}}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.diagnostico }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.politica }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.indicadores }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.plan }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.legislacion }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.capacitacion }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.acciones }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.programa }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.recurso }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.aprovechamiento }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.sistema }}
                            </q-td>
                            <q-td>
                                {{ data.rowTotal.carga }}
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
import { exportFile, useQuasar } from 'quasar'

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

const stringOptionsOrganismo = []
const modelOrganismo = ref([])
const optionsOrganismo = ref(stringOptionsOrganismo)

const stringOptionsOsde = []
const modelOsde = ref([])
const optionsOsde = ref(stringOptionsOsde)

let data = reactive({
    titulo: "Desempeño ambiental ",
    rows: [],
    organismos: [],
    rowTotal: {},
    osdes: [],
    cantidad: 0,
    fecha_actual: new Date(),

    opcion: "",
    opcions: ["OACE", "OSDE"],

});

onMounted(() => {
    getYear(),
        getOrganismos(),
        getOSDE()
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
                console.log(error);
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
                console.log(error);
            });
    }
}

async function getDesempeño(params) {
    data.rows = [];
    let count = 1
    data.rowTotal = {
        coordinador: 0,
        diagnostico: 0,
        politica: 0,
        indicadores: 0,
        plan: 0,
        legislacion: 0,
        capacitacion: 0,
        acciones: 0,
        programa: 0,
        recurso: 0,
        aprovechamiento: 0,
        sistema: 0,
        carga: 0
    }
    for (let index = 1; index < 10; index++) {
        await api
            .get(`/desempenoambientals?populate[entidad][populate][0]=organismo&populate[entidad][populate][1]=osde&pagination[page]=${index}&pagination[pageSize]=100&sort[0]=anno%3Adesc&filters[anno][$containsi]=${data.fecha_actual}`)
            .then(function (response) {
                //console.log(response);
                for (let i = 0; i < response.data.data.length; i++) {
                    if (response.data.data[i].attributes.entidad.data.length > 0) {
                        if (data.opcion == "OACE" && response.data.data[i].attributes.entidad.data[0].attributes.organismo.data.length > 0 && response.data.data[i].attributes.entidad.data[0].attributes.organismo.data[0].attributes.organismo == modelOrganismo.value) {
                            if (data.cantidad != 0 && response.data.data[i].attributes.disminucion_carga_contaminante + response.data.data[i].attributes.exist_sistem_tratamiento + response.data.data[i].attributes.aprovechamiento_economico + response.data.data[i].attributes.exist_recurso_financiero + response.data.data[i].attributes.exist_program_gestionambiental + response.data.data[i].attributes.exist_accionespml + response.data.data[i].attributes.exist_plan_capacitacion + response.data.data[i].attributes.exist_legislacion + response.data.data[i].attributes.exist_plan_accion + response.data.data[i].attributes.exist_coordinador + response.data.data[i].attributes.exist_diagnostico + response.data.data[i].attributes.exist_politica + response.data.data[i].attributes.exist_indicadores == data.cantidad) {
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
                            }
                            else if (data.cantidad == 0) {
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
                            }
                            data.rowTotal.coordinador=data.rowTotal.coordinador+response.data.data[i].attributes.exist_coordinador
                            data.rowTotal.diagnostico=data.rowTotal.diagnostico+response.data.data[i].attributes.exist_diagnostico
                            data.rowTotal.politica=data.rowTotal.politica+response.data.data[i].attributes.exist_politica
                            data.rowTotal.indicadores=data.rowTotal.indicadores+response.data.data[i].attributes.exist_indicadores
                            data.rowTotal.plan=data.rowTotal.plan+response.data.data[i].attributes.exist_plan_accion
                            data.rowTotal.legislacion=data.rowTotal.legislacion+response.data.data[i].attributes.exist_legislacion
                            data.rowTotal.capacitacion=data.rowTotal.capacitacion+response.data.data[i].attributes.exist_plan_capacitacion
                            data.rowTotal.acciones=data.rowTotal.acciones+response.data.data[i].attributes.exist_accionespml
                            data.rowTotal.programa=data.rowTotal.programa+response.data.data[i].attributes.exist_program_gestionambiental
                            data.rowTotal.recurso=data.rowTotal.recurso+response.data.data[i].attributes.exist_recurso_financiero
                            data.rowTotal.aprovechamiento=data.rowTotal.coordinador+response.data.data[i].attributes.aprovechamiento_economico
                            data.rowTotal.sistema=data.rowTotal.sistema+response.data.data[i].attributes.exist_sistem_tratamiento
                            data.rowTotal.carga=data.rowTotal.carga+response.data.data[i].attributes.disminucion_carga_contaminante
                            count++
                        } else if (data.opcion == 'OSDE' && response.data.data[i].attributes.entidad.data[0].attributes.osde.data != null && response.data.data[i].attributes.entidad.data[0].attributes.osde.data.attributes.nombre == modelOsde.value) {
                            if (response.data.data[i].attributes.entidad.data[0].attributes.organismo.data.length == 0) response.data.data[i].attributes.entidad.data[0].attributes.organismo.data[0] = { attributes: { organismo: "-" } }
                            if (data.cantidad != 0 && response.data.data[i].attributes.disminucion_carga_contaminante + response.data.data[i].attributes.exist_sistem_tratamiento + response.data.data[i].attributes.aprovechamiento_economico + response.data.data[i].attributes.exist_recurso_financiero + response.data.data[i].attributes.exist_program_gestionambiental + response.data.data[i].attributes.exist_accionespml + response.data.data[i].attributes.exist_plan_capacitacion + response.data.data[i].attributes.exist_legislacion + response.data.data[i].attributes.exist_plan_accion + response.data.data[i].attributes.exist_coordinador + response.data.data[i].attributes.exist_diagnostico + response.data.data[i].attributes.exist_politica + response.data.data[i].attributes.exist_indicadores == data.cantidad) {
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
                            }
                            else if (data.cantidad == 0) {
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
                            }
                            data.rowTotal.coordinador=data.rowTotal.coordinador+response.data.data[i].attributes.exist_coordinador
                            data.rowTotal.diagnostico=data.rowTotal.diagnostico+response.data.data[i].attributes.exist_diagnostico
                            data.rowTotal.politica=data.rowTotal.politica+response.data.data[i].attributes.exist_politica
                            data.rowTotal.indicadores=data.rowTotal.indicadores+response.data.data[i].attributes.exist_indicadores
                            data.rowTotal.plan=data.rowTotal.plan+response.data.data[i].attributes.exist_plan_accion
                            data.rowTotal.legislacion=data.rowTotal.legislacion+response.data.data[i].attributes.exist_legislacion
                            data.rowTotal.capacitacion=data.rowTotal.capacitacion+response.data.data[i].attributes.exist_plan_capacitacion
                            data.rowTotal.acciones=data.rowTotal.acciones+response.data.data[i].attributes.exist_accionespml
                            data.rowTotal.programa=data.rowTotal.programa+response.data.data[i].attributes.exist_program_gestionambiental
                            data.rowTotal.recurso=data.rowTotal.recurso+response.data.data[i].attributes.exist_recurso_financiero
                            data.rowTotal.aprovechamiento=data.rowTotal.aprovechamiento.coordinador+response.data.data[i].attributes.aprovechamiento_economico
                            data.rowTotal.sistema=data.rowTotal.sistema+response.data.data[i].attributes.exist_sistem_tratamiento
                            data.rowTotal.carga=data.rowTotal.carga+response.data.data[i].attributes.disminucion_carga_contaminante
                            count++
                        }
                    }

                }
                for (let i = 0; i < data.rows.length; i++) {
                    Object.keys(data.rows[i]).forEach(function (key) {
                        if (data.rows[i][key] === 1) {
                            data.rows[i][key] = "si"
                        } else if (data.rows[i][key] === 0) {
                            data.rows[i][key] = "no"
                        }
                    })


                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

</script>

<style scoped>
.q-td {
    text-align: center;
}
</style>