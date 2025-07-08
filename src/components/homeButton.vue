<script>
import { House } from "lucide-vue-next";
import Button from "./ui/button/Button.vue";
import { PAGE_PRODUCTS } from "@/router";

export default {
  components: {
    House,
    Button,
  },
  data() {
    return {
      PAGE_PRODUCTS,
    };
  },
};
</script>

<template>
  <RouterLink :to="PAGE_PRODUCTS">
    <Button variant="ghost">
      <House class="size-4" />
    </Button>
  </RouterLink>
</template>
