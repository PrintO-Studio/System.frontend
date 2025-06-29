import { useAxios } from "@vueuse/integrations/useAxios";
import { http } from "@/main";

export default {
  actions: {
    async getAllProducts(ctx, { startIndex, pageSize, onSuccess, onError }) {
      return await useAxios(
        `/products?startIndex=${startIndex}&pageSize=${pageSize}`,
        { method: "GET", cache: false },
        http,
        {
          immediate: true,
          abortPrevious: true,
        },
      )
        .then((response) => onSuccess(response))
        .catch((error) => onError(error));
    },
  },
  mutations: {},
  state: {},
  getters: {},
};
