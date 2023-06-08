import { defineStore } from "pinia";

export const useAlertsRulesStore = defineStore({
  id: "alertRules",
  state: () => ({
    alerts: [
        { color: "negative", message: "", icon: "error" },
        { color: "secondary", message: "", icon: "done" },
        { color: "warning", message: "", icon: "warning" },
      ],
      emailRules: [(val) => (val && val.length > 0) || "Campo obligatorio"],
      inputRules: [(val) => (val && val.length > 0) || "Campo obligatorio"],
      inputTelephone: [(val) => (val && val.length == 8) || "Numero de telefono incorrecto"],
      ageRules: [(val) => (val > 0 && val < 120) || "Edad Incorrecta"],
      passRules: [(val) => (val && val.length > 0) || "Campo obligatorio"],
      carnetID: [
        (val) => val.length == 11 || "CI Incorrecto longitud menor 11",
        (val) =>
          val.substring(0, 1) >= 0 ||
          val.substring(0, 1) <= 99 ||
          "CI Incorrecto anos",
        (val) =>
          val.substring(2, 3) >= 1 ||
          val.substring(2, 3) <= 12 ||
          "CI Incorrecto mes",
        (val) =>
          val.substring(4, 5) >= 1 ||
          val.substring(4, 5) <= 31 ||
          "CI Incorrecto dia",
      ],
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    // increment() {
    //   this.counter++;
    // },
  },
});
