<script>
import { ArrowLeft } from "lucide-vue-next";
import Button from "./ui/button/Button.vue";

export default {
  components: {
    ArrowLeft,
    Button,
  },
};
</script>

<template>
  <Button variant="ghost" @click="$router.go(-1)">
    <ArrowLeft class="size-4" />
  </Button>
</template>
