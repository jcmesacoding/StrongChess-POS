import api from "./api";

export default {
  getAll() {
    return api.get("/dashboard");
  },
  getSalesByDay() {
    return api.get("/dashboard/sales-by-day");
  },
  getSalesByMonth() {
    return api.get("/dashboard/sales-by-month");
  },
  getTopProducts() {
    return api.get("/dashboard/top-products");
  }
}