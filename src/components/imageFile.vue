<script>
import { Image } from "lucide-vue-next";

export default {
  components: {
    Image,
  },
  props: {
    file: Object,
  },
  data() {
    return {
      isLoading: false,
    };
  },
  watch: {
    file: {
      handler(newVal) {
        if (newVal) {
          this.isLoading = true;
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<template>
  <div
    v-if="file"
    class="bg-secondary rounded-lg overflow-hidden relative"
    :class="{
      ' animate-pulse': isLoading,
    }"
  >
    <!--
    <img
      :src="file.fullPath"
      class="absolute top-0 left-0 w-full h-full blur-3xl"
      v-show="!isLoading"
    />
    -->
    <img
      @load="isLoading = false"
      @error="isLoading = false"
      :src="file.fullPath"
      class="absolute w-full h-full object-contain"
      v-show="!isLoading"
    />
    <slot />
  </div>
  <div v-else class="bg-secondary rounded-lg flex items-center justify-center">
    <Image class="text-secondary-foreground size-[25%]" />
    <slot />
  </div>
</template>
