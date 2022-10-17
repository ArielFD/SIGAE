import { defineStore } from "pinia";

export const useDataStore = defineStore({
  id: "layout",
  state: () => ({
    insertarActa: false,
    mostrarActa: false,
    editarActa: false,
    estado: [],

    //######################Organismo#######################
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
  },
});
