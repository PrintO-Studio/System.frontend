<script lang="ts">
import Page from "@/components/page.vue";
import NavigationBar from "@/components/navigationBar.vue";
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import Textarea from "@/components/ui/textarea/Textarea.vue";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FigurineVariation from "@/components/figurine/figurineVariation.vue";
import ProductFilesTable from "@/components/productFilesTable.vue";
import ProductImagesEditor from "@/components/productImagesEditor.vue";
import GoBackButton from "@/components/goBackButton.vue";

import { Loader2, Plus, Upload, Save } from "lucide-vue-next";
import { PAGE_PRODUCTS } from "@/router";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { z } from "zod";
import { displaySonnerError, displaySonnerSuccess } from "@/store/sonnerHelper";
import { newFigurineVariation, rawFigurineSchema } from "@/components/figurine";
import { useFileDialog } from "@vueuse/core";

export default {
  components: {
    Page,
    NavigationBar,
    Button,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Input,
    Textarea,
    FigurineVariation,
    ProductFilesTable,
    ProductImagesEditor,
    GoBackButton,
    Loader2,
    Plus,
    Upload,
    Save,
  },
  data() {
    return {
      PAGE_PRODUCTS,
      tab: this.$route.query.tab ?? "properties",
    };
  },
  watch: {
    tab(newVal) {
      this.$router.replace({ query: { tab: newVal } });
    },
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const isSubmitting = ref(false);
    const isProductLoading = ref(false);
    const isUploading = ref(false);
    const SKU = ref();
    const files = ref([]);
    const productId = parseInt(String(route.params.id));
    const images = ref(undefined);
    const isSavingOrder = ref(false);
    let initialVariations = [];

    fetchEditProduct();

    async function fetchEditProduct() {
      isProductLoading.value = true;
      await store.dispatch("getFigurine", {
        productId,
        onSuccess: (response) => {
          let product = response.data.value.product;
          let variations = (initialVariations = response.data.value.variations);
          SKU.value = product.sku;
          files.value = product.files.sort((a, b) => {
            if (a.contentType < b.contentType) {
              return -1;
            }
            if (a.contentType > b.contentType) {
              return 1;
            }
            return 0;
          });
          images.value = product.images;

          form.setValues({
            product: response.data.value.product,
            variations: variations,
          });
        },
        onError: (error) => {
          displaySonnerError(error);
        },
      });
      isProductLoading.value = false;
    }

    const formSchema = toTypedSchema(
      z.object({
        product: z.object({
          name: z.string().min(1).max(100),
          description: z.string().max(5000).optional(),
        }),
        variations: z.array(rawFigurineSchema).optional(),
      }),
    );

    const form = useForm({
      validationSchema: formSchema,
      initialValues: {
        variations: [],
      },
    });

    const onSubmit = form.handleSubmit(async (values) => {
      isSubmitting.value = true;
      const variations = values.variations;

      const removeVariations = [];
      const updateVariations = [];
      const addVariations = [];

      for (let oldVariationKey in Object.keys(initialVariations)) {
        let oldVariation = initialVariations[oldVariationKey];
        if (variations.findIndex((v) => v.id == oldVariation.id) < 0)
          removeVariations.push(oldVariation.id);
      }

      for (let newVariationKey in Object.keys(variations)) {
        let newVariation = variations[newVariationKey];
        if (initialVariations.findIndex((v) => v.id == newVariation.id) < 0)
          addVariations.push(newVariation);
        else updateVariations.push(newVariation);
      }

      const input = {
        product: values.product,
        updateVariations,
        addVariations,
        removeVariations,
      };

      await store.dispatch("patchFigurine", {
        productId,
        input,
        onSuccess: (response) => {
          displaySonnerSuccess(`Товар (Арт. ${SKU.value}) успешно обновлён.`);
        },
        onError: (error) => {
          if (error?.response?.data?.errors)
            form.setErrors(error.response.data.errors);
          displaySonnerError(error);
        },
      });
      await fetchEditProduct();

      isSubmitting.value = false;
    });

    const { open: openFileDialog, onChange } = useFileDialog({
      accept: "/*",
      multiple: true,
    });

    onChange(async (newFiles) => {
      isUploading.value = true;
      await store.dispatch("putProductFiles", {
        files: newFiles,
        productId,
        onSuccess: (response) => {
          displaySonnerSuccess(`Файлы успешно загружены.`);
          files.value = files.value.concat(response.data.value);
        },
        onError: (error) => {
          displaySonnerError(error);
        },
      });
      isUploading.value = false;
    });

    async function deleteFile(id) {
      await store.dispatch("deleteProductFile", {
        id,
        productId,
        onSuccess: (response) => {
          displaySonnerSuccess(`Файл успешно удалён.`);
          const fileIndex = files.value.findIndex((f) => f.id == id);
          if (fileIndex > -1) {
            files.value.splice(fileIndex, 1);
          }
        },
        onError: (error) => {
          displaySonnerError(error);
        },
      });
    }

    async function saveImageOrder(files) {
      isSavingOrder.value = true;
      await store.dispatch("postProductImages", {
        productId,
        files: files.map((f) => f.id),
        onSuccess: (response) => {
          displaySonnerSuccess(`Поряд изображений успешно сохранён.`);
        },
        onError: (error) => {
          displaySonnerError(error);
        },
      });
      isSavingOrder.value = false;
    }

    return {
      SKU,
      form,
      onSubmit,
      isSubmitting,
      isProductLoading,
      newVariation: newFigurineVariation,
      files,
      openFileDialog,
      isUploading,
      deleteFile,
      productId,
      saveImageOrder,
      images,
      isSavingOrder,
    };
  },
};
</script>

<template>
  <Page class="flex flex-col">
    <NavigationBar>
      <template #pre-left>
        <GoBackButton />
      </template>
      <template #center>
        <Tabs v-model="tab">
          <TabsList>
            <TabsTrigger value="properties"> Свойства </TabsTrigger>
            <TabsTrigger value="files"> Файлы </TabsTrigger>
            <TabsTrigger value="images"> Изображения </TabsTrigger>
          </TabsList>
        </Tabs>
      </template>
    </NavigationBar>
    <div class="border rounded-lg h-full w-full grow flex flex-col mb-4">
      <div v-if="!isProductLoading" class="grow flex flex-col">
        <form
          v-if="form"
          v-show="tab == 'properties'"
          @submit="onSubmit"
          class="space-y-4 flex flex-col m-4"
        >
          <div class="gap-[calc(var(--spacing)*2)] flex flex-col">
            <p class="font-medium text-sm opacity-50 select-none">Артикул</p>
            <Input type="text" disabled :model-value="SKU" />
          </div>

          <FormField v-slot="{ componentField }" name="product.name">
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="product.description">
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea class="max-h-96 h-64" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ value, setValue }" name="variations">
            <FormItem>
              <FormLabel>Вариации</FormLabel>
              <FormControl>
                <div class="flex flex-row gap-4 overflow-auto">
                  <FigurineVariation
                    v-for="(variation, index) in value"
                    :key="index"
                    v-model:variation="value[index]"
                    @onRemove="setValue(value.filter((_, i) => i !== index))"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    @click="setValue([...value, newVariation])"
                    class="w-96 h-full min-h-64"
                  >
                    <Plus class="size-8" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="flex flex-col ml-auto">
            <Button
              type="submit"
              size="lg"
              class="mt-4"
              :disabled="isSubmitting"
            >
              <template v-if="!isSubmitting">
                <Save class="size-4" />
                Сохранить изменения
              </template>
              <Loader2 v-else class="animate-spin" />
            </Button>
          </div>
        </form>
        <div v-show="tab == 'files'" class="flex flex-col">
          <ProductFilesTable
            :files="files"
            :productId="productId"
            @onDelete="deleteFile"
          />
          <div class="flex p-4">
            <Button
              class="ml-[auto]"
              @click="openFileDialog"
              :disabled="isUploading"
            >
              <template v-if="!isUploading">
                <Upload class="size-4" />
                Загрузить
              </template>
              <Loader2 v-else class="animate-spin" />
            </Button>
          </div>
        </div>
        <div v-show="tab == 'images'" class="flex flex-col grow">
          <ProductImagesEditor
            :isSaving="isSavingOrder"
            :files="files"
            :images="images"
            :productId="productId"
            @onOrderSave="saveImageOrder"
          />
        </div>
      </div>
      <div
        v-else-if="isProductLoading"
        class="grow flex items-center justify-center"
      >
        <Loader2 class="text-primary size-4 animate-spin mx-[auto]" />
      </div>
    </div>
  </Page>
</template>
