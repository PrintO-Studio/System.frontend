<script>
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormCombobox from "../formCombobox.vue";
import FormNumberInput from "../formNumberInput.vue";
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import Switch from "@/components/ui/switch/Switch.vue";

import { useForm } from "vee-validate";
import { figurineColors, figurineScales, figurineIntegrities, rawFigurineSchema } from ".";
import { toTypedSchema } from "@vee-validate/zod";

export default {
  components: {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Button,
    Input,
    FormCombobox,
    FormNumberInput,
    Switch,
  },
  props: {
    variation: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const form = useForm({
      validationSchema: toTypedSchema(rawFigurineSchema),
      initialValues: {
        ...props.variation,
      },
    });

    const onSubmit = form.handleSubmit(async (values) => {
      emit("update:variation", { ...values });
    });

    const currencyFormatOptions = {
      style: "currency",
      currency: "RUB",
      currencyDisplay: "code",
      currencySign: "accounting",
    };

    return {
      form,
      onSubmit,
      scales: figurineScales,
      colors: figurineColors,
      integrities: figurineIntegrities,
      currencyFormatOptions,
    };
  },
};
</script>

<template>
  <Dialog>
    <DialogTrigger>
      <slot />
    </DialogTrigger>
    <DialogContent class="min-w-[40vw]">
      <DialogHeader>
        <DialogTitle>Редактор вариации</DialogTitle>
      </DialogHeader>
      <form
        @submit="onSubmit"
        class="space-y-4 flex flex-col max-h-[80vh] overflow-auto p-1"
      >
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Название вариации</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ value, setValue }" name="scale">
          <FormItem>
            <FormLabel>Масштаб</FormLabel>
            <FormCombobox
              :value="scales.find((s) => s.value == value)"
              :items="scales"
              @onSetFieldValue="setValue"
            />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ value, setValue }" name="color">
          <FormItem>
            <FormLabel>Цвет</FormLabel>
            <FormCombobox
              :value="colors.find((s) => s.value == value)"
              :items="colors"
              @onSetFieldValue="setValue"
            />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ value, setValue }" name="integrity">
          <FormItem>
            <FormLabel>Целостность</FormLabel>
            <FormCombobox
              :value="integrities.find((s) => s.value == value)"
              :items="integrities"
              @onSetFieldValue="setValue"
            />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="series">
          <FormItem>
            <FormLabel>Серия</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ value, setValue }" name="quantity">
          <FormItem>
            <FormLabel>Количество фигурок</FormLabel>
            <FormNumberInput
              :min="1"
              :max="1000"
              :value="value"
              @onSetFieldValue="setValue"
            />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ value, setValue }" name="weightGr">
          <FormItem>
            <FormLabel>Вес, гр.</FormLabel>
            <FormNumberInput
              :min="1"
              :max="10000"
              :value="value"
              @onSetFieldValue="setValue"
            />
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex flex-col p-4 border rounded-lg gap-4">
          <FormField v-slot="{ value, setValue }" name="heightMm">
            <FormItem class="flex justify-between">
              <div class="content-center">
                <FormLabel class="text-center">Высота, мм.</FormLabel>
                <FormMessage />
              </div>
              <FormNumberInput
                :min="1"
                :max="1000"
                :value="value"
                @onSetFieldValue="setValue"
              />
            </FormItem>
          </FormField>
          <FormField v-slot="{ value, setValue }" name="widthMm">
            <FormItem class="flex justify-between">
              <div class="content-center">
                <FormLabel class="text-center">Ширина, мм.</FormLabel>
                <FormMessage />
              </div>
              <FormNumberInput
                :min="1"
                :max="1000"
                :value="value"
                @onSetFieldValue="setValue"
              />
            </FormItem>
          </FormField>
          <FormField v-slot="{ value, setValue }" name="depthMm">
            <FormItem class="flex justify-between">
              <div class="content-center">
                <FormLabel class="text-center"
                  >Глубина, мм.</FormLabel
                >
                <FormMessage />
              </div>
              <FormNumberInput
                :min="1"
                :max="1000"
                :value="value"
                @onSetFieldValue="setValue"
              />
            </FormItem>
          </FormField>
        </div>

        <div class="flex flex-col p-4 border rounded-lg gap-4">
          <FormField v-slot="{ value, setValue }" name="minHeightMm">
            <FormItem class="flex justify-between">
              <div class="content-center">
                <FormLabel class="text-center"
                  >Минимальная высота, мм.</FormLabel
                >
                <FormMessage />
              </div>
              <FormNumberInput
                :min="1"
                :max="1000"
                :value="value"
                @onSetFieldValue="setValue"
              />
            </FormItem>
          </FormField>
          <FormField v-slot="{ value, setValue }" name="averageHeightMm">
            <FormItem class="flex justify-between">
              <div class="content-center">
                <FormLabel class="text-center"
                  >Средняя высота, мм.</FormLabel
                >
                <FormMessage />
              </div>
              <FormNumberInput
                :min="1"
                :max="1000"
                :value="value"
                @onSetFieldValue="setValue"
              />
            </FormItem>
          </FormField>
          <FormField v-slot="{ value, setValue }" name="maxHeightMm">
            <FormItem class="flex justify-between">
              <div class="content-center">
                <FormLabel class="text-center"
                  >Максимальная высота, мм.</FormLabel
                >
                <FormMessage />
              </div>
              <FormNumberInput
                :min="1"
                :max="1000"
                :value="value"
                @onSetFieldValue="setValue"
              />
            </FormItem>
          </FormField>
        </div>

        <div class="flex flex-col p-4 border rounded-lg gap-4">
          <FormField v-slot="{ value, setValue }" name="priceRub">
            <FormItem class="flex justify-between">
              <div class="content-center">
                <FormLabel class="text-center">Цена, руб.</FormLabel>
                <FormMessage />
              </div>
              <FormNumberInput
                :formatOptions="currencyFormatOptions"
                :min="10"
                :max="100000000"
                :value="value"
                @onSetFieldValue="setValue"
              />
            </FormItem>
          </FormField>
          <FormField v-slot="{ value, setValue }" name="priceBeforeSaleRub">
            <FormItem class="flex justify-between">
              <div class="content-center">
                <FormLabel class="text-center"
                  >Цена до скидки, руб.</FormLabel
                >
                <FormMessage />
              </div>
              <FormNumberInput
                :formatOptions="currencyFormatOptions"
                :min="10"
                :max="100000000"
                :value="value"
                @onSetFieldValue="setValue"
              />
            </FormItem>
          </FormField>
          <FormField v-slot="{ value, setValue }" name="minimalPriceRub">
            <FormItem class="flex justify-between">
              <div class="content-center">
                <FormLabel class="text-center"
                  >Минимальная цена, руб.</FormLabel
                >
                <FormMessage />
              </div>
              <FormNumberInput
                :formatOptions="currencyFormatOptions"
                :min="10"
                :max="100000000"
                :value="value"
                @onSetFieldValue="setValue"
              />
            </FormItem>
          </FormField>
        </div>

        <FormField v-slot="{ value, setValue }" name="isActive">
          <FormItem class="flex ">
            <FormLabel for="isActive">Активность</FormLabel>
            <FormControl>
              <Switch id="isActive" :defaultValue="value" @update:modelValue="setValue" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <DialogClose>
            <Button>Закрыть окно</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
