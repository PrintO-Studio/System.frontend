import { useAxios } from "@vueuse/integrations/useAxios";
import { http } from "@/main";

export default {
  actions: {
    async postProductImages(ctx, { productId, files, onSuccess, onError }) {
      return await useAxios(
        `/products/${productId}/images`,
        { method: "POST", data: files, cache: false },
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
