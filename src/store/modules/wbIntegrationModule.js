import { useAxios } from "@vueuse/integrations/useAxios";
import { http, router } from "@/main";

export default {
  actions: {
    async postUpdateFigurineWb(ctx, { id, onSuccess, onError }) {
      return await useAxios(
        `integrations/wildberries/figurines/${id}/update`,
        { method: "POST", cache: false, timeout: 1 * 60 * 1000 },
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
