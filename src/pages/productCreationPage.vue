<script>
import Page from "@/components/page.vue";
import NavigationBar from "@/components/navigationBar.vue";
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import Textarea from "@/components/ui/textarea/Textarea.vue";
import FigurineVariation from "@/components/figurine/figurineVariation.vue";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import GoBackButton from "@/components/goBackButton.vue";
import HomeButton from "@/components/homeButton.vue";
import Switch from "@/components/ui/switch/Switch.vue";

import { Loader2, Plus } from "lucide-vue-next";
import { PAGE_PRODUCTS } from "@/router";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { z } from "zod";
import { displaySonnerError, displaySonnerSuccess } from "@/store/sonnerHelper";
import { newFigurineVariation, rawFigurineSchema } from "@/components/figurine";
import ToolsButton from "@/components/toolsButton.vue";

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
    Input,
    Textarea,
    FigurineVariation,
    GoBackButton,
    HomeButton,
    Loader2,
    Plus,
    Switch,
    ToolsButton,
  },
  data() {
    return {
      PAGE_PRODUCTS,
    };
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const isSubmitting = ref(false);

    const formSchema = toTypedSchema(
      z.object({
        product: z.object({
          SKU: z.string().min(1).max(20),
          name: z.string().min(1).max(100),
          series: z.string().max(50).optional(),
          explicitContent: z.boolean().optional(),
          description: z.string().max(5000),
        }),
        variations: z.array(rawFigurineSchema).optional(),
      }),
    );

    const form = useForm({
      validationSchema: formSchema,
      initialValues: {
        product: {
          explicitContent: false,
        },
        variations: [],
      },
    });

    const onSubmit = form.handleSubmit(async (values) => {
      isSubmitting.value = true;
      await store.dispatch("postFigurine", {
        input: values,
        onSuccess: (response) => {
          displaySonnerSuccess("Товар успешно создан.");
          router.push(response.data.value.next);
        },
        onError: (error) => {
          if (error?.response?.data?.errors)
            form.setErrors(error.response.data.errors);
          displaySonnerError(error);
        },
      });
      isSubmitting.value = false;
    });

    return {
      form,
      onSubmit,
      isSubmitting,
      newVariation: newFigurineVariation,
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
      <template #pre-right>
        <ToolsButton />
      </template>
    </NavigationBar>
    <div class="border rounded-lg h-full w-full grow mb-4">
      <form @submit="onSubmit" class="space-y-4 flex flex-col m-4">
        <FormField v-slot="{ componentField }" name="product.SKU">
          <FormItem>
            <FormLabel>Артикул</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

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
                <Switch :default-value="value" @update:model-value="setValue" />
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
          <Button type="submit" size="lg" class="mt-4" :disabled="isSubmitting">
            <p v-if="!isSubmitting">Создать товар</p>
            <Loader2 v-if="isSubmitting" class="animate-spin" />
          </Button>
        </div>
      </form>
    </div>
  </Page>
</template>
