<template>
  <div class="q-pa-md">
    <q-table title="Tabla de Aprovechamiento de Residuales" dense :rows="data.rows" :columns="columns" row-key="name"
      selection="single" v-model:selected="selected" />

    <q-btn no-caps class="text-white bg-secondary q-pa-sm q-ma-sm" @click="data.cardCreate = true">Agregar</q-btn>
    <q-dialog v-model="data.cardCreate">
      <q-card class="my-card bg-primary" style="width:300px">
        <q-card-section>
          <div class="text-h6">Nuevo Residual</div>
        </q-card-section>
        <form @submit.prevent.stop="onCreate">
        <q-card-section class="row q-pa-sm">
          <q-select class="col-6 q-pa-sm text-black" dense outlined v-model="data.categoria" :options="data.category"
            label="Categoria" lazy-rules :rules="alerts.inputRules" ref="categoria"/>
          <q-input class="col-6 q-pa-sm text-black" outlined dense v-model="data.tipoResidual" label="Tipo de residual"
            lazy-rules :rules="alerts.inputRules" ref="tipoResidual"/>
          <q-input class="col-6 q-pa-sm text-black" outlined dense v-model="data.cantidadGenerada"
            label="Cantidad generada" lazy-rules :rules="alerts.inputRules" ref="cantidadGenerada"/>
          <q-select class="col-6 q-pa-sm text-black" dense outlined v-model="data.unidad" :options="data.unid"
            label="Unidad" lazy-rules :rules="alerts.inputRules" ref="unidad"/>
          <q-input outlined dense v-model="data.disposicionFinal" label="Disposicion final"
            class="col-12 q-pa-sm text-black" lazy-rules :rules="alerts.inputRules" ref="disposicionFinal"/>
          <q-input outlined dense v-model="data.aprovechamiento" label="Aprovechamiento economico"
            class="col-10 q-pa-sm text-black" lazy-rules :rules="alerts.inputRules" ref="aprovechamiento"/>
          <q-input outlined dense v-model="data.fecha" type="date" class="col-8 q-pa-sm text-black" lazy-rules :rules="alerts.inputRules" ref="fecha"/>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat color="secondary" label="Crear" type="submit" />
        </q-card-actions>
      </form>
      </q-card>
    </q-dialog>
    <q-btn no-caps class="text-white bg-secondary q-pa-sm q-ma-sm" @click="Delete">Eliminar</q-btn>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { api } from "boot/axios.js";
import { useAuthStore } from "src/stores/auth-store";
import { useAlertsRulesStore } from "src/stores/alerts-rules-store";
import { useQuasar } from "quasar";

const emit = defineEmits(["addId"])
const props = defineProps(["idResidual"])

const $q = useQuasar();
const auth = useAuthStore();
const alerts = useAlertsRulesStore();
const selected = ref([]);
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Categoria',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'tipoResidual', align: 'center', label: 'Tipo de Residual', field: 'tipoResidual', sortable: true },
  { name: 'cantidadGenerada', label: 'Cantidad generada', field: 'cantidadGenerada', sortable: true },
  { name: 'unidad', label: 'Unidad', field: 'unidad' },
  { name: 'disposicionFinal', label: 'Disposicion final', field: 'disposicionFinal' },
  { name: 'aprovechamiento', label: 'Aprovecahmiento economico', field: 'aprovechamiento' },
  { name: 'fecha', label: 'Fecha', field: 'fecha', sortable: true },
]

const rows = []

const categoria = ref(null);
const unidad = ref(null);
const aprovechamiento = ref(null);
const cantidadGenerada = ref(null);
const disposicionFinal = ref(null);
const fecha = ref(null);
const tipoResidual = ref(null);

let data = reactive({
  test: [],
  categorias: [],
  category: [],
  unidades: [],
  unid: [],
  rows: [],

  arrIdResidual: [],

  cardCreate: false,

  categoria: "",
  unidad: "",
  aprovechamiento: "",
  cantidadGenerada: "",
  disposicionFinal: "",
  fecha: "",
  tipoResidual: ""
})
onMounted(() => {
  if (props.idResidual) {
    props.idResidual.forEach(element => {
      data.arrIdResidual.push(element.id)
    });
  }
  getCategorias()
  getUnidades()
  getResidual(data.arrIdResidual)
})

function Create() {
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
      categorias: tempCategory,
      unidads: tempUnid,
      aprovechamiento_cant: data.aprovechamiento,
      cantidad: data.cantidadGenerada,
      disposicion: data.disposicionFinal,
      fecha_residual: data.fecha,
      tipo_residual: data.tipoResidual
    },
  };
  console.log(dataRest);

  const authorization = {
    headers: {
      Authorization: `Bearer ${auth.jwt}`,
    },
  };

  api
    .post("/residuals", dataRest, authorization)
    .then(function (response) {
      console.log(response);
      data.cardCreate = false
      alerts.alerts[1].message = "Aprovechamiento creado";
      $q.notify(alerts.alerts[1]);
      data.arrIdResidual.push(response.data.data.id)
      getResidual(data.arrIdResidual);
      emit('addId', response.data.data.id)
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo creando el Aprovechamiento";
      $q.notify(alerts.alerts[0]);
      console.log(error.response);
    });
}

function Delete(params) {
  let tempId = selected.value[0].id
  api
    .delete(`/residuals/${tempId}`, {
      headers: {
        Authorization: "Bearer " + auth.jwt,
      },
    })
    .then(function (response) {
      console.log(response);
      alerts.alerts[1].message = "Aprovechamiento eliminado";
      $q.notify(alerts.alerts[1]);
      for (let index = 0; index < data.arrIdResidual.length; index++) {
        if (tempId == data.arrIdResidual[index]) {
          data.arrIdResidual.splice(index, 1)
        }
      }
      getResidual(data.arrIdResidual)
    })
    .catch(function (error) {
      alerts.alerts[0].message = "Fallo eliminando el Aprovechamiento";
      $q.notify(alerts.alerts[0]);
      console.log(error);
    });
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

function getResidual(params) {
  data.rows = []
  for (let index = 0; index < params.length; index++) {
    api
      .get(`/residuals/${params[index]}?populate=%2A`, {
        headers: {
          Authorization: "Bearer " + auth.jwt,
        },
      })
      .then(function (response) {
        console.log(response);
        if (response.data.data.attributes.categorias.data.length == 0) response.data.data.attributes.categorias.data.push({ attributes: { categoria: "-" } })
        if (response.data.data.attributes.unidads.data.length == 0) response.data.data.attributes.unidads.data.push({ attributes: { unidad: "-" } })
        data.rows.push({
          name: response.data.data.attributes.categorias.data[0].attributes.categoria,
          id: params[index],
          unidad: response.data.data.attributes.unidads.data[0].attributes.unidad,
          aprovechamiento: response.data.data.attributes.aprovechamiento_cant,
          cantidadGenerada: response.data.data.attributes.cantidad,
          disposicionFinal: response.data.data.attributes.disposicion,
          fecha: response.data.data.attributes.fecha_residual,
          tipoResidual: response.data.data.attributes.tipo_residual
        });
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

function onCreate() {
  categoria.value.validate();
  unidad.value.validate();
  aprovechamiento.value.validate();
  cantidadGenerada.value.validate();
  disposicionFinal.value.validate();
  fecha.value.validate();
  tipoResidual.value.validate();

  if (categoria.value.hasError || unidad.value.hasError ||  aprovechamiento.value.hasError || cantidadGenerada.value.hasError || disposicionFinal.value.hasError || fecha.value.hasError || tipoResidual.value.hasError) {
    alerts.alerts[0].message = "Rellene todo los campos obligatorios";
    $q.notify(alerts.alerts[0]);
    // form has error
  } else {
    Create();
  }
}

</script>