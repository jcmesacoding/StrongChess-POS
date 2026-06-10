import api from "./api";

export default {

  getAll() {
    return api.get("/sales");
  },

  getById(id) {
    return api.get(`/sales/${id}`);
  },

  create(sale) {
    return api.post("/sales", sale);
  },

  update(id, sale) {
    return api.put(`/sales/${id}`, sale);
  },

  delete(id) {
    return api.delete(`/sales/${id}`);
  }

}