import api from "./api";

export default {

  getAll() {
    return api.get("/providers");
  },

  getById(id) {
    return api.get(`/providers/${id}`);
  },

  create(provider) {
    return api.post("/providers", provider);
  },

  update(id, provider) {
    return api.put(`/providers/${id}`, provider);
  },

  delete(id) {
    return api.delete(`/providers/${id}`);
  }

}