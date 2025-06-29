import { useAxios } from "@vueuse/integrations/useAxios";
import { http } from "@/main";

export default {
  actions: {
    async getFigurine(ctx, { productId, onSuccess, onError }) {
      return await useAxios(
        `/products/${productId}/figurine`,
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
    async postFigurine(ctx, { input, onSuccess, onError }) {
      return await useAxios(
        `/products/figurines`,
        { method: "POST", data: { ...input }, cache: false },
        http,
        {
          immediate: true,
          abortPrevious: true,
        },
      )
        .then((response) => onSuccess(response))
        .catch((error) => onError(error));
    },
    async patchFigurine(ctx, { productId, input, onSuccess, onError }) {
      return await useAxios(
        `/products/${productId}/figurines`,
        { method: "PATCH", data: { ...input }, cache: false },
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
