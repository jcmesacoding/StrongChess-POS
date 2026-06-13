import { createRouter, createWebHistory } from "vue-router";

import DashboardView from "../views/DashboardView.vue";
import ProductsView from "../views/ProductsView.vue";
import InventoryView from "../views/InventoryView.vue";
import SalesView from "../views/SalesView.vue";
import CustomersView from "../views/CustomersView.vue";
import ReportsView from "../views/ReportsView.vue";
import LoginView from "../views/LoginView.vue";
import DebtsView from "../views/DebtsView.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/users",
    name: "users",
    component: () => import("../views/UsersView.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/ProfileView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
  },
  {
    path: "/products",
    name: "products",
    component: ProductsView,
  },
  {
    path: "/inventory",
    name: "inventory",
    component: InventoryView,
  },
  {
    path: "/sales",
    name: "sales",
    component: SalesView,
  },
  {
    path: "/customers",
    name: "customers",
    component: CustomersView,
  },
  {
    path: "/debts",
    name: "debts",
    component: DebtsView,
  },
  {
    path: "/reports",
    name: "reports",
    component: ReportsView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");

  if (to.path === "/login") {
    return true;
  }

  if (!token) {
    return "/login";
  }

  return true;
});

export default router;
