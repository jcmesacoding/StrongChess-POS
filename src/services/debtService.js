import api from "./api";

export default {
  getAll() {
    return api.get("/debts");
  },
  pay(id, amount) {
    return api.post(`/debts/${id}/pay`, { amount });
  }
}