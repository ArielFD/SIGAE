<template>
  <div class="col-12">
    <q-slide-transition duration="1000" appear="true">
      <q-card class="my-card q-ma-md bg-primary" bordered>
        <q-card-section>
          <q-table class="my-sticky-header-table" :rows="data.rows" :columns="columns" dense row-key="name"
            :selected-rows-label="getSelectedString" selection="single" v-model:selected="selected"
            v-model:pagination="pagination" :filter="filter" wrap-cells>
            <template v-slot:top>
              <div style="width: 100%" class="row justify-between">
                <div class="col-3 text-h6">Actas de Control</div>
                <div class="col-4">
                  <div class="row justify-center">
                    <q-input outlined dense v-model="data.fecha_actual" type="number" label="Año" class="col-3" />
                    <q-btn flat round color="secondary" icon="search" class="col-1" @click="getActacontrol()" />
                  </div>
                </div>
                <div class="col-6" style="max-width: 300px">
                  <q-input dense debounce="400" color="primary" v-model="filter">
                    <template v-slot:prepend v-if="filter">
                      <q-btn flat round color="secondary" icon="close" class="col-1" @click="filter = ''" />
                    </template>
                    <template v-slot:prepend v-else>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </div>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions class="justify-end">
          <q-btn no-caps class="text-white bg-secondary"
            @click="data.cardCreate = true; clear(); data.id_Residual = []">Insertar</q-btn>
          <q-dialog v-model="data.cardCreate" persistent>
            <q-card class="my-card bg-primary" flat bordered style="width: 100%">
              <q-item>
                <q-item-section>
                  <q-item-label><b>Nuevo: "Acta de Control"</b></q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />
              <form @submit.prevent.stop="onCreate">
                <q-card-section >
                  <div class="row">
                    <q-select class="col-8 q-mr-xl text-black" use-input input-debounce="0" dense outlined v-model="model"
                      :options="options" @filter="filterFn" label="Entidad" style="max-width: 50%" lazy-rules
                      :rules="alerts.inputRules" ref="modelo" />
                    <q-input outlined dense v-model="data.fechavisita" type="date"  lazy-rules
                      :rules="alerts.inputRules" ref="fechavisita" />
                  </div>
                  <q-input outlined dense v-model="data.atendido_por" label="Atendido por" 
                    style="max-width: 80%" lazy-rules :rules="alerts.inputRules" ref="atendido_por" />
                  <q-input outlined dense v-model="data.comision_control" label="Comisión" style="max-width: 80%"
                    lazy-rules :rules="alerts.inputRules" ref="comision_control" />
                  <div >Sistema de tratamiento:</div>
                  <div>
                    <q-radio v-model="data.tratamiento" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                      val="si" label="Si" color="secondary" />
                    <q-radio v-model="data.tratamiento" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                      val="no" label="No" color="secondary" />
                  </div>
                  <div style="max-width: 100%" v-if="data.tratamiento == 'si'">
                    <p class="q-pl-md q-pt-sm"> Estado técnico</p>
                    <div>
                      <q-item>
                        <q-item-section avatar style="width: 150px;">Idoneidad:</q-item-section>
                        <q-item-section>
                          <div>
                            <q-radio v-model="data.idoniedad" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                              val="si" label="Si" color="secondary" />
                            <q-radio v-model="data.idoniedad" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                              val="no" label="No" color="secondary" />
                          </div>
                        </q-item-section>
                      </q-item>
                    </div>
                    <div>
                      <q-item>
                        <q-item-section avatar style="width: 150px;">Estado tecnico:</q-item-section>
                        <q-item-section>
                          <div class="row">
                            <q-radio v-model="data.estadoTecnico" checked-icon="task_alt"
                              unchecked-icon="panorama_fish_eye" val="mal" label="Mal" color="secondary" />
                            <q-radio v-model="data.estadoTecnico" checked-icon="task_alt"
                              unchecked-icon="panorama_fish_eye" val="regular" label="Regular" color="secondary" />
                            <q-radio v-model="data.estadoTecnico" checked-icon="task_alt"
                              unchecked-icon="panorama_fish_eye" val="bien" label="Bien" color="secondary" />
                          </div>
                        </q-item-section>
                      </q-item>
                    </div>
                    <div>
                      <q-item>
                        <q-item-section avatar style="width: 150px;">Eficiencia:</q-item-section>
                        <q-item-section>
                          <div>
                            <q-radio v-model="data.eficiencia" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                              val="mal" label="Mal" color="secondary" />
                            <q-radio v-model="data.eficiencia" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                              val="regular" label="Regular" color="secondary" />
                            <q-radio v-model="data.eficiencia" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                              val="bien" label="Bien" color="secondary" />
                          </div>
                        </q-item-section>
                      </q-item>
                    </div>
                  </div>
                  <div >Tipo de grasa:</div>
                  <div>
                    <q-radio v-model="data.tipoGrasa" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="si"
                      label="Si" color="secondary" />
                    <q-radio v-model="data.tipoGrasa" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="no"
                      label="No" color="secondary" />
                  </div>
                  <div style="max-width: 100%" v-if="data.tipoGrasa == 'si'">
                    <p class="q-pl-md q-pt-sm"> Estado técnico</p>
                    <div class="row">
                      <q-input outlined dense v-model="data.estadoBien" type="number" label="Bien" class="q-pl-md"
                        style="max-width: 70px" min="0"/>
                      <q-input outlined dense v-model="data.estadoRegular" type="number" label="Regular" class="q-pl-md"
                        style="max-width: 100px" min="0"/>
                      <q-input outlined dense v-model="data.estadoMal" type="number" label="Mal" class="q-pl-md "
                        style="max-width: 70px" min="0"/>
                    </div>
                  </div>
                  <div>
                    <q-item>
                      <q-item-section avatar style="width: 150px;">Política ambiental:</q-item-section>
                      <q-item-section>
                        <div>
                          <q-radio v-model="data.politica" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                            val="si" label="Si" color="secondary" />
                          <q-radio v-model="data.politica" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                            val="no" label="No" color="secondary" />
                        </div>
                      </q-item-section>
                    </q-item>
                  </div>
                  <div>
                    <q-item>
                      <q-item-section avatar style="width: 150px;">Diagnostico ambiental:</q-item-section>
                      <q-item-section>
                        <div>
                          <q-radio v-model="data.diagnostico" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                            val="si" label="Si" color="secondary" />
                          <q-radio v-model="data.diagnostico" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                            val="no" label="No" color="secondary" />
                        </div>
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="column">
                    <div class="row">
                      <q-input outlined dense v-model="data.medidas_corto" label="Medidas a corto" class="q-pa-sm"
                        type="number" style="max-width: 150px" min="0"/>
                      <q-input outlined dense v-model="data.cumplidas_corto" label="Cumplidas a corto" class="q-pa-sm"
                        type="number" style="max-width: 150px" min="0"/>
                    </div>
                    <div class="row">
                      <q-input outlined dense v-model="data.medidas_mediano
                        " label="Medidas a mediano" class="q-pa-sm" type="number" style="max-width: 150px" min="0"/>
                      <q-input outlined dense v-model="data.cumplidas_mediano" label="Cumplidas a mediano" class="q-pa-sm"
                        type="number" style="max-width: 150px" min="0"/>
                    </div>
                    <div class="row">
                      <q-input outlined dense v-model="data.medidas_largo" label="Medidas a largo" class="q-pa-sm"
                        type="number" style="max-width: 150px" min="0"/>
                      <q-input outlined dense v-model="data.cumplidas_largo" label="Cumplidas a largo" class="q-pa-sm"
                        type="number" style="max-width: 150px" min="0"/>
                    </div>
                  </div>
                  <q-input outlined dense v-model="data.consumo_agua" label="Consumo de agua"
                    class=" q-pa-sm" style="max-width: 200px" lazy-rules :rules="alerts.inputRules"
                    ref="consumo_agua" />
                  <q-input outlined dense v-model="data.consumo_energetico" label="Consumo energético"
                    style="max-width: 200px" class="q-pa-sm" lazy-rules :rules="alerts.inputRules"
                    ref="consumo_energetico" />
                  <q-input v-model="data.deficiencias" filled type="textarea" label="Deficiencias"
                    class=" q-pa-sm" style="min-width: 400px; width: 50%" lazy-rules
                    :rules="alerts.inputRules" ref="deficiencias" />
                  <q-input v-model="data.recomendaciones" filled type="textarea" label="Recomendaciones"
                    class="q-pa-sm" style="min-width: 400px; width: 50%" lazy-rules :rules="alerts.inputRules"
                    ref="recomendaciones" />
                  <q-input v-model="data.observaciones" filled type="textarea" label="Observaciones"
                    class="q-pa-sm" style="min-width: 400px; width: 50%" lazy-rules :rules="alerts.inputRules"
                    ref="observaciones" />
                </q-card-section>

                <q-checkbox v-model="data.aprovechamiento" color="secondary" label="Aprovechamiento de residuales"
                  true-value="si" false-value="no" class="full-width justify-center" />

                <aprovechamiento v-if="data.aprovechamiento == 'si'" @addId='addingId' @deleteId='deleteId'
                  :idResidual="data.id_ResidualEdit" />

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
            <q-card class="my-card-to-pdf bg-primary" flat bordered>
              <q-item>
                <q-item-section>
                  <q-item-label><b>Editar: "Acta de Control"</b></q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <form @submit.prevent.stop="onEdit">
                <q-card-section>
                  <div class="row">
                    <q-select class="col-8 q-mr-xl text-black" use-input input-debounce="0" dense outlined
                      v-model="data.entidadEdit" :options="options" @filter="filterFn" label="Entidad"
                      style="max-width: 50%" lazy-rules :rules="alerts.inputRules" ref="modeloEdit" />
                    <q-input outlined dense v-model="data.fechavisitaEdit" type="date" hint="Fecha de Visita" lazy-rules
                      :rules="alerts.inputRules" ref="fechavisitaEdit" />
                  </div>
                  <q-input outlined dense v-model="data.atendido_porEdit" label="Atendido por" 
                    style="max-width: 80%" lazy-rules :rules="alerts.inputRules" ref="atendido_porEdit" />
                  <q-input outlined dense v-model="data.comision_controlEdit" label="Comisión" style="max-width: 80%"
                    lazy-rules :rules="alerts.inputRules" ref="comision_controlEdit" />
                  <div >Sistema de tratamiento:</div>
                  <div>
                    <q-radio v-model="data.tratamientoEdit" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                      val="si" label="Si" color="secondary" />
                    <q-radio v-model="data.tratamientoEdit" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                      val="no" label="No" color="secondary" />
                  </div>
                  <div style="max-width: 100%" v-if="data.tratamientoEdit == 'si'">
                    <p class="q-pl-md q-pt-sm"> Estado técnico</p>
                    <div>
                      <q-item>
                        <q-item-section avatar style="width: 150px;">Idoneidad:</q-item-section>
                        <q-item-section>
                          <div>
                            <q-radio v-model="data.idoniedadEdit" checked-icon="task_alt"
                              unchecked-icon="panorama_fish_eye" val="si" label="Si" color="secondary" />
                            <q-radio v-model="data.idoniedadEdit" checked-icon="task_alt"
                              unchecked-icon="panorama_fish_eye" val="no" label="No" color="secondary" />
                          </div>
                        </q-item-section>
                      </q-item>
                    </div>
                    <div>
                      <q-item>
                        <q-item-section avatar style="width: 150px;">Estado técnico:</q-item-section>
                        <q-item-section>
                          <div>
                            <q-radio v-model="data.estadoTecnicoEdit" checked-icon="task_alt"
                              unchecked-icon="panorama_fish_eye" val="mal" label="Mal" color="secondary" />
                            <q-radio v-model="data.estadoTecnicoEdit" checked-icon="task_alt"
                              unchecked-icon="panorama_fish_eye" val="regular" label="Regular" color="secondary" />
                            <q-radio v-model="data.estadoTecnicoEdit" checked-icon="task_alt"
                              unchecked-icon="panorama_fish_eye" val="bien" label="Bien" color="secondary" />
                          </div>
                        </q-item-section>
                      </q-item>
                    </div>
                    <div>
                      <q-item>
                        <q-item-section avatar style="width: 150px;">Eficiencia:</q-item-section>
                        <q-item-section>
                          <div>
                            <q-radio v-model="data.eficienciaEdit" checked-icon="task_alt"
                              unchecked-icon="panorama_fish_eye" val="mal" label="Mal" color="secondary" />
                            <q-radio v-model="data.eficienciaEdit" checked-icon="task_alt"
                              unchecked-icon="panorama_fish_eye" val="regular" label="Regular" color="secondary" />
                            <q-radio v-model="data.eficienciaEdit" checked-icon="task_alt"
                              unchecked-icon="panorama_fish_eye" val="bien" label="Bien" color="secondary" />
                          </div>
                        </q-item-section>
                      </q-item>
                    </div>
                  </div>
                  <div >Tipo de grasa:</div>
                  <div>
                    <q-radio v-model="data.tipoGrasaEdit" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                      val="si" label="Si" color="secondary" />
                    <q-radio v-model="data.tipoGrasaEdit" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                      val="no" label="No" color="secondary" />
                  </div>
                  <div style="max-width: 100%" v-if="data.tipoGrasaEdit == 'si'">
                    <p class="q-pl-md q-pt-sm"> Estado técnico</p>
                    <div class="row">
                      <q-input outlined dense v-model="data.estadoBienEdit" type="number" label="Bien" class="q-pl-md"
                        style="max-width: 70px" min="0"/>
                      <q-input outlined dense v-model="data.estadoRegularEdit" type="number" label="Regular"
                        class="q-pl-md" style="max-width: 100px" min="0"/>
                      <q-input outlined dense v-model="data.estadoMalEdit" type="number" label="Mal"
                        class="q-pl-md " style="max-width: 70px" min="0"/>
                    </div>
                  </div>
                  <div>
                    <q-item>
                      <q-item-section avatar style="width: 150px;">Política ambiental:</q-item-section>
                      <q-item-section>
                        <div>
                          <q-radio v-model="data.politicaEdit" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                            val="si" label="Si" color="secondary" />
                          <q-radio v-model="data.politicaEdit" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                            val="no" label="No" color="secondary" />
                        </div>
                      </q-item-section>
                    </q-item>
                  </div>
                  <div>
                    <q-item>
                      <q-item-section avatar style="width: 150px;">Diagnostico ambiental:</q-item-section>
                      <q-item-section>
                        <div>
                          <q-radio v-model="data.diagnosticoEdit" checked-icon="task_alt"
                            unchecked-icon="panorama_fish_eye" val="si" label="Si" color="secondary" />
                          <q-radio v-model="data.diagnosticoEdit" checked-icon="task_alt"
                            unchecked-icon="panorama_fish_eye" val="no" label="No" color="secondary" />
                        </div>
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="column">
                    <div class="row">
                      <q-input outlined dense v-model="data.medidas_cortoEdit" label="Medidas a corto" class="q-pa-sm"
                        type="number" style="max-width: 150px" min="0"/>
                      <q-input outlined dense v-model="data.cumplidas_cortoEdit" label="Cumplidas a corto" class="q-pa-sm"
                        type="number" style="max-width: 150px" min="0"/>
                    </div>
                    <div class="row">
                      <q-input outlined dense v-model="data.medidas_medianoEdit
                        " label="Medidas a mediano" class="q-pa-sm" type="number" style="max-width: 150px" min="0"/>
                      <q-input outlined dense v-model="data.cumplidas_medianoEdit" label="Cumplidas a mediano"
                        class="q-pa-sm" type="number" style="max-width: 150px" min="0"/>
                    </div>
                    <div class="row">
                      <q-input outlined dense v-model="data.medidas_largoEdit" label="Medidas a largo" class="q-pa-sm"
                        type="number" style="max-width: 150px" min="0"/>
                      <q-input outlined dense v-model="data.cumplidas_largoEdit" label="Cumplidas a largo" class="q-pa-sm"
                        type="number" style="max-width: 150px" min="0"/>
                    </div>
                  </div>
                  <q-input outlined dense v-model="data.consumo_aguaEdit" label="Consumo de agua"
                    class="q-pa-sm" style="max-width: 200px" lazy-rules :rules="alerts.inputRules"
                    ref="consumo_aguaEdit" />
                  <q-input outlined dense v-model="data.consumo_energeticoEdit" label="Consumo energético"
                    style="max-width: 200px" class="q-pa-sm" lazy-rules :rules="alerts.inputRules"
                    ref="consumo_energeticoEdit" />
                  <q-input v-model="data.deficienciasEdit" filled type="textarea" label="Deficiencias"
                    class="q-pa-sm" style="min-width: 400px; width: 50%" lazy-rules
                    :rules="alerts.inputRules" ref="deficienciasEdit" />
                  <q-input v-model="data.recomendacionesEdit" filled type="textarea" label="Recomendaciones"
                    class="q-pa-sm" style="min-width: 400px; width: 50%" lazy-rules :rules="alerts.inputRules"
                    ref="recomendacionesEdit" />
                  <q-input v-model="data.observacionesEdit" filled type="textarea" label="Observaciones"
                    class="q-pa-sm" style="min-width: 400px; width: 50%" lazy-rules :rules="alerts.inputRules"
                    ref="observacionesEdit" />
                </q-card-section>

                <q-checkbox v-model="data.aprovechamientoEdit" color="secondary" label="Aprovechamiento de residuales"
                  true-value="si" false-value="no" class="full-width justify-center" />

                <aprovechamiento v-if="data.aprovechamientoEdit == 'si'" @addId='addingId' @deleteId='deleteId'
                  :idResidual="data.id_ResidualEdit" />

                <q-separator dark />

                <q-card-actions class="justify-end">
                  <q-btn no-caps class="text-white bg-secondary" @click="generatePDF">PDF</q-btn>
                  <q-btn no-caps class="text-white bg-secondary" type="submit">Editar</q-btn>
                  <q-btn no-caps class="text-white bg-secondary" @click="clear" v-close-popup>Cerrar</q-btn>
                </q-card-actions>
              </form>
            </q-card>
          </q-dialog>
          <q-btn no-caps class="text-white bg-secondary" @click="Delete">Eliminar</q-btn>
        </q-card-actions>
      </q-card>
    </q-slide-transition>
  </div>
</template>

<script setup>
import aprovechamiento from "components/aprovechamiento_.vue"
import { onMounted, reactive, ref, computed, watch } from "vue";
import { api } from "boot/axios.js";
import { useAuthStore } from "src/stores/auth-store";
import { useAlertsRulesStore } from "src/stores/alerts-rules-store";
import { useQuasar } from "quasar";
import { useDataStore } from "src/stores/data-store";
import jsPDF from 'jspdf';


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
    name: "fechavisita",
    align: "center",
    label: "Fecha",
    field: "fechavisita",
    sortable: true,
  },
  {
    name: "politica_ambiental",
    align: "center",
    label: "Política/Amb",
    field: "politica_ambiental",
    sortable: true,
  },
  {
    name: "diagnostico_ambiental",
    align: "center",
    label: "Diagnostico/Amb",
    field: "diagnostico_ambiental",
    sortable: true,
  },
  {
    name: "medidas_corto",
    align: "center",
    label: "Medidas/C",
    field: "medidas_corto",
    sortable: true,
  },
  {
    name: "medidas_mediano",
    align: "center",
    label: "Medidas/M",
    field: "medidas_mediano",
    sortable: true,
  },
  {
    name: "medidas_largo",
    align: "center",
    label: "Medidas/L",
    field: "medidas_largo",
    sortable: true,
  },
  {
    name: "cumplidas_corto",
    align: "center",
    label: "Cumplidas/C",
    field: "cumplidas_corto",
    sortable: true,
  },
  {
    name: "cumplidas_mediano",
    align: "center",
    label: "Cumplidas/M",
    field: "cumplidas_mediano",
    sortable: true,
  },
  {
    name: "cumplidas_largo",
    align: "center",
    label: "Cumplidas/L",
    field: "cumplidas_largo",
    sortable: true,
  },
  {
    name: "sistema_de_tratamiento",
    align: "center",
    label: "Sistema de tratamiento",
    field: "sistema_de_tratamiento",
    sortable: true,
  },
  {
    name: "residuales",
    align: "center",
    label: "Aprovechamiento de residuales",
    field: "residuales",
    sortable: true,
  }
];

