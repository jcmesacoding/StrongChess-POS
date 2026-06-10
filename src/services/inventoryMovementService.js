import api from "./api";

export default {
  findAll() {
    return api.get("/inventory-movements");
  },

  registerEntry(data) {
    return api.post("/inventory-movements/entry", data);
  },

  registerOutput(data) {
    return api.post("/inventory-movements/output", data);
  },

  registerAdjustment(data) {
    return api.post("/inventory-movements/adjustment", data);
  },
};
