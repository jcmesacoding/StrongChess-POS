import api from "./api";

export default {
  getAll() {
    return api.get("/users");
  },
  register(user) {
    return api.post("/auth/register", user);
  }
}