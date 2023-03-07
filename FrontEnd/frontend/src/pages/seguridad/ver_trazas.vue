<template>
    <div>
      <q-card class="my-card q-ma-md bg-primary" bordered>
        <q-card-section>
          <q-table
            title="Trazas"
            :rows="data.rows"
            :columns="columns"
            row-key="name"
            v-model:pagination="pagination"
          />
        </q-card-section>
      </q-card>
    </div>
  </template>
  
  <script setup>
  import { onMounted, reactive, ref } from "vue";
  import { api } from "boot/axios.js";
  import { useAuthStore } from "src/stores/auth-store";
  
  const pagination = ref({
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10,
      })
  const auth = useAuthStore();
  const selected = ref([]);
  const columns = [
    {
      name: "No",
      required: true,
      label: "No",
      align: "left",
      field: (row) => row.name,
      format: (val) => `${val}`,
      sortable: true,
    },
    {
      name: "Fecha",
      align: "center",
      label: "Fecha",
      field: "Fecha",
      sortable: true,
    },
    {
      name: "Usuario",
      align: "center",
      label: "Usuario",
      field: "Usuario",
      sortable: true,
    },
    {
      name: "IP",
      align: "center",
      label: "IP",
      field: "IP",
      sortable: true,
    },
    {
      name: "Operacion",
      align: "center",
      label: "Operacion",
      field: "Operacion",
      sortable: true,
    },
    {
      name: "Resultado",
      align: "center",
      label: "Resultado",
      field: "Resultado",
      sortable: true,
    },
  ];
  
  let data = reactive({
    nameTraza: "",
    idTraza: "",
    noTraza: "",
    rows: [],
  });
  
  onMounted(() => {
    getTrazas();
  });
  
  function getTrazas(params) {
    api
      .get("/trazas?populate=%2A&sort[0]=fecha%3Adesc", {
        headers: {
          Authorization: "Bearer " + auth.jwt,
        },
      })
      .then(function (response) {
        //console.log(response);
        data.rows = [];
        for (let i = 0; i < response.data.data.length; i++) {
          data.rows.push({
            name: i+1,
            id: response.data.data[i].id,
            Usuario: response.data.data[i].attributes.user,
            Fecha:response.data.data[i].attributes.fecha.split("-")
                .reverse()
                .join("-"),
            IP:response.data.data[i].attributes.ip,
            Operacion:response.data.data[i].attributes.operacion,
            Resultado:response.data.data[i].attributes.resultado,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  
  </script>