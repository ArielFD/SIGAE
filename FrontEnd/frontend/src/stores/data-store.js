import { defineStore } from "pinia";
import { api } from "boot/axios.js";

export const useDataStore = defineStore({
  id: "data",
  state: () => ({
    organismo: [],
    estado:[],
    municipio:[],
    organismo:[],
    osde:[],
    oace:[],
    salida:[],
    prioridad:[],
    unidad:[],
    categoria:[]
  }),
  getters: {
  },
  actions: {
  },
});
