<template>
  <div>
    <q-card class="my-card q-ma-md bg-primary" bordered>
      <q-card-section>
        <q-table class="my-sticky-header-table" :rows="data.rows" :columns="columns" dense row-key="name"
          :selected-rows-label="getSelectedString" selection="multiple" v-model:selected="selected"
          v-model:pagination="pagination" :filter="filter" >
          <template v-slot:top>
            <div style="width: 100%" class="row justify-between">
              <div class="col-3 text-h6">Actas de Control</div>
              <div class="col-3">
                <div class="row justify-center">
                  <q-input outlined dense v-model="data.fecha_actual" type="number" label="Año" class="col-3" />
                  <q-btn flat round color="secondary" icon="search" class="col-1" @click="getActacontrol()" />
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
          <q-card class="my-card bg-primary" flat bordered style="width: 100%">
            <q-item>
              <q-item-section>
                <q-item-label><b>Nuevo: "Acta de Control"</b></q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-card-section>
              <div class="row">
                <q-select class="col-8 q-mr-xl text-black" use-input input-debounce="0" dense outlined v-model="model"
                  :options="options" @filter="filterFn" label="Entidad" style="max-width: 50%" />
                <q-input outlined dense v-model="data.fechavisita" type="date" hint="Fecha de Visita" />
              </div>
              <q-input outlined dense v-model="data.atendido_por" label="Atendido por" class="q-mt-xl q-mb-md"
                style="max-width: 50%" />
              <q-input outlined dense v-model="data.comision_control" label="Comision" style="max-width: 50%" />
              <div class="q-mt-xl">Sistema de tratamiento:</div>
              <div>
                <q-radio v-model="data.tratamiento" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="si"
                  label="Si" color="secondary" />
                <q-radio v-model="data.tratamiento" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="no"
                  label="No" color="secondary" />
              </div>
              <div style="max-width: 100%" v-if="data.tratamiento=='si'">
                <p class="q-pl-md q-pt-sm"> Estado tecnico</p>
                <div>
                  <q-item>
                    <q-item-section avatar>Idoneidad:</q-item-section>
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
                    <q-item-section avatar>Estado tecnico:</q-item-section>
                    <q-item-section>
                      <div class="row">
                        <q-radio v-model="data.estadoTecnico" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                          val="mal" label="Mal" color="secondary" />
                        <q-radio v-model="data.estadoTecnico" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                          val="regular" label="Regular" color="secondary" />
                        <q-radio v-model="data.estadoTecnico" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                          val="bien" label="Bien" color="secondary" />
                      </div>
                    </q-item-section>
                  </q-item>
                </div>
                <div>
                  <q-item>
                    <q-item-section avatar>Eficiencia:</q-item-section>
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
              <div class="q-mt-xl">Tipo de grasa:</div>
              <div>
                <q-radio v-model="data.tipoGrasa" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="si"
                  label="Si" color="secondary" />
                <q-radio v-model="data.tipoGrasa" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="no"
                  label="No" color="secondary" />
              </div>
              <div style="max-width: 100%" v-if="data.tipoGrasa=='si'">
                <p class="q-pl-md q-pt-sm"> Estado tecnico</p>
                <div class="row">
                  <q-input outlined dense v-model="data.estadoBien" type="number" label="Bien" class="q-pl-md"
                    style="max-width: 70px" />
                  <q-input outlined dense v-model="data.estadoRegular" type="number" label="Regular" class="q-pl-md"
                    style="max-width: 100px" />
                  <q-input outlined dense v-model="data.estadoMal" type="number" label="Mal" class="q-pl-md q-mb-md"
                    style="max-width: 70px" />
                </div>
              </div>
              <div>
                <q-item>
                  <q-item-section avatar>Politica ambiental:</q-item-section>
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
                  <q-item-section avatar>Diagnostico ambiental:</q-item-section>
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
                    type="number" style="max-width: 150px" />
                  <q-input outlined dense v-model="data.cumplidas_corto" label="Cumplidas a corto" class="q-pa-sm"
                    type="number" style="max-width: 170px" />
                </div>
                <div class="row">
                  <q-input outlined dense v-model="data.medidas_mediano
                  " label="Medidas a mediano" class="q-pa-sm" type="number" style="max-width: 170px" />
                  <q-input outlined dense v-model="data.cumplidas_mediano" label="Cumplidas a mediano" class="q-pa-sm"
                    type="number" style="max-width: 300px" />
                </div>
                <div class="row">
                  <q-input outlined dense v-model="data.medidas_largo" label="Medidas a largo" class="q-pa-sm"
                    type="number" style="max-width: 150px" />
                  <q-input outlined dense v-model="data.cumplidas_largo" label="Cumplidas a largo" class="q-pa-sm"
                    type="number" style="max-width: 170px" />
                </div>
              </div>
              <q-input outlined dense v-model="data.consumo_agua" label="Consumo de agua"
                class="q-mt-xl q-mb-md q-pa-sm" style="max-width: 200px" />
              <q-input outlined dense v-model="data.consumo_energetico" label="Consumo energetico"
                style="max-width: 200px" class="q-pa-sm" />
              <q-input v-model="data.deficiencias" filled type="textarea" label="Deficiencias"
                class="q-mt-xl q-mb-md q-pa-sm" style="min-width: 400px; width: 50%" />
              <q-input v-model="data.recomendaciones" filled type="textarea" label="Recomendaciones"
                class="q-mb-md q-pa-sm" style="min-width: 400px; width: 50%" />
              <q-input v-model="data.observaciones" filled type="textarea" label="Observaciones" class="q-mb-md q-pa-sm"
                style="min-width: 400px; width: 50%" />
            </q-card-section>

            <q-checkbox v-model="data.aprovechamiento" color="secondary" label="Aprovechamiento de residuales"
              true-value="si" false-value="no" class="full-width justify-center" />

            <aprovechamiento v-if="data.aprovechamiento=='si'" @addId='addingId' :idResidual="data.id_ResidualEdit" />

            <q-separator dark />

            <q-card-actions class="justify-end">
              <q-btn no-caps class="text-white bg-secondary" @click="Create">Agregar</q-btn>
              <q-btn no-caps class="text-white bg-secondary" @click="clear">Limpiar Campos</q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-btn no-caps class="text-white bg-secondary" @click="editFields">Editar</q-btn>
        <q-dialog v-model="data.cardEdit">
          <q-card class="my-card bg-primary" flat bordered>
            <q-item>
              <q-item-section>
                <q-item-label><b>Editar: "Acta de Control"</b></q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-card-section>
              <div class="row">
                <q-select class="col-8 q-mr-xl text-black" use-input input-debounce="0" dense outlined
                  v-model="data.entidadEdit" :options="options" @filter="filterFn" label="Entidad"
                  style="max-width: 50%" />
                <q-input outlined dense v-model="data.fechavisitaEdit" type="date" hint="Fecha de Visita" />
              </div>
              <q-input outlined dense v-model="data.atendido_porEdit" label="Atendido por" class="q-mt-xl q-mb-md"
                style="max-width: 50%" />
              <q-input outlined dense v-model="data.comision_controlEdit" label="Comision" style="max-width: 50%" />
              <div class="q-mt-xl">Sistema de tratamiento:</div>
              <div>
                <q-radio v-model="data.tratamientoEdit" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                  val="si" label="Si" color="secondary" />
                <q-radio v-model="data.tratamientoEdit" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                  val="no" label="No" color="secondary" />
              </div>
              <div style="max-width: 100%" v-if="data.tratamientoEdit=='si'">
                <p class="q-pl-md q-pt-sm"> Estado tecnico</p>
                <div>
                  <q-item>
                    <q-item-section avatar>Idoneidad:</q-item-section>
                    <q-item-section>
                      <div>
                        <q-radio v-model="data.idoniedadEdit" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                          val="si" label="Si" color="secondary" />
                        <q-radio v-model="data.idoniedadEdit" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                          val="no" label="No" color="secondary" />
                      </div>
                    </q-item-section>
                  </q-item>
                </div>
                <div>
                  <q-item>
                    <q-item-section avatar>Estado tecnico:</q-item-section>
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
                    <q-item-section avatar>Eficiencia:</q-item-section>
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
              <div class="q-mt-xl">Tipo de grasa:</div>
              <div>
                <q-radio v-model="data.tipoGrasaEdit" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                  val="si" label="Si" color="secondary" />
                <q-radio v-model="data.tipoGrasaEdit" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                  val="no" label="No" color="secondary" />
              </div>
              <div style="max-width: 100%" v-if="data.tipoGrasaEdit=='si'">
                <p class="q-pl-md q-pt-sm"> Estado tecnico</p>
                <div class="row">
                  <q-input outlined dense v-model="data.estadoBienEdit" type="number" label="Bien" class="q-pl-md"
                    style="max-width: 70px" />
                  <q-input outlined dense v-model="data.estadoRegularEdit" type="number" label="Regular" class="q-pl-md"
                    style="max-width: 100px" />
                  <q-input outlined dense v-model="data.estadoMalEdit" type="number" label="Mal" class="q-pl-md q-mb-md"
                    style="max-width: 70px" />
                </div>
              </div>
              <div>
                <q-item>
                  <q-item-section avatar>Politica ambiental:</q-item-section>
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
                  <q-item-section avatar>Diagnostico ambiental:</q-item-section>
                  <q-item-section>
                    <div>
                      <q-radio v-model="data.diagnosticoEdit" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                        val="si" label="Si" color="secondary" />
                      <q-radio v-model="data.diagnosticoEdit" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                        val="no" label="No" color="secondary" />
                    </div>
                  </q-item-section>
                </q-item>
              </div>
              <div class="column">
                <div class="row">
                  <q-input outlined dense v-model="data.medidas_cortoEdit" label="Medidas a corto" class="q-pa-sm"
                    type="number" style="max-width: 150px" />
                  <q-input outlined dense v-model="data.cumplidas_cortoEdit" label="Cumplidas a corto" class="q-pa-sm"
                    type="number" style="max-width: 170px" />
                </div>
                <div class="row">
                  <q-input outlined dense v-model="data.medidas_medianoEdit
                  " label="Medidas a mediano" class="q-pa-sm" type="number" style="max-width: 170px" />
                  <q-input outlined dense v-model="data.cumplidas_medianoEdit" label="Cumplidas a mediano"
                    class="q-pa-sm" type="number" style="max-width: 300px" />
                </div>
                <div class="row">
                  <q-input outlined dense v-model="data.medidas_largoEdit" label="Medidas a largo" class="q-pa-sm"
                    type="number" style="max-width: 150px" />
                  <q-input outlined dense v-model="data.cumplidas_largoEdit" label="Cumplidas a largo" class="q-pa-sm"
                    type="number" style="max-width: 170px" />
                </div>
              </div>
              <q-input outlined dense v-model="data.consumo_aguaEdit" label="Consumo de agua"
                class="q-mt-xl q-mb-md q-pa-sm" style="max-width: 200px" />
              <q-input outlined dense v-model="data.consumo_energeticoEdit" label="Consumo energetico"
                style="max-width: 200px" class="q-pa-sm" />
              <q-input v-model="data.deficienciasEdit" filled type="textarea" label="Deficiencias"
                class="q-mt-xl q-mb-md q-pa-sm" style="min-width: 400px; width: 50%" />
              <q-input v-model="data.recomendacionesEdit" filled type="textarea" label="Recomendaciones"
                class="q-mb-md q-pa-sm" style="min-width: 400px; width: 50%" />
              <q-input v-model="data.observacionesEdit" filled type="textarea" label="Observaciones"
                class="q-mb-md q-pa-sm" style="min-width: 400px; width: 50%" />
            </q-card-section>

            <q-checkbox v-model="data.aprovechamientoEdit" color="secondary" label="Aprovechamiento de residuales"
              true-value="si" false-value="no" class="full-width justify-center" />

            <aprovechamiento v-if="data.aprovechamientoEdit=='si'" @addId='addingId'
              :idResidual="data.id_ResidualEdit" />

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
import aprovechamiento from "components/aprovechamiento_.vue"
import { onMounted, reactive, ref, computed, watch } from "vue";
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
    name: "fechavisita",
    align: "center",
    label: "Fecha",
    field: "fechavisita",
    sortable: true,
  },
  {
    name: "politica_ambiental",
    align: "center",
    label: "Politica/Amb",
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

let data = reactive({
  fecha_actual: new Date(),
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
  diagnostico: "no",
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
  data.tratamiento= "no"
  data.idoniedad= ""
  data.estadoTecnico= ""
  data.eficiencia= ""

  data.tipoGrasa= "no"
  data.estadoBien= "0"
  data.estadoMal="0",
  data.estadoRegular= "0"
  data.politica= "no"
  data.diagnostico= "no"

  data.atendido_por= ""
  data.comision_control= ""
  data.consumo_agua= ""
  data.consumo_energetico= ""
  data.cumplidas_corto= "0"
  data.cumplidas_largo= "0"
  data.cumplidas_mediano= "0"
  data.deficiencias= ""
  data.diagnostico= "no"
  data.fechavisita= ""
  data.medidas_corto= "0"
  data.medidas_largo= "0"
  data.medidas_mediano="0"
  data.observaciones= ""
  data.politica_ambiental= ""
  data.recomendaciones= ""
  data.aprovechamiento= "no"
}

watch(() => model.value, (value) => {
  clear()
  data.entidades.forEach(element => {
    if (element.nombre == value) {
      const actualYear = new Date()
      api
        .get(`/actacontrols?populate=%2A&filters[fechavisita][$containsi]=${actualYear.getFullYear().toString()}&sort[0]=fechavisita%3Adesc`, {
          headers: {
            Authorization: "Bearer " + auth.jwt,
          },
        }).then(function (response) {
          console.log(response);
          for (let i = 0; i < response.data.data.length; i++) {
            if (response.data.data[i].attributes.entidad.data.id == element.id) {
              data.medidas_corto = response.data.data[i].attributes.medidas_corto
              data.medidas_largo = response.data.data[i].attributes.medidas_largo
              data.medidas_mediano = response.data.data[i].attributes.medidas_mediano
              data.cumplidas_corto = response.data.data[i].attributes.cumplidas_corto
              data.cumplidas_largo = response.data.data[i].attributes.cumplidas_largo
              data.cumplidas_mediano = response.data.data[i].attributes.cumplidas_mediano
              let residuales = "no"
              let element = [];
              for (let index = 0; index < response.data.data[i].attributes.residuals.data.length; index++) {
                element.push(response.data.data[i].attributes.residuals.data[index].id)
              }
              if (element.length > 0) residuales = "si"
              data.ResidualAntiguo = element
              for (let index = 0; index < data.ResidualAntiguo.length; index++) {
                data.id_ResidualEdit.push({ id: data.ResidualAntiguo[index] })
              }
              data.aprovechamiento = residuales
              break;
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  });
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

onMounted(() => {
  getYear()
  getActacontrol();
  getEntidad()
});

function getYear(params) {
  data.fecha_actual = data.fecha_actual.getFullYear()
}

function addingId(params) {
  data.id_Residual.push({ id: params })
  data.id_ResidualEdit.push({ id: params })
}

function editFields(params) {

  if (selected.value[0].residuals.length > 0) {
    data.aprovechamientoEdit = "si"
    for (let index = 0; index < selected.value[0].residuals.length; index++) {
      data.id_ResidualEdit.push({ id: selected.value[0].residuals[index] })
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
    (data.diagnosticoEdit = selected.value[0].diagnostico_ambiental),
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

function Edit(params) {
  data.entidades.forEach(element => {
    if (element.nombre == data.entidadEdit) data.identidadEdit = { id: element.id }
  });
  const dataRest = {
    data: {
      sistema_de_tratamiento: data.tratamientoEdit,
      idoneidad: data.idoniedadEdit,
      estado_tecnico: data.estadoTecnicoEdit,
      eficiencia: data.eficienciaEdit,

      trampa_de_grasa: data.tipoGrasaEdit,
      estadoGrasaBien: data.estadoBienEdit,
      estadoGrasaMal: data.estadoMalEdit,
      estadoGrasaRegular: data.estadoRegularEdit,
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
      diagnostico_ambiental: data.diagnosticoEdit,
      fechavisita: data.fechavisitaEdit,
      medidas_corto: data.medidas_cortoEdit,
      medidas_largo: data.medidas_largoEdit,
      medidas_mediano: data.medidas_medianoEdit,
      observaciones: data.observacionesEdit,
      politica_ambiental: data.politica_ambientalEdit,
      recomendaciones: data.recomendacionesEdit,
      entidad: data.identidadEdit,
      residuals: data.id_ResidualEdit
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
      //console.log(response);
      getActacontrol();
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
      sistema_de_tratamiento: data.tratamiento,
      eficiencia: data.eficiencia,
      estado_tecnico: data.estadoTecnico,
      idoneidad: data.idoniedad,
      trampa_de_grasa: data.tipoGrasa,
      estadoGrasaBien: data.estadoBien,
      estadoGrasaRegular: data.estadoRegular,
      estadoGrasaMal: data.estadoMal,
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
      //console.log(response);
      getActacontrol();
    })
    .catch(function (error) {
      console.log(error.response);
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
        getActacontrol()
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

async function getActacontrol(params) {
  data.rows = [];
  let count = 1
  await api
    .get(`/actacontrols?populate=%2A&filters[fechavisita][$containsi]=${data.fecha_actual}`, {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      //console.log(response);
      for (let i = 0; i < response.data.data.length; i++) {
        let residuales = "no"
        const element = [];
        for (let index = 0; index < response.data.data[i].attributes.residuals.data.length; index++) {
          element.push(response.data.data[i].attributes.residuals.data[index].id)
        }
        if (element.length > 0) residuales = "si"
        if (response.data.data[i].attributes.entidad.data != null) {
          data.rows.push({
            name: count,
            id: response.data.data[i].id,
            atendido_por: response.data.data[i].attributes.atendido_por,
            comision_control: response.data.data[i].attributes.comision_control,
            consumo_agua: response.data.data[i].attributes.consumo_agua,
            consumo_energetico: response.data.data[i].attributes.consumo_energetico,
            cumplidas_corto: response.data.data[i].attributes.cumplidas_corto,
            cumplidas_largo: response.data.data[i].attributes.cumplidas_largo,
            cumplidas_mediano: response.data.data[i].attributes.cumplidas_mediano,
            deficiencias: response.data.data[i].attributes.deficiencias,
            diagnostico_ambiental: response.data.data[i].attributes.diagnostico_ambiental,
            fechavisita: response.data.data[i].attributes.fechavisita,
            medidas_corto: response.data.data[i].attributes.medidas_corto,
            medidas_largo: response.data.data[i].attributes.medidas_largo,
            medidas_mediano: response.data.data[i].attributes.medidas_mediano,
            observaciones: response.data.data[i].attributes.observaciones,
            politica_ambiental: response.data.data[i].attributes.politica_ambiental,
            recomendaciones: response.data.data[i].attributes.recomendaciones,
            entidad: response.data.data[i].attributes.entidad.data.attributes.entidad,
            idEntidad: response.data.data[i].attributes.entidad.data.id,
            sistema_de_tratamiento: response.data.data[i].attributes.sistema_de_tratamiento,
            eficiencia: response.data.data[i].attributes.eficiencia,
            estado_tecnico: response.data.data[i].attributes.estado_tecnico,
            idoneidad: response.data.data[i].attributes.idoneidad,
            trampa_de_grasa: response.data.data[i].attributes.trampa_de_grasa,
            estadoGrasaBien: response.data.data[i].attributes.estadoGrasaBien,
            estadoGrasaRegular: response.data.data[i].attributes.estadoGrasaRegular,
            estadoGrasaMal: response.data.data[i].attributes.estadoGrasaMal,
            residuals: element,
            residuales: residuales
          });
        }
        count++
      }
    })
    .catch(function (error) {
      console.log(error);
    });

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