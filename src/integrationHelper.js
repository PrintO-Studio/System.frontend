import { store } from "./main";

export async function ozonUpload(figurineId, onSuccess, onError) {
  return await ozonUpdate(figurineId, onSuccess, onError);
}
export async function ozonUpdate(figurineId, onSuccess, onError) {
  await store.dispatch("postUploadFigurine", {
    id: figurineId,
    onSuccess,
    onError,
  });
}
