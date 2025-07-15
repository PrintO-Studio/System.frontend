import { createWebHistory, createRouter as _createRouter } from "vue-router";

import signUpPage from "./pages/signUpPage.vue";
import signInPage from "./pages/signInPage.vue";
import productsPage from "./pages/productsPage.vue";
import productCreationPage from "./pages/productCreationPage.vue";
import productEditPage from "./pages/productEditPage.vue";
import NotFoundPage from "./pages/notFoundPage.vue";
import ToolsPage from "./pages/toolsPage.vue";

export const PAGE_SIGN_UP = "/signUp";
export const PAGE_SIGN_IN = "/signIn";
export const PAGE_PRODUCTS = "/products";
export const PAGE_PRODUCT_CREATION = "/products/create";
export const PAGE_PRODUCT_EDIT = "/products/:id/edit";
export const PAGE_NOT_FOUND = "/:pathMatch(.*)*";
export const PAGE_TOOLS = "/tools";

export const routes = [
  { path: PAGE_SIGN_UP, component: signUpPage },
  { path: PAGE_SIGN_IN, component: signInPage },
  { path: PAGE_PRODUCTS, component: productsPage },
  { path: PAGE_PRODUCT_CREATION, component: productCreationPage },
  { path: PAGE_PRODUCT_EDIT, component: productEditPage },
  { path: PAGE_NOT_FOUND, component: NotFoundPage },
  { path: PAGE_TOOLS, component: ToolsPage },
];
routes.forEach((r) => (r.name = r.path));

export function createRouter() {
  return _createRouter({
    history: createWebHistory(),
    routes,
  });
}
