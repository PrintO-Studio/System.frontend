import { useAxios } from "@vueuse/integrations/useAxios";
import { http, router } from "@/main";

export default {
  actions: {
    async postUploadFigurine(ctx, { id, onSuccess, onError }) {
      return await useAxios(
        `integrations/ozon/figurines/${id}/upload`,
        { method: "POST", cache: false },
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
