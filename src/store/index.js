import { createStore as _createStore } from "vuex";

import authModule from "./modules/authModule";
import userModule from "./modules/userModule";
import productModule from "./modules/productModule";
import figurineModule from "./modules/figurineModule";
import fileModule from "./modules/fileModule";
import imageModule from "./modules/imageModule";
import noteModule from "./modules/noteModule";

export function createStore() {
  return _createStore({
    modules: {
      authModule,
      userModule,
      productModule,
      figurineModule,
      fileModule,
      imageModule,
      noteModule,
    },
  });
}
