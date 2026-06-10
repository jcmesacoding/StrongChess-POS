import api from "./api";

export default {

  getAll() {
    return api.get("/employees");
  },

  getById(id) {
    return api.get(`/employees/${id}`);
  },

  create(employee) {
    return api.post("/employees", employee);
  },

  update(id, employee) {
    return api.put(`/employees/${id}`, employee);
  },

  delete(id) {
    return api.delete(`/employees/${id}`);
  }

}