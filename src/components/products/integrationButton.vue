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
import { Check, CircleX, TriangleAlert } from "lucide-vue-next";

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
  },
  props: {
    productVersion: Number,
    version: Number,
    onUpload : Function,
    onUpdate : Function,
    disabled: Boolean,
  },
  computed: {
    isError() {
      return this.version == undefined;
    },
    isWarning() {
      return this.version != this.productVersion;
    },
    isSuccess() {
      return this.version == this.productVersion;
    },
  },
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="flex items-center gap-2">
      <Button v-if="isError" variant="secondary" class="rounded-full size-10">
        <CircleX class="size-4" />
      </Button>
      <Button
        v-else-if="isWarning"
        variant="secondary"
        class="rounded-full size-10"
      >
        <TriangleAlert class="size-4" />
      </Button>
      <div
        v-else-if="isSuccess"
        class="size-10 bg-secondary rounded-full inline-flex items-center justify-center"
      >
        <Check class="size-4" />
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" v-if="!isSuccess">
      <template v-if="isError">
        <DropdownMenuLabel>Товар не загружен</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem as="button" class="w-full" :disabled="disabled" @click="onUpload">
          Загрузить
        </DropdownMenuItem>
      </template>
      <template v-else-if="isWarning">
        <DropdownMenuLabel>Товар не актуален</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem as="button" class="w-full" :disabled="disabled" @click="onUpdate">
          Обновить
        </DropdownMenuItem>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
