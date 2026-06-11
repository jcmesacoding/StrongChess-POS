import api from "./api";

export default {
  getAll() {
    return api.get("/users");
  },
  getMe() {
    return api.get("/users/me");
  },
  register(user) {
    return api.post("/auth/register", user);
  },
  update(id, user) {
    return api.put(`/users/${id}`, user);
  },
  delete(id) {
    return api.delete(`/users/${id}`);
  },
};
