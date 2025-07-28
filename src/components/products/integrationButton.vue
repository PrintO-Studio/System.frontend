<script>
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Button from "../ui/button/Button.vue";
import { Check, CircleX, Loader2, TriangleAlert } from "lucide-vue-next";

export default {
  components: {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    Button,
    CircleX,
    TriangleAlert,
    Check,
    Loader2,
  },
  props: {
    productVersion: Number,
    integration: Object,
    onUpload: Function,
    onUpdate: Function,
    disabled: Boolean,
  },
  computed: {
    hasTask() {
      return this.integration.lastTask != undefined;
    },
    isError() {
      return this.hasTask == false;
    },
    isWarning() {
      return (
        this.hasTask == true &&
        this.integration.lastTask.inProgress == false &&
        (this.integration.lastTask.version != this.productVersion ||
          this.integration.lastTask.success == false)
      );
    },
    isSuccess() {
      return (
        this.hasTask == true &&
        this.integration.lastTask.version == this.productVersion &&
        this.integration.lastTask.success == true
      );
    },
    isInProgress() {
      return (
        this.hasTask == true && this.integration.lastTask.inProgress == true
      );
    },
  },
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="flex items-center gap-2 relative">
      <div v-if="isInProgress">
        <Loader2 class="size-4 animate-spin" />
      </div>
      <Button
        v-else-if="isError"
        variant="secondary"
        class="rounded-full size-10 z-10"
      >
        <CircleX class="size-4" />
      </Button>
      <Button
        v-else-if="isWarning"
        variant="secondary"
        class="rounded-full size-10 z-10"
      >
        <TriangleAlert class="size-4" />
      </Button>
      <div
        v-else-if="isSuccess"
        class="size-10 bg-secondary rounded-full inline-flex items-center justify-center z-10"
      >
        <Check class="size-4" />
      </div>
      <div
        class="size-10 absolute left-1/2 -translate-x-1/2 blur-md scale-85 opacity-90 group-hover:scale-100 group-hover:opacity-100 duration-75"
        :class="{
          '': isInProgress,
          'bg-error/50': isError,
          'bg-warning/70': isWarning,
          'bg-success/60': isSuccess,
        }"
      />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" v-if="!isSuccess">
      <template v-if="isInProgress">
        <DropdownMenuLabel>Интеграция в процессе...</DropdownMenuLabel>
      </template>
      <template v-else-if="isError">
        <DropdownMenuLabel>Товар не загружен</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          as="button"
          class="w-full"
          :disabled="disabled"
          @click="onUpload"
        >
          Загрузить
        </DropdownMenuItem>
      </template>
      <template v-else-if="isWarning">
        <DropdownMenuLabel>Товар не актуален</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          as="button"
          class="w-full"
          :disabled="disabled"
          @click="onUpdate"
        >
          Обновить
        </DropdownMenuItem>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
