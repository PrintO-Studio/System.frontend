<script>
import Page from "@/components/page.vue";
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
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
import { PAGE_SIGN_IN } from "@/router";
import { ref } from "vue";
import { Loader2 } from "lucide-vue-next";

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
        confirmPassword: z.string().min(8).max(20),
        invitationToken: z.string(),
      }),
    );

    const form = useForm({
      validationSchema: formSchema,
    });

    const onSubmit = form.handleSubmit(async (values) => {
      isSubmitting.value = true;
      await store.dispatch("postSignUpUser", {
        input: {
          userName: values.userName,
          password: values.password,
          confirmPassword: values.confirmPassword,
        },
        token: values.invitationToken,
        onSuccess: (response) => {
          displaySonnerSuccess("Успешная регистрация.");
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
      PAGE_SIGN_IN,
    };
  },
};
</script>

<template>
  <Page class="flex items-center flex-col">
    <div
      class="w-lg flex bg-secondary px-16 grow items-center justify-center flex-col"
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

        <FormField v-slot="{ componentField }" name="confirmPassword">
          <FormItem>
            <FormLabel>Подтвержите пароль</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="invitationToken">
          <FormItem>
            <FormLabel>Токен приглашения</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="flex flex-col">
          <Button type="submit" size="lg" class="mt-4" :disabled="isSubmitting">
            <p v-if="!isSubmitting">Создать аккаунт</p>
            <Loader2 v-else class="animate-spin" />
          </Button>
          <RouterLink :to="PAGE_SIGN_IN" class="hover:underline text-sm"
            >Есть аккаунт? Войти.</RouterLink
          >
        </div>
      </form>
    </div>
  </Page>
</template>
