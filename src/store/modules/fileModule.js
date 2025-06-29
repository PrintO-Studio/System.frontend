import { useAxios } from "@vueuse/integrations/useAxios";
import { http } from "@/main";

export default {
  actions: {
    async putProductFiles(ctx, { productId, files, onSuccess, onError }) {
      let formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const config = {
        method: "PUT",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 10 * 60 * 1000, // 10m
        cache: false,
      };

      return await useAxios(`/products/${productId}/files`, config, http, {
        immediate: true,
        abortPrevious: true,
      })
        .then((response) => onSuccess(response))
        .catch((error) => onError(error));
    },
    async deleteProductFile(ctx, { productId, id, onSuccess, onError }) {
      return await useAxios(
        `/products/${productId}/files/${id}`,
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
