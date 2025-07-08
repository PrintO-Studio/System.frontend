import { useAxios } from "@vueuse/integrations/useAxios";
import { http } from "@/main";

export default {
  actions: {
    async postNote(ctx, { productId, input, onSuccess, onError }) {
      return await useAxios(
        `/products/${productId}/notes`,
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
    async patchNote(ctx, { productId, id, input, onSuccess, onError }) {
      return await useAxios(
        `/products/${productId}/notes/${id}`,
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
    async deleteNote(ctx, { productId, id, onSuccess, onError }) {
      return await useAxios(
        `/products/${productId}/notes/${id}`,
        { method: "DELETE", cache: false },
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
