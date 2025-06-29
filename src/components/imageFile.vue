<script>
import { Image } from "lucide-vue-next";

export default {
  components: {
    Image,
  },
  props: {
    file: Object,
  },
};
</script>

<template>
  <div v-if="file" class="bg-secondary rounded-lg overflow-hidden relative">
    <img
      :src="file.fullPath"
      class="absolute top-0 left-0 w-full h-full blur-3xl"
    />
    <img :src="file.fullPath" class="absolute w-full h-full object-contain" />
    <slot />
  </div>
  <div v-else class="bg-secondary rounded-lg flex items-center justify-center">
    <Image class="text-secondary-foreground size-[25%]" />
    <slot />
  </div>
</template>
