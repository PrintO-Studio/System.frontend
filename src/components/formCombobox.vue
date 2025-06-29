<script>
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import Button from "./ui/button/Button.vue";
import { Check, ChevronsUpDown } from "lucide-vue-next";
import FormControl from "./ui/form/FormControl.vue";

import { cn } from "@/lib/utils";

export default {
  components: {
    Combobox,
    ComboboxAnchor,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxList,
    ComboboxTrigger,
    ChevronsUpDown,
    Check,
    FormControl,
    Button,
  },
  props: {
    placeholder: {
      type: String,
      default: "Выберите...",
    },
    items: {
      type: Array,
      required: true,
    },
    value: String,
  },
  setup() {
    return {
      cn,
    };
  },
};
</script>

<template>
  <Combobox by="label">
    <FormControl class="w-full">
      <ComboboxAnchor as-child>
        <ComboboxTrigger as-child>
          <Button variant="outline" class="justify-between">
            {{ value?.label ?? placeholder }}
            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </ComboboxTrigger>
      </ComboboxAnchor>
    </FormControl>

    <ComboboxList>
      <ComboboxEmpty> Ничего не найдено. </ComboboxEmpty>

      <ComboboxGroup>
        <ComboboxItem
          v-for="item in items"
          :key="item.value"
          :value="item"
          @select="
            () => {
              $emit('onSetFieldValue', item.value);
            }
          "
        >
          {{ item.label }}

          <ComboboxItemIndicator>
            <Check :class="cn('ml-auto h-4 w-4')" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
