import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const figurineScales = [
  { value: null, label: "Не указано" },
  { value: "oneTo56", label: "1:56" },
  { value: "oneTo52", label: "1:52" },
  { value: "oneTo48", label: "1:48" },
  { value: "oneTo35", label: "1:35" },
  { value: "oneTo18", label: "1:18" },
  { value: "oneTo16", label: "1:16" },
  { value: "oneTo12", label: "1:12" },
  { value: "oneTo9", label: "1:9" },
];

export const figurineColors = [
  { value: "Gray", label: "Серый" },
  { value: "White", label: "Белый" },
];

export const figurineIntegrities = [
  { value: "Dismountable", label: "Разборная" },
  { value: "DismountableBase", label: "Разборная (только от подставки)" },
  { value: "Solid", label: "Литая" },
];

export const rawFigurineSchema = z.object({
  id: z.number().optional(),
  isActive: z.boolean(),
  name: z.string().min(1).max(50),
  scale: z.enum(figurineScales.map((s) => s.value)).optional().nullable(),
  color: z.enum(figurineColors.map((c) => c.value)),
  integrity: z.enum(figurineIntegrities.map((i) => i.value)).optional(),
  series: z.string().max(50).optional(),
  quantity: z.number().min(1).max(1000),
  weightGr: z.number().min(1).max(10000),
  heightMm: z.number().min(1).max(1000),
  widthMm: z.number().min(1).max(1000).optional(),
  depthMm: z.number().min(1).max(1000).optional(),
  minHeightMm: z.number().min(1).max(1000).optional(),
  averageHeightMm: z.number().min(1).max(1000).optional(),
  maxHeightMm: z.number().min(1).max(1000).optional(),
  priceRub: z.number().min(10).max(100000000),
  priceBeforeSaleRub: z.number().min(10).max(100000000),
  minimalPriceRub: z.number().min(10).max(100000000),
});

export const newFigurineVariation = {
  isActive: true,
  name: "Вариация миниатюры",
  color: "Gray",
  integrity: "Solid",
  quantity: 1,
  weightGr: 50,
  heightMm: 100,
  priceRub: 1000,
  priceBeforeSaleRub: 1400,
  minimalPriceRub: 900,
};
