import { useAxios } from "@vueuse/integrations/useAxios";
import { http, router } from "@/main";

export default {
  actions: {
    async getMyMemberships(ctx, { onSuccess, onError }) {
      return await useAxios(
        `/users/me/memberships`,
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
    async postSelectStore(ctx, { onSuccess, storeId, onError }) {
      return await useAxios(
        `/users/me/memberships/${storeId}/select`,
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