const stringOptions = []
const model = ref([])
const options = ref(stringOptions)

const modelo = ref(null);
const fechavisita = ref(null);
const atendido_por = ref(null);
const comision_control = ref(null);
const consumo_agua = ref(null);
const consumo_energetico = ref(null);
const deficiencias = ref(null);
const recomendaciones = ref(null);
const observaciones = ref(null);

const modeloEdit = ref(null);
const fechavisitaEdit = ref(null);
const atendido_porEdit = ref(null);
const comision_controlEdit = ref(null);
const consumo_aguaEdit = ref(null);
const consumo_energeticoEdit = ref(null);
const deficienciasEdit = ref(null);
const recomendacionesEdit = ref(null);
const observacionesEdit = ref(null);

let data = reactive({
  fecha_actual: new Date(),
  fechaImpresion: new Date(),
  rows: [],
  id_Residual: [],

  tratamiento: "no",
  idoniedad: "",
  estadoTecnico: "",
  eficiencia: "",

  tipoGrasa: "no",
  estadoBien: "0",
  estadoMal: "0",
  estadoRegular: "0",
  politica: "no",
  diagnostico: "no",

  atendido_por: "",
  comision_control: "",
  consumo_agua: "",
  consumo_energetico: "",
  cumplidas_corto: "0",
  cumplidas_largo: "0",
  cumplidas_mediano: "0",
  deficiencias: "",
  fechavisita: "",
  medidas_corto: "0",
  medidas_largo: "0",
  medidas_mediano: "0",
  observaciones: "",
  politica_ambiental: "",
  recomendaciones: "",
  aprovechamiento: "no",

  tratamientoEdit: "no",
  idoniedadEdit: "",
  estadoTecnicoEdit: "",
  eficienciaEdit: "",

  tipoGrasaEdit: "no",
  estadoBienEdit: "0",
  estadoMalEdit: "0",
  estadoRegularEdit: "0",
  politicaEdit: "no",
  diagnosticoEdit: "no",

  atendido_porEdit: "",
  comision_controlEdit: "",
  consumo_aguaEdit: "",
  consumo_energeticoEdit: "",
  cumplidas_cortoEdit: "0",
  cumplidas_largoEdit: "0",
  cumplidas_medianoEdit: "0",
  deficienciasEdit: "",
  diagnosticoEdit: "no",
  fechavisitaEdit: "",
  medidas_cortoEdit: "0",
  medidas_largoEdit: "0",
  medidas_medianoEdit: "0",
  observacionesEdit: "",
  politica_ambientalEdit: "",
  recomendacionesEdit: "",
  aprovechamientoEdit: "no",
  identidadEdit: "",
  entidadEdit: "",
  id_ResidualEdit: [],
  ResidualAntiguo: [],

  categoriaEdit: "",
  cardEdit: false,
  cardCreate: false,

  entidades: [],
  tempEntidad: []
});

