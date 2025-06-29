<script>
import { Label } from "@/components/ui/label";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import FormControl from "./ui/form/FormControl.vue";

export default {
  components: {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
    FormControl,
    Label,
  },
  props: {
    formatOptions: Object,
    value: Number,
    min: {
      type: Number,
      default: undefined,
    },
    max: {
      type: Number,
      default: undefined,
    },
  },
};
</script>

<template>
  <NumberField
    class="gap-2 min-w-xs"
    :min="min"
    :max="max"
    :formatOptions="formatOptions"
    :model-value="value"
    @update:model-value="
      (v) => {
        if (v) {
          $emit('onSetFieldValue', v);
        } else {
          $emit('onSetFieldValue', undefined);
        }
      }
    "
  >
    <NumberFieldContent>
      <NumberFieldDecrement />
      <FormControl>
        <NumberFieldInput />
      </FormControl>
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
</template>
