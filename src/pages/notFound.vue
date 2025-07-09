<script>
import Page from "@/components/page.vue";
import Button from "@/components/ui/button/Button.vue";
import { PAGE_PRODUCTS, PAGE_SIGN_IN } from "@/router";

export default {
  components: {
    Page,
    Button,
  },
  data() {
    return {
      PAGE_SIGN_IN,
      PAGE_PRODUCTS,
    };
  },
};
</script>

<template>
  <Page class="flex flex-col">
    <div class="w-full grow flex items-center justify-center flex-col gap-4">
      <h1 class="text-3xl font-bold">404</h1>
      <div class="">
        <RouterLink :to="PAGE_PRODUCTS">
          <Button variant="link"> Главная </Button>
        </RouterLink>
        -
        <RouterLink :to="PAGE_SIGN_IN">
          <Button variant="link"> Войти </Button>
        </RouterLink>
      </div>
    </div>
  </Page>
</template>
