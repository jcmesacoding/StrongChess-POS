import api from "./api";

export default {

  getAll() {
    return api.get("/voucher-types");
  },

  getById(id) {
    return api.get(`/voucher-types/${id}`);
  },

  create(voucherType) {
    return api.post("/voucher-types", voucherType);
  },

  update(id, voucherType) {
    return api.put(`/voucher-types/${id}`, voucherType);
  },

  delete(id) {
    return api.delete(`/voucher-types/${id}`);
  }

}