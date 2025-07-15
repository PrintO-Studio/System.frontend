<script>
import { Paintbrush } from "lucide-vue-next";
import Button from "./ui/button/Button.vue";
import { PAGE_TOOLS } from "@/router";

export default {
  components: {
    Paintbrush,
    Button,
  },
  data() {
    return {
      PAGE_TOOLS,
    };
  },
};
</script>

<template>
  <RouterLink :to="PAGE_TOOLS">
    <Button variant="ghost">
      <Paintbrush class="size-4" />
      Инструменты
    </Button>
  </RouterLink>
</template>
