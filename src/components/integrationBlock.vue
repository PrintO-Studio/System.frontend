<script>
import { cn } from "@/lib/utils";
import Button from "./ui/button/Button.vue";
import { Check, CircleX, Loader2, TriangleAlert } from "lucide-vue-next";

export default {
  components: {
    Button,
    Check,
    CircleX,
    TriangleAlert,
    Loader2,
  },
  props: {
    headerClass: String,
    integration: Object,
    productVersion: Number,
    disabled: Boolean,
    isUpdating: Boolean,
    isUploading: Boolean,
  },
  setup() {
    return {
      cn,
    };
  },
  computed: {
    integrationValue: {
      get() {
        return this.integration;
      },
      set(value) {
        this.$emit("update:integration", value);
      },
    },
    hasTask() {
      return (
        this.integrationValue != undefined &&
        this.integrationValue.lastTask != undefined
      );
    },
    isError() {
      return this.hasTask == false;
    },
    isWarning() {
      return (
        this.hasTask == true &&
        this.integrationValue.lastTask.inProgress == false &&
        (this.integrationValue.lastTask.version != this.productVersion ||
          this.integrationValue.lastTask.success == false)
      );
    },
    isSuccess() {
      return (
        this.hasTask == true &&
        this.integrationValue.lastTask.version == this.productVersion &&
        this.integrationValue.lastTask.success == true
      );
    },
    isInProgress() {
      return (
        this.hasTask == true &&
        this.integrationValue.lastTask.inProgress == true
      );
    },
  },
};
</script>

<template>
  <div
    class="rounded-lg overflow-hidden border border-dotted flex bg-background h-32 gap-2 relative"
  >
    <div
      class="absolute w-full h-full bg-secondary/80 flex items-center justify-center animate-pulse"
      v-if="isUpdating || isUploading || isInProgress"
    >
      <Loader2 class="animate-spin" />
    </div>
    <div :class="cn('w-2 border-b', headerClass)" />
    <div class="flex w-full justify-between items-end p-4">
      <div class="h-full flex flex-col justify-between">
        <h class="text-lg flex gap-2 items-center">
          <slot />
          <CircleX v-if="isError" class="size-4" />
          <TriangleAlert v-else-if="isWarning" class="size-4" />
          <Check v-else-if="isSuccess" class="size-4" />
        </h>
        <Button
          variant="outline"
          v-if="isWarning"
          size="lg"
          class="w-32"
          :disabled="disabled"
          @click="$emit('onUpdate')"
        >
          Обновить
        </Button>
        <Button
          variant="outline"
          v-else-if="isError"
          size="lg"
          class="w-32"
          :disabled="disabled"
          @click="$emit('onUpload')"
        >
          Загрузить
        </Button>
        <h class="text-foreground/80 text-sm" v-else>
          Версия загруженного товара актуальна
        </h>
      </div>
      <h
        class="text-xs text-foreground/80 text-right"
        v-if="isWarning || isSuccess"
      >
        Версия товара v{{ integrationValue.lastTask?.version }}
      </h>
      <h class="text-xs text-foreground/80 text-right" v-else-if="isError">
        Товар не добавлен
      </h>
    </div>
  </div>
</template>
