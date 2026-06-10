import api from "./api";

export default {

  getAll() {
    return api.get("/dashboard");
  },

  getById(id) {
    return api.get(`/dashboard/${id}`);
  },

  create(dashboard) {
    return api.post("/dashboard", dashboard);
  },

  update(id, dashboard) {
    return api.put(`/dashboard/${id}`, dashboard);
  },

  delete(id) {
    return api.delete(`/dashboard/${id}`);
  }

}