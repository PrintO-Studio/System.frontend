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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FigurineVariation from "@/components/figurine/figurineVariation.vue";
import ProductFilesTable from "@/components/productFilesTable.vue";
import ProductImagesEditor from "@/components/productImagesEditor.vue";
import GoBackButton from "@/components/goBackButton.vue";
import Separator from "@/components/ui/separator/Separator.vue";
import HomeButton from "@/components/homeButton.vue";
import Note from "@/components/note.vue";
import Switch from "@/components/ui/switch/Switch.vue";
import IntegrationBlock from "@/components/integrationBlock.vue";
import ToolsButton from "@/components/toolsButton.vue";

import {
  Loader2,
  Plus,
  Upload,
  Save,
  Trash2,
  NotebookPen,
  NotebookText,
} from "lucide-vue-next";
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
import { router } from "@/main";
import { ozonUpdate } from "@/integrationHelper";

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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
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
    HomeButton,
    Separator,
    Loader2,
    Plus,
    Upload,
    Save,
    Trash2,
    NotebookPen,
    NotebookText,
    Note,
    Switch,
    IntegrationBlock,
    ToolsButton,
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
    const notes = ref([]);
    const versions = ref({
      version: undefined,
      ozon: undefined,
      wildberries: undefined,
      yandex: undefined,
    });
    const isOzonUpdating = ref(false);

    fetchEditProduct();

    async function fetchEditProduct() {
      isProductLoading.value = true;
      await store.dispatch("getFigurine", {
        productId,
        onSuccess: (response) => {
          let product = response.data.value.product;
          let variations = (initialVariations = response.data.value.variations);
          SKU.value = product.sku;
          notes.value = product.notes;
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
          versions.value = product.versions;

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
          series: z.string().max(50).optional(),
          explicitContent: z.boolean().optional(),
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

    async function deleteProduct() {
      await store.dispatch("deleteFigurine", {
        productId,
        onSuccess: (response) => {
          router.push(response.data.value.next);
          displaySonnerSuccess(`Товар успешно удалён.`);
        },
        onError: (error) => {
          displaySonnerError(error);
        },
      });
    }

    async function addNote() {
      await store.dispatch("postNote", {
        productId,
        input: {
          text: "",
          imortance: "low",
        },
        onSuccess: (response) => {
          notes.value.push(response.data.value);
          displaySonnerSuccess(`Новая заметка добавлена.`);
        },
        onError: (error) => {
          displaySonnerError(error);
        },
      });
    }

    function getNewVariation() {
      let newVariation = {};
      if (form.values.variations.length > 0)
        newVariation = {
          ...form.values.variations[form.values.variations.length - 1],
          id: undefined,
          sku: undefined,
        };
      else newVariation = newFigurineVariation;
      return newVariation;
    }

    async function updateOzon() {
      isOzonUpdating.value = true;
      await ozonUpdate(
        productId,
        (response) => {
          versions.value = response.data.value.versions;
          displaySonnerSuccess(
            `Интеграция успешна (SKU: ${response.data.value.sku}).`,
          );
        },
        (error) => {
          displaySonnerError(error);
        },
      );
      isOzonUpdating.value = false;
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
      deleteProduct,
      notes,
      addNote,
      getNewVariation,
      versions,
      updateOzon,
      isOzonUpdating,
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
      <template #pro-left>
        <HomeButton />
      </template>
      <template #center>
        <Tabs v-model="tab">
          <TabsList>
            <TabsTrigger value="properties"> Свойства </TabsTrigger>
            <TabsTrigger value="files"> Файлы </TabsTrigger>
            <TabsTrigger value="images"> Изображения </TabsTrigger>
            <TabsTrigger value="integrations"> Интеграции </TabsTrigger>
          </TabsList>
        </Tabs>
      </template>
      <template #pre-right>
        <ToolsButton />
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

          <div class="flex flex-row w-full gap-4 items-end">
            <FormField v-slot="{ componentField }" name="product.series">
              <FormItem class="grow">
                <FormLabel>Серия</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ value, setValue }"
              name="product.explicitContent"
            >
              <FormItem class="flex flex-row items-center h-10">
                <FormLabel>Признак 18+</FormLabel>
                <FormControl>
                  <Switch
                    :default-value="value"
                    @update:model-value="setValue"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

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
                    @click="setValue([...value, getNewVariation()])"
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
        <div v-show="tab == 'properties'">
          <Separator />
          <div class="rounded-lg p-4 flex flex-col gap-4">
            <span v-for="(note, index) in notes">
              <Note
                v-model:note="notes[index]"
                :productId="productId"
                @onDelete="notes.splice(index, 1)"
              />
            </span>
            <div class="flex w-full justify-end gap-2">
              <Button size="lg" variant="outline" @click="addNote">
                <NotebookPen class="size-4" />
                Добавить заметку
              </Button>
            </div>
          </div>
        </div>
        <div
          v-show="tab == 'properties'"
          class="opacity-0 hover:opacity-100 duration-75"
        >
          <Separator />
          <div class="p-4">
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button variant="destructive">
                  <Trash2 class="size-4" />
                  Удалить
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader
                  >Вы уверены что хотите удалить товар
                  {{ form.values.product.name }}?</AlertDialogHeader
                >
                <AlertDialogFooter>
                  <AlertDialogCancel>Назад</AlertDialogCancel>
                  <AlertDialogAction @click="deleteProduct"
                    >Подтвержить</AlertDialogAction
                  >
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
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
        <div
          v-show="tab == 'integrations'"
          class="flex flex-col grow p-4 gap-4"
        >
          <div class="grow flex flex-col gap-4">
            <IntegrationBlock
              headerClass="bg-blue-600"
              v-model:integration="versions.ozon"
              :productVersion="versions.version"
              @onUpdate="updateOzon"
              @onUpload="updateOzon"
              :isUpdating="isOzonUpdating"
              :isUploading="isOzonUpdating"
            >
              Ozon
            </IntegrationBlock>
            <IntegrationBlock
              headerClass="bg-purple-500"
              v-model::integration="versions.wildberries"
              :productVersion="versions.version"
              disabled
            >
              Wildberries
            </IntegrationBlock>
            <IntegrationBlock
              headerClass="bg-yellow-400"
              v-model::integration="versions.yandex"
              :productVersion="versions.version"
              disabled
            >
              Yandex
            </IntegrationBlock>
          </div>
          <h class="text-xs text-foreground/80">
            Версия товара v{{ versions.version }}
          </h>
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
