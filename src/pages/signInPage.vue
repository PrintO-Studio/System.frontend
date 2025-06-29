<script>
import Page from "@/components/page.vue";
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import Checkbox from "@/components/ui/checkbox/Checkbox.vue";
import Logo from "@/components/logo.vue";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useForm } from "vee-validate";
import { useStore } from "vuex";
import { displaySonnerError, displaySonnerSuccess } from "@/store/sonnerHelper";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { Loader2 } from "lucide-vue-next";
import { PAGE_SIGN_UP } from "@/router";

export default {
  components: {
    Page,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Button,
    Input,
    Checkbox,
    Logo,
    Loader2,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const isSubmitting = ref(false);

    const formSchema = toTypedSchema(
      z.object({
        userName: z.string().min(4).max(45),
        password: z.string().min(8).max(20),
        rememberMe: z.boolean().default(true).optional(),
      }),
    );

    const form = useForm({
      validationSchema: formSchema,
      initialValues: {
        rememberMe: true,
      },
    });

    const onSubmit = form.handleSubmit(async (values) => {
      isSubmitting.value = true;
      await store.dispatch("postSignInUser", {
        input: values,
        onSuccess: (response) => {
          displaySonnerSuccess("Успешный вход.");
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
      PAGE_SIGN_UP,
    };
  },
};
</script>

<template>
  <Page class="flex items-center flex-col">
    <div
      class="w-lg flex bg-secondary px-16 grow justify-center items-center flex-col"
    >
      <Logo class="mb-16" />
      <form @submit="onSubmit" class="space-y-4 w-full flex flex-col">
        <FormField v-slot="{ componentField }" name="userName">
          <FormItem>
            <FormLabel>Имя пользователя</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Олег" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Пароль</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField
          v-slot="{ value, handleChange }"
          type="checkbox"
          name="rememberMe"
        >
          <FormItem class="flex flex-row">
            <FormControl>
              <Checkbox
                :model-value="value"
                @update:model-value="handleChange"
              />
            </FormControl>
            <FormLabel>Запомнить меня</FormLabel>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex flex-col">
          <Button type="submit" size="lg" class="mt-4" :disabled="isSubmitting">
            <p v-if="!isSubmitting">Войти</p>
            <Loader2 v-if="isSubmitting" class="text-primary animate-spin" />
          </Button>
          <RouterLink :to="PAGE_SIGN_UP" class="hover:underline text-sm"
            >Нету аккаунта? Создать.</RouterLink
          >
        </div>
      </form>
    </div>
  </Page>
</template>