function clear(params) {
  model.value = "",
    data.tratamiento = "no"
  data.idoniedad = ""
  data.estadoTecnico = ""
  data.eficiencia = ""

  data.tipoGrasa = "no"
  data.estadoBien = "0"
  data.estadoMal = "0",
    data.estadoRegular = "0"
  data.politica = "no"
  data.diagnostico = "no"

  data.atendido_por = ""
  data.comision_control = ""
  data.consumo_agua = ""
  data.consumo_energetico = ""
  data.cumplidas_corto = "0"
  data.cumplidas_largo = "0"
  data.cumplidas_mediano = "0"
  data.deficiencias = ""
  data.fechavisita = ""
  data.medidas_corto = "0"
  data.medidas_largo = "0"
  data.medidas_mediano = "0"
  data.observaciones = ""
  data.politica_ambiental = ""
  data.recomendaciones = ""
  data.aprovechamiento = "no",
    data.id_ResidualEdit = []
}

// watch(() => model.value, (value) => {
//   clear()
//   data.id_ResidualEdit=[]
//   data.entidades.forEach(element => {
//     if (element.nombre == value) {
//       const actualYear = new Date()
//       api
//         .get(`/actacontrols?populate=%2A&filters[fechavisita][$containsi]=${actualYear.getFullYear().toString()}&sort[0]=fechavisita%3Adesc`, {
//           headers: {
//             Authorization: "Bearer " + auth.jwt,
//           },
//         }).then(function (response) {
//           //console.log(response);
//           for (let i = 0; i < response.data.data.length; i++) {
//             if (response.data.data[i].attributes.entidad.data.id == element.id) {
//               data.medidas_corto = response.data.data[i].attributes.medidas_corto
//               data.medidas_largo = response.data.data[i].attributes.medidas_largo
//               data.medidas_mediano = response.data.data[i].attributes.medidas_mediano
//               data.cumplidas_corto = response.data.data[i].attributes.cumplidas_corto
//               data.cumplidas_largo = response.data.data[i].attributes.cumplidas_largo
//               data.cumplidas_mediano = response.data.data[i].attributes.cumplidas_mediano
//               let residuales = "no"
//               let element = [];
//               for (let index = 0; index < response.data.data[i].attributes.residuals.data.length; index++) {
//                 element.push(response.data.data[i].attributes.residuals.data[index].id)
//               }
//               if (element.length > 0) residuales = "si"
//               data.ResidualAntiguo = element
//               for (let index = 0; index < data.ResidualAntiguo.length; index++) {
//                 data.id_ResidualEdit.push({ id: data.ResidualAntiguo[index] })
//               }
//               data.aprovechamiento = residuales
//               break;
//             }
//           }
//         })
//         .catch(function (error) {
//           console.log(error);
//         });
//     }
//   });
// })

