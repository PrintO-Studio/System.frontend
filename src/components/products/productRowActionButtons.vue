<script>
import Button from "../ui/button/Button.vue";

import { PAGE_PRODUCT_EDIT } from "@/router";
import { Pencil, HardDrive } from "lucide-vue-next";

export default {
  components: {
    Button,
    Pencil,
    HardDrive,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      PAGE_PRODUCT_EDIT,
    };
  },
};
</script>

<template>
  <div class="flex gap-2">
    <RouterLink
      :to="{
        name: PAGE_PRODUCT_EDIT,
        params: { id },
        query: { tab: 'properties' },
      }"
    >
      <Button size="icon">
        <Pencil class="text-primary-foreground size-4" />
      </Button>
    </RouterLink>
    <RouterLink
      :to="{ name: PAGE_PRODUCT_EDIT, params: { id }, query: { tab: 'files' } }"
    >
      <Button size="icon" variant="outline">
        <HardDrive class="size-4" />
      </Button>
    </RouterLink>
  </div>
</template>
