import { store } from "./main";

export async function ozonUpdate(figurineId, onSuccess, onError) {
  await store.dispatch("postUpdateFigurineOzon", {
    id: figurineId,
    onSuccess,
    onError,
  });
}

export async function wbUpdate(figurineId, onSuccess, onError) {
  await store.dispatch("postUpdateFigurineWb", {
    id: figurineId,
    onSuccess,
    onError,
  });
}
