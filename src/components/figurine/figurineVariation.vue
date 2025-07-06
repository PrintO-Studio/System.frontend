<script>
import { createReusableTemplate } from "@vueuse/core";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Button from "../ui/button/Button.vue";
import FigurineVariationEdit from "./figurineVariationEdit.vue";
import { Trash2, Pencil } from "lucide-vue-next";
import { figurineColors, figurineIntegrities, figurineScales } from ".";

const [PropertyRowTemplate, PropertyRow] = createReusableTemplate();

export default {
  components: {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    PropertyRowTemplate,
    PropertyRow,
    Button,
    FigurineVariationEdit,
    Trash2,
    Pencil,
  },
  props: {
    variation: {
      type: Object,
      required: true,
    },
  },
  computed: {
    variationValue: {
      get() {
        return this.variation;
      },
      set(value) {
        this.$emit("update:variation", value);
      },
    },
  },
  data() {
    return {
      colors: figurineColors,
      scales: figurineScales,
      integrities: figurineIntegrities,
    }
  }
};
</script>

<template>
  <PropertyRowTemplate v-slot="{ name, value }">
    <TableRow v-if="value">
      <TableCell class="font-medium">
        {{ name }}
      </TableCell>
      <TableCell>{{ value }}</TableCell>
    </TableRow>
  </PropertyRowTemplate>

  <Card class="w-96 min-w-96 group">
    <CardHeader>
      <CardTitle>{{ variationValue.name }}</CardTitle>
      <CardTitle 
        class="text-sm font-normal text-secondary-foreground"
        :class="{' text-destructive ' : !variationValue.isActive}"
      >
          {{ variationValue.isActive ? 'Активна' : 'Не активна' }}
      </CardTitle>
    </CardHeader>
    <CardContent class="">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Характеристика</TableHead>
            <TableHead>Значение</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <PropertyRow name="Масштаб" :value="scales.find(s => s.value == variationValue.scale).label" />
          <PropertyRow name="Цвет" :value="colors.find(c => c.value == variationValue.color).label" />
          <PropertyRow name="Целостность" :value="integrities.find(i => i.value == variationValue.integrity).label" />
          <PropertyRow name="Серия" :value="variationValue.series" />
          <PropertyRow name="Количество фигурок" :value="variationValue.quantity" />
          <PropertyRow name="Вес, гр." :value="variationValue.weightGr" />
          <PropertyRow name="Высота, мм." :value="variationValue.heightMm" />
          <PropertyRow name="Ширина, мм." :value="variationValue.widthMm" />
          <PropertyRow name="Глубина, мм." :value="variationValue.depthMm" />
          <PropertyRow
            name="Минимальная высота, мм."
            :value="variationValue.minHeightMm"
          />
          <PropertyRow
            name="Средняя высота, мм."
            :value="variationValue.averageHeightMm"
          />
          <PropertyRow
            name="Максимальная высота, мм."
            :value="variationValue.maxHeightMm"
          />
          <PropertyRow name="Цена, руб." :value="variationValue.priceRub" />
          <PropertyRow
            name="Цена до скидки, руб."
            :value="variationValue.priceBeforeSaleRub"
          />
          <PropertyRow
            name="Минимальная цена, мм."
            :value="variationValue.minimalPriceRub"
          />
        </TableBody>
      </Table>
    </CardContent>
    <CardFooter
      class="flex justify-between mt-[auto] opacity-0 group-hover:opacity-100 duration-75"
    >
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button type="button" variant="ghost" size="icon">
            <Trash2 class="size-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader
            >Вы уверены что хотите удалить вариацию
            {{ variationValue.name }}?</AlertDialogHeader
          >
          <AlertDialogFooter>
            <AlertDialogCancel>Назад</AlertDialogCancel>
            <AlertDialogAction @click="$emit('onRemove')"
              >Подтвержить</AlertDialogAction
            >
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <FigurineVariationEdit
        ref="editDialog"
        v-model:variation="variationValue"
      >
        <Button
          type="button"
          variant="secondary"
          @click="$refs.editDialog.form.setValues(variationValue)"
        >
          <Pencil class="size-4" />
          Редактировать
        </Button>
      </FigurineVariationEdit>
    </CardFooter>
  </Card>
</template>
