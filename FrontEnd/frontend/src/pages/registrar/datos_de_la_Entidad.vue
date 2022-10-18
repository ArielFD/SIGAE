<template>
    <div>
        <q-card class="my-card q-ma-md bg-primary" bordered>
            <q-card-section>
                <q-table class="my-sticky-header-table" title="Datos de las Entidades" :rows="data.rows" :columns="columns"
                    row-key="name" :selected-rows-label="getSelectedString" selection="multiple"
                    v-model:selected="selected" v-model:pagination="pagination" />
            </q-card-section>

            <q-card-actions class="justify-end">
                <q-btn no-caps class="text-white bg-secondary" @click="data.cardCreate = true">Insertar</q-btn>
                <q-dialog v-model="data.cardCreate">
                    <q-card class="my-card bg-primary" flat bordered>
                        <q-item>
                            <q-item-section>
                                <q-item-label><b>Nueva: "Entidad"</b></q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />

                        <q-card-section>
                            <div>
                                <q-input outlined dense v-model="data.entidad" type="text" label="Nombre de la Entidad" class="q-pa-xs"/>
                                <q-input outlined dense v-model="data.director" type="text" label="Nombre del Director" class="q-pa-xs"/>
                                <q-input outlined dense v-model="data.coordinador" type="text" label="Nombre del Coordinador" class="q-pa-xs"/>
                                <q-input outlined dense v-model="data.telefono" type="text" label="Telefono" class="q-pa-xs"/>
                                <q-input outlined dense v-model="data.trabajadores" type="number" label="Cantidad de Trabajadores" class="q-pa-xs" />
                                <q-select class="text-black q-pa-xs"  dense outlined
                                    v-model="data.fuente" :options="data.fuentes"  label="Tipo de fuente" />
                                    <q-select class="text-black q-pa-xs"  dense outlined
                                    v-model="data.municipio" :options="data.municipios"  label="Municipio" />
                                    <q-select class="text-black q-pa-xs"  dense outlined
                                    v-model="data.organismo" :options="data.organismos"  label="Organismo" />
                                <q-input outlined dense v-model="data.objeto" type="textarea" hint="Objeto social" class="q-pa-xs" />
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
                                <q-item-label><b>Editar: "Entidad"</b></q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />

                        <q-card-section>
                            <div>
                                <q-input outlined dense v-model="data.entidadEdit" type="text" label="Nombre de la Entidad" class="q-pa-xs"/>
                                <q-input outlined dense v-model="data.directorEdit" type="text" label="Nombre del Director" class="q-pa-xs"/>
                                <q-input outlined dense v-model="data.coordinadorEdit" type="text" label="Nombre del Coordinador" class="q-pa-xs"/>
                                <q-input outlined dense v-model="data.telefonoEdit" type="text" label="Telefono" class="q-pa-xs"/>
                                <q-input outlined dense v-model="data.trabajadoresEdit" type="number" label="Cantidad de Trabajadores" class="q-pa-xs" />
                                <q-select class="text-black q-pa-xs"  dense outlined
                                    v-model="data.fuenteEdit" :options="data.fuentes" label="Tipo de fuente" />
                                    <q-select class="text-black q-pa-xs"  dense outlined
                                    v-model="data.municipioEdit" :options="data.municipios"  label="Municipio" />
                                    <q-select class="text-black q-pa-xs"  dense outlined
                                    v-model="data.organismoEdit" :options="data.organismos"  label="Organismo" />
                                <q-input outlined dense v-model="data.objetoEdit" type="textarea" hint="Objeto social" class="q-pa-xs" />
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
      rowsPerPage: 10,
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
        name: "organismo",
        align: "center",
        label: "organismo",
        field: "organismo",
        sortable: true,
      },
      {
        name: "municipio",
        align: "center",
        label: "Municipio",
        field: "municipio",
        sortable: true,
      },
      {
        name: "fuente",
        align: "center",
        label: "Fuente",
        field: "fuente",
        sortable: true,
      },
      {
        name: "director",
        align: "center",
        label: "Director",
        field: "director",
        sortable: true,
      },
      {
        name: "telefono",
        align: "center",
        label: "Telefono",
        field: "telefono",
        sortable: true,
      },
      {
        name: "coordinador",
        align: "center",
        label: "Coordinador",
        field: "coordinador",
        sortable: true,
      }];
    
    let data = reactive({
      rows: [],
      entidad:"",
      organismo:"",
      organismos:[],
      objOrganismo:[],
      municipio:"",
      municipios:[],
      objMunicipio:[],
      trabajadores:"",
      objeto:"",
      fuente:"",
      director:"",
      telefono:"",
      coordinador:"",

      entidadEdit:"",
      organismoEdit:"",
      municipioEdit:"",
      trabajadoresEdit:"",
      objetoEdit:"",
      fuenteEdit:"",
      directorEdit:"",
      telefonoEdit:"",
      coordinadorEdit:"",

      cardEdit: false,
      cardCreate: false,
    });
    
    onMounted(() => {
        getEntidades()
        getMunicipios()
        getOrganismos()
    });
    
    function editFields(params) {
        (data.entidadEdit = selected.value[0].entidad),
        (data.directorEdit = selected.value[0].director),
        (data.coordinadorEdit = selected.value[0].coordinador),
        (data.telefonoEdit = selected.value[0].telefono),
        (data.trabajadoresEdit = selected.value[0].trabajadores),
        (data.fuenteEdit = selected.value[0].fuente),
        (data.municipioEdit = selected.value[0].municipio),
        (data.organismoEdit = selected.value[0].organismo),
        (data.objetoEdit = selected.value[0].objeto),
        (data.cardEdit = true);
    }
    
    function Edit(params) {
        let idMunicipio=[]
        let idOrganismo=[]
      data.objMunicipio.forEach(element => {
        if(element.municipio==data.municipioEdit) idMunicipio=[{id:element.id}]
      });
      data.objOrganismo.forEach(element => {
        if(element.organismo==data.organismoEdit) idOrganismo=[{id:element.id}]
      });
      const dataRest = {
        data: {
          organismo:idOrganismo,
          municipio:idMunicipio,
          entidad:data.entidadEdit,
          nomb_coordinador:data.coordinadorEdit,
          nomb_director:data.directorEdit,
          num_telefono:data.telefonoEdit,
          cant_trabajadores:data.trabajadoresEdit,
          tipo_fuente:data.fuenteEdit,
          objeto_social:data.objetoEdit
        },
      };
    
      const authorization = {
        headers: {
          Authorization: `Bearer ${auth.jwt}`,
        },
      };
    
      api
        .put(`/entidads/${selected.value[0].id}`, dataRest, authorization)
        .then(function (response) {
          console.log(response);
          getEntidades();
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
    
    function Create() {
        let idMunicipio=[]
        let idOrganismo=[]
      data.objMunicipio.forEach(element => {
        if(element.municipio==data.municipio) idMunicipio=[{id:element.id}]
      });
      data.objOrganismo.forEach(element => {
        if(element.organismo==data.organismo) idOrganismo=[{id:element.id}]
      });
      const dataRest = {
        data: {
          organismo:idOrganismo,
          municipio:idMunicipio,
          entidad:data.entidad,
          nomb_coordinador:data.coordinador,
          nomb_director:data.director,
          num_telefono:data.telefono,
          cant_trabajadores:data.trabajadores,
          tipo_fuente:data.fuente,
          objeto_social:data.objeto
        },
      };
    
      const authorization = {
        headers: {
          Authorization: `Bearer ${auth.jwt}`,
        },
      };
    
      api
        .post("/entidads", dataRest, authorization)
        .then(function (response) {
          console.log(response);
          getEntidades();
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
    
    function Delete(params) {
      for (let index = 0; index < selected.value.length; index++) {
        api
          .delete(`/entidads/${selected.value[index].id}`, {
            headers: {
              Authorization: "Bearer " + auth.jwt,
            },
          })
          .then(function (response) {
            getEntidades()
          })
          .catch(function (error) {
            console.log(error);
          });
    
      }
      selected.value = []
    }
    
    async function getMunicipios(params) {
        let count=1
      for (let index = 1; index < 2; index++) {
        await api
          .get(`/municipios?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100`, {
            headers: {
              Authorization: "Bearer " + auth.jwt,
            },
          })
          .then(function (response) {
            console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
            data.objMunicipio.push({
                id: response.data.data[i].id,
                municipio:response.data.data[i].attributes.municipio
              });
              data.municipios.push(response.data.data[i].attributes.municipio)
              count++
              console.log(data.municipios);
            }
          })
          .catch(function (error) {
            console.log(error.response);
          });
      }
    }

    async function getOrganismos(params) {
        let count=1
      for (let index = 1; index < 2; index++) {
        await api
          .get(`/organismos?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100`, {
            headers: {
              Authorization: "Bearer " + auth.jwt,
            },
          })
          .then(function (response) {
            console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
            data.objOrganismo.push({
                id: response.data.data[i].id,
                organismo:response.data.data[i].attributes.organismo
              });
              data.organismos.push(response.data.data[i].attributes.organismo)
              count++
            }
            console.log(data.organismos);
          })
          .catch(function (error) {
            console.log(error.response);
          });
      }
    }
    
    async function getEntidades(params) {
      data.rows = [];
      let count=1
      for (let index = 1; index < 3; index++) {
        await api
          .get(`/entidads?populate=%2A&pagination[page]=${index}&pagination[pageSize]=100`, {
            headers: {
              Authorization: "Bearer " + auth.jwt,
            },
          })
          .then(function (response) {
            console.log(response);
            for (let i = 0; i < response.data.data.length; i++) {
            if(response.data.data[i].attributes.organismo.data.length==0) response.data.data[i].attributes.organismo.data.push({attributes:{organismo:"-"}})
            if(response.data.data[i].attributes.municipio.data.length==0) response.data.data[i].attributes.municipio.data.push({attributes:{municipio:"-"}})
              data.rows.push({
                name: count,
                id: response.data.data[i].id,
                entidad:response.data.data[i].attributes.entidad,
                municipio:response.data.data[i].attributes.municipio.data[0].attributes.municipio,
                trabajadores:response.data.data[i].attributes.cant_trabajadores,
                objeto:response.data.data[i].attributes.objeto_social,
                coordinador:response.data.data[i].attributes.nomb_coordinador,
                director:response.data.data[i].attributes.nomb_director,
                telefono:response.data.data[i].attributes.num_telefono,
                organismo:response.data.data[i].attributes.organismo.data[0].attributes.organismo,
                fuente:response.data.data[i].attributes.tipo_fuente,
              });
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