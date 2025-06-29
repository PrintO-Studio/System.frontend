import { useAxios } from "@vueuse/integrations/useAxios";
import { http, router } from "@/main";
import { PAGE_SIGN_IN } from "@/router";

export default {
  actions: {
    async postSignUpUser(ctx, { input, token, onSuccess, onError }) {
      return await useAxios(
        `/auth/signUp?token=${token}`,
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
    async postSignInUser(ctx, { input, onSuccess, onError }) {
      return await useAxios(
        `/auth/signIn`,
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
    async getMe(ctx, { onSuccess, onError }) {
      return await useAxios(`/auth/me`, { method: "GET", cache: false }, http, {
        immediate: true,
        abortPrevious: true,
      })
        .then((response) => onSuccess(response))
        .catch((error) => onError(error));
    },
    async getIsAuthenticated(ctx, { onSuccess, onError }) {
      return await useAxios(
        `/auth/isAuthenticated`,
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
    async postLogOut(ctx, { onSuccess, onError }) {
      return await useAxios(
        `/auth/logOut`,
        { method: "POST", cache: false },
        http,
        {
          immediate: true,
          abortPrevious: true,
        },
      )
        .then((response) => router.push(response.data.value.next))
        .catch((error) => {
          router.push(PAGE_SIGN_IN);
          onError(error);
        });
    },
  },
  mutations: {},
  state: {},
  getters: {},
};