watch(() => data.tratamiento, (value) => {
  if(value!="no"){
    data.idoniedad = "no"
  data.estadoTecnico = "mal"
  data.eficiencia = "mal"
  }else{
    data.idoniedad = ""
  data.estadoTecnico = ""
  data.eficiencia = ""
  }
})

watch(() => data.tratamientoEdit, (value) => {
  if(value!="no"){
    data.idoniedadEdit = "no"
  data.estadoTecnicoEdit = "mal"
  data.eficienciaEdit = "mal"
  }else{
    data.idoniedadEdit = ""
  data.estadoTecnicoEdit = ""
  data.eficienciaEdit = ""
  }
})

function generatePDF() {
  // create a new jsPDF instance
  var doc = new jsPDF();
  doc.setFontSize(12)
  doc.text("                                                                                          Fecha de la visita: "+data.fechavisitaEdit+"\n\n" +
                "Entidad: "+selected.value[0].entidad+"           Director: "+selected.value[0].director+"\n" +
                "Organismo: "+selected.value[0].organismo+"\n" +
                "Teléfono(s): "+selected.value[0].telefono+"\n\n" +
                "Atendido por: "+data.atendido_porEdit+"\n" +
                "Comisión de control: "+data.comision_controlEdit+"\n\n" +
                "Sistema de tratamiento: "+data.tratamientoEdit+"\n\n" +
                "Trampa de grasa: "+data.tipoGrasaEdit+"\n" +
                "Bien: "+data.estadoBienEdit+"    Regular: "+data.estadoRegularEdit+"    Mal: "+data.estadoMalEdit+"\n\n" +
                "Política ambiental: "+data.politicaEdit+"\n" +
                "Diagnóstico ambiental: "+data.diagnosticoEdit+"\n\n" +
                "Medidas a corto:   "+data.medidas_cortoEdit+"       Cumplidas a corto: "+data.cumplidas_cortoEdit+"\n" +
                "Medidas a mediano: "+data.medidas_medianoEdit+"       Cumplidas a mediano: "+data.cumplidas_medianoEdit+"\n" +
                "Medidas a largo:   "+data.medidas_largoEdit+"       Cumplidas a largo: "+data.cumplidas_largoEdit+"\n\n" +
                "Consumo de agua: "+data.consumo_aguaEdit+"\n" +
                "Consumo energético: "+data.consumo_energeticoEdit+"\n\n" +
                "Deficiencias: "+data.deficienciasEdit+"\n\n\n" +
                "Recomendaciones: "+data.recomendacionesEdit+"\n\n\n" +
                "Observaciones: "+data.observacionesEdit+"\n\n\n" +
                "APROVECHAMIENTO ECONÓMICO: "+data.aprovechamientoEdit+"", 10, 10)
  doc.save("Acta de Control.pdf")
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

onMounted(() => {
  getYear()
  getActacontrol();
  getEntidad()
});

function getYear(params) {
  data.fecha_actual = data.fecha_actual.getFullYear()
  data.fechaImpresion= data.fechaImpresion.getDay()+"/"+data.fechaImpresion.getMonth()+"/"+data.fechaImpresion.getFullYear()
}

function addingId(params) {
  data.id_Residual.push(params)
  data.id_ResidualEdit.push(params)
}

function deleteId(params) {
  data.id_Residual.push(params, 1)
  data.id_ResidualEdit.splice(params, 1)
}

function editFields(params) {
  data.id_ResidualEdit = []
  if (selected.value[0].residuals.length > 0) {
    data.aprovechamientoEdit = "si"
    for (let index = 0; index < selected.value[0].residuals.length; index++) {
      data.id_ResidualEdit.push(selected.value[0].residuals[index])
    }
  }
  else { data.aprovechamientoEdit = "no" }
  (data.tratamientoEdit = selected.value[0].sistema_de_tratamiento),
    (data.idoniedadEdit = selected.value[0].idoneidad),
    (data.estadoTecnicoEdit = selected.value[0].estado_tecnico),
    (data.eficienciaEdit = selected.value[0].eficiencia),

    (data.tipoGrasaEdit = selected.value[0].trampa_de_grasa),
    (data.estadoBienEdit = selected.value[0].estadoGrasaBien),
    (data.estadoMalEdit = selected.value[0].estadoGrasaMal),
    (data.estadoRegularEdit = selected.value[0].estadoGrasaRegular),
    (data.politicaEdit = selected.value[0].politica_ambiental),
    (data.diagnosticoEdit = selected.value[0].diagnostico_ambiental),

    (data.atendido_porEdit = selected.value[0].atendido_por),
    (data.comision_controlEdit = selected.value[0].comision_control),
    (data.consumo_aguaEdit = selected.value[0].consumo_agua),
    (data.consumo_energeticoEdit = selected.value[0].consumo_energetico),
    (data.cumplidas_cortoEdit = selected.value[0].cumplidas_corto),
    (data.cumplidas_largoEdit = selected.value[0].cumplidas_largo),
    (data.cumplidas_medianoEdit = selected.value[0].cumplidas_mediano),
    (data.deficienciasEdit = selected.value[0].deficiencias),
    (data.fechavisitaEdit = selected.value[0].fechavisita),
    (data.medidas_cortoEdit = selected.value[0].medidas_corto),
    (data.medidas_largoEdit = selected.value[0].medidas_largo),
    (data.medidas_medianoEdit = selected.value[0].medidas_mediano),
    (data.observacionesEdit = selected.value[0].observaciones),
    (data.politica_ambientalEdit = selected.value[0].politica_ambiental),
    (data.recomendacionesEdit = selected.value[0].recomendaciones),
    (data.entidadEdit = selected.value[0].entidad),
    (data.cardEdit = true);
}

function editSistTrat() {
  return new Promise(resolve => {
    const dataRest = {
      data: {
        idoneidad: data.idoniedadEdit,
        estado: data.estadoTecnicoEdit,
        eficiencia: data.eficienciaEdit,
      }
    }

    const authorization = {
      headers: {
        Authorization: `Bearer ${auth.jwt}`,
      },
    };

    api
      .put(`/sis-tratamientos/${selected.value[0].idSist}`, dataRest, authorization)
      .then(function (response) {
        // console.log(response);
        resolve(response.data.data.id)
      })
      .catch(function (error) {
        console.log(error);
      });
  })
}

function editTrampa() {
  return new Promise(resolve => {
    const dataRest = {
      data: {
        bien: data.estadoBienEdit,
        regular: data.estadoRegularEdit,
        mal: data.estadoMalEdit,
      }
    }

    const authorization = {
      headers: {
        Authorization: `Bearer ${auth.jwt}`,
      },
    };

    api
      .put(`/trampa-grasas/${selected.value[0].idTramp}`, dataRest, authorization)
      .then(function (response) {
        resolve(response.data.data.id)
      })
      .catch(function (error) {
        console.log(error);
      });
  })
}

async function Edit(params) {
  let sist, tramp
  if (selected.value[0].idTramp == "" ? tramp = await EditcreateTrampa() : tramp = await editTrampa())
    if (selected.value[0].idSist == "" ? sist = await EditcreateSistTrat() : sist = await editSistTrat())

      data.entidades.forEach(element => {
        if (element.entidad == data.entidadEdit) data.identidadEdit = { id: element.id }
      });

  const dataRest = {
    data: {
      politica_ambiental: data.politicaEdit,
      diagnostico_ambiental: data.diagnosticoEdit,

      atendido_por: data.atendido_porEdit,
      comision_control: data.comision_controlEdit,
      consumo_agua: data.consumo_aguaEdit,
      consumo_energetico: data.consumo_energeticoEdit,
      cumplidas_corto: data.cumplidas_cortoEdit,
      cumplidas_largo: data.cumplidas_largoEdit,
      cumplidas_mediano: data.cumplidas_medianoEdit,
      deficiencias: data.deficienciasEdit,
      fechavisita: data.fechavisitaEdit,
      medidas_corto: data.medidas_cortoEdit,
      medidas_largo: data.medidas_largoEdit,
      medidas_mediano: data.medidas_medianoEdit,
      observaciones: data.observacionesEdit,
      recomendaciones: data.recomendacionesEdit,
      entidad: data.identidadEdit,
      residuals: data.id_ResidualEdit,
      sis_tratamiento: sist,
      trampa_grasa: tramp,
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .put(`/actacontrols/${selected.value[0].id}`, dataRest, authorization)
    .then(function (response) {
      // console.log(response);
      data.cardEdit = false
      alerts.alerts[1].message = "Acta de control editada";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Acta de control editada", "Satisfactorio")
      getActacontrol();
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo editando el Acta de control";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Acta de control editada", "Fallo")
      console.log(error);
    });

  selected.value = []
}

function EditcreateSistTrat() {
  return new Promise(resolve => {
    const dataRest = {
      data: {
        eficiencia: data.eficienciaEdit,
        estado: data.estadoTecnicoEdit,
        idoneidad: data.idoniedadEdit,
      }
    }

    const authorization = {
      headers: {
        Authorization: `Bearer ${auth.jwt}`,
      },
    };

    api
      .post("/sis-tratamientos", dataRest, authorization)
      .then(function (response) {
        // console.log(response);
        resolve(response.data.data.id)
      })
      .catch(function (error) {
        console.log(error);
      });
  })
}

function EditcreateTrampa() {
  return new Promise(resolve => {
    const dataRest = {
      data: {
        bien: data.estadoBienEdit,
        regular: data.estadoRegularEdit,
        mal: data.estadoMalEdit,
      }
    }

    const authorization = {
      headers: {
        Authorization: `Bearer ${auth.jwt}`,
      },
    };

    api
      .post("/trampa-grasas", dataRest, authorization)
      .then(function (response) {
        // console.log(response);
        resolve(response.data.data.id)
      })
      .catch(function (error) {
        console.log(error);
      });
  })
}

function createSistTrat() {
  return new Promise(resolve => {
    const dataRest = {
      data: {
        eficiencia: data.eficiencia,
        estado: data.estadoTecnico,
        idoneidad: data.idoniedad,
      }
    }

    const authorization = {
      headers: {
        Authorization: `Bearer ${auth.jwt}`,
      },
    };

    api
      .post("/sis-tratamientos", dataRest, authorization)
      .then(function (response) {
        // console.log(response);
        resolve(response.data.data.id)
      })
      .catch(function (error) {
        console.log(error);
      });
  })
}

function createTrampa() {
  return new Promise(resolve => {
    const dataRest = {
      data: {
        bien: data.estadoBien,
        regular: data.estadoRegular,
        mal: data.estadoMal,
      }
    }

    const authorization = {
      headers: {
        Authorization: `Bearer ${auth.jwt}`,
      },
    };

    api
      .post("/trampa-grasas", dataRest, authorization)
      .then(function (response) {
        // console.log(response);
        resolve(response.data.data.id)
      })
      .catch(function (error) {
        console.log(error);
      });
  })
}

async function Create() {
  let sist = await createSistTrat()
  let tramp = await createTrampa()
  data.entidades.forEach(element => {
    if (element.entidad == model.value) data.tempEntidad = { id: element.id }
  });
  const dataRest = {
    data: {
      atendido_por: data.atendido_por,
      comision_control: data.comision_control,
      consumo_agua: data.consumo_agua,
      consumo_energetico: data.consumo_energetico,
      cumplidas_corto: data.cumplidas_corto,
      cumplidas_largo: data.cumplidas_largo,
      cumplidas_mediano: data.cumplidas_mediano,
      deficiencias: data.deficiencias,
      diagnostico_ambiental: data.diagnostico,
      fechavisita: data.fechavisita,
      medidas_corto: data.medidas_corto,
      medidas_largo: data.medidas_largo,
      medidas_mediano: data.medidas_mediano,
      observaciones: data.observaciones,
      politica_ambiental: data.politica,
      recomendaciones: data.recomendaciones,
      sis_tratamiento: sist,
      trampa_grasa: tramp,
      entidad: data.tempEntidad,
      residuals: data.id_Residual
    },
  };

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .post("/actacontrols", dataRest, authorization)
    .then(function (response) {
      ////console.log(response);
      data.cardCreate = false
      alerts.alerts[1].message = "Acta de control creada";
      $q.notify(alerts.alerts[1]);
      auth.postTraza("Acta de control creada", "Satisfactorio")
      clear()
      getActacontrol();
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo creando el Acta de control";
      $q.notify(alerts.alerts[0]);
      auth.postTraza("Acta de control creada", "Fallo")
      console.log(error);
    });
}

function Delete(params) {
  for (let index = 0; index < selected.value.length; index++) {
    api
      .delete(`/actacontrols/${selected.value[index].id}`, {
        headers: {
          Authorization: "Bearer " + auth.jwt,
        },
      })
      .then(function (response) {
        alerts.alerts[1].message = "Acta de control eliminada";
        $q.notify(alerts.alerts[1]);
        auth.postTraza("Acta de control eliminada", "Satisfactorio")
        getActacontrol()
      })
      .catch(function (error) {
        alerts.alerts[0].message = "Fallo eliminando el Acta de control";
        $q.notify(alerts.alerts[0]);
        auth.postTraza("Acta de control eliminada", "Fallo")
        console.log(error);
      });

  }
  selected.value = []
}

function getEntidad(params) {
  data.entidades = dataStore.entidad
  data.entidades.forEach(element => {
    stringOptions.push(element.entidad)
  });
}

async function getActacontrol(params) {
  selected.value = []
  data.rows = [];

  await api
    .get(`/getActaControlData?filters[0]=${data.fecha_actual}`, {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      data.rows = response.data
      data.rows.forEach(element => {
        if(element.diagnostico_ambiental=="Si") element.diagnostico_ambiental="si"
        if(element.diagnostico_ambiental=="No") element.diagnostico_ambiental="no"
        if(element.politica_ambiental=="Si") element.politica_ambiental="si"
        if(element.politica_ambiental=="No") element.politica_ambiental="no"
      });
    }).catch(function (error) {
      console.log(error);
    });
}

function getSelectedString() {
  return selected.value.length === 0
    ? ""
    : `${selected.value.length} record${selected.value.length > 1 ? "s" : ""
    } selected of ${data.rows.length}`;
}

function onCreate() {
  modelo.value.validate();
  fechavisita.value.validate();
  atendido_por.value.validate();
  comision_control.value.validate();
  consumo_agua.value.validate();
  consumo_energetico.value.validate();
  deficiencias.value.validate();
  recomendaciones.value.validate();
  observaciones.value.validate();

  if (modelo.value.hasError || fechavisita.value.hasError || atendido_por.value.hasError || comision_control.value.hasError || consumo_agua.value.hasError || consumo_energetico.value.hasError || deficiencias.value.hasError || recomendaciones.value.hasError || observaciones.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  }
  else if (data.medidas_corto < data.cumplidas_corto || data.medidas_mediano < data.cumplidas_mediano || data.medidas_largo < data.cumplidas_largo) {
    alerts.alerts[0].message = "La cantidad de medidas cumplidas debe ser menor que la cantidad de medidas propuestas";
    $q.notify(alerts.alerts[0]);
  }
  else {
    Create();
  }
}

function onEdit() {
  modeloEdit.value.validate();
  fechavisitaEdit.value.validate();
  atendido_porEdit.value.validate();
  comision_controlEdit.value.validate();
  consumo_aguaEdit.value.validate();
  consumo_energeticoEdit.value.validate();
  deficienciasEdit.value.validate();
  recomendacionesEdit.value.validate();
  observacionesEdit.value.validate();

  if (modeloEdit.value.hasError || fechavisitaEdit.value.hasError || atendido_porEdit.value.hasError || comision_controlEdit.value.hasError || consumo_aguaEdit.value.hasError || consumo_energeticoEdit.value.hasError || deficienciasEdit.value.hasError || recomendacionesEdit.value.hasError || observacionesEdit.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  }
  else if (data.medidas_cortoEdit < data.cumplidas_cortoEdit || data.medidas_medianoEdit < data.cumplidas_medianoEdit || data.medidas_largoEdit < data.cumplidas_largoEdit) {
    alerts.alerts[0].message = "La cantidad de medidas cumplidas debe ser menor que la cantidad de medidas propuestas";
    $q.notify(alerts.alerts[0]);
  } else {
    Edit();
  }
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