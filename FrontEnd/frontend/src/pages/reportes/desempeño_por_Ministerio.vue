<template>
    <div class="col-12">
        <div  class="text-center q-mt-xl" v-if="auth.printMode == true">
            <q-img src="~assets/Layout_/GTE-BH_print.png" class="banner" />
        </div>
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Plan de medidas" dense :rows="data.rows"
                    :columns="columns" row-key="name" v-model:pagination="pagination" wrap-cells>
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
                                <q-btn flat label="PDesempeño ambiental" class="col-1  q-pa-xs" />
                            </div>
                            <div class="col-2">
                                <q-select class="text-black q-pa-xs" dense outlined v-model="data.opcion"
                                    :options="data.opcions" label="Busqueda por:" />
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
                            <div>
                                <q-btn color="secondary" icon-right="archive" class="col-2 q-pa-xs" no-caps
                                    @click="exportTable" />
                            </div>
                        </div>
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
    titulo:"Desempeño ambiental ",
    rows: [],
    organismos: [],
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

function wrapCsvValue(val, formatFn, row) {
    let formatted = formatFn !== void 0
        ? formatFn(val, row)
        : val

    formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted)

    formatted = formatted.split('"').join('""')
    /**
     * Excel accepts \n and \r in strings, but some other CSV parsers do not
     * Uncomment the next two lines to escape new lines
     */
    // .split('\n').join('\\n')
    // .split('\r').join('\\r')

    return `"${formatted}"`
}

function exportTable() {
    // naive encoding to csv format
    const content = [columns.map(col => wrapCsvValue(col.label))].concat(
        data.rows.map(row => columns.map(col => wrapCsvValue(
            typeof col.field === 'function'
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
            col.format,
            row
        )).join(','))
    ).join('\r\n')

    const status = exportFile(
        'table-export.csv',
        content,
        'text/csv'
    )

    if (status !== true) {
        $q.notify({
            message: 'Browser denied file download...',
            color: 'negative',
            icon: 'warning'
        })
    }
}

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
                console.log(error.response);
            });
    }
}

async function getDesempeño(params) {
    data.rows = [];
    let count = 1
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
                            if (data.rows[i]) {
                                Object.keys(data.rows[i]).forEach(function (key) {
                                    if (data.rows[i][key] === 1) {
                                        data.rows[i][key] = "si"
                                    } else if (data.rows[i][key] === 0) {
                                        data.rows[i][key] = "no"
                                    }
                                })
                            }
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
                            else if(data.cantidad == 0){
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
                            if (data.rows[i]) {
                                Object.keys(data.rows[i]).forEach(function (key) {
                                    if (data.rows[i][key] === 1) {
                                        data.rows[i][key] = "si"
                                    } else if (data.rows[i][key] === 0) {
                                        data.rows[i][key] = "no"
                                    }
                                })
                            }
                            count++
                        }
                    }

                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    console.log(data.rows);
}

</script>

