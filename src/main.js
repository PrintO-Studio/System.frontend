import { createApp } from "vue";
import "./style.css";
import App from "./app.vue";
import { createRouter } from "./router";
import { createStore } from "./store";
import axios from "axios";
import { setupCache } from "axios-cache-interceptor";

export const http = setupCache(
  axios.create({
    baseURL: import.meta.env.VITE_API_SERVER,
    adapter: axios.defaults.adapter,
    withCredentials: true,
    timeout: 5000,
    headers: {
      common: {
        "Cache-Control": "no-cache",
      },
    },
  }),
);

export const router = createRouter();
export const store = createStore();

const app = createApp(App);

app.use(router);
app.use(store);

router.isReady().then(() => app.mount("#app"));
