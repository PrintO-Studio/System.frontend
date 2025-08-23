<script>
import {
  Table,
  TableBody,
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
import Button from "./ui/button/Button.vue";
import { ArrowDownToLine, Trash2 } from "lucide-vue-next";
import Badge from "./ui/badge/Badge.vue";

export default {
  components: {
    Table,
    TableBody,
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
    Button,
    ArrowDownToLine,
    Trash2,
    Badge,
  },
  props: {
    files: {
      type: Array,
      required: true,
    },
    productId: Number,
  },
  methods: {
    extractFileName(file) {
      let pathComponents = file.fullPath.split("/");
      return pathComponents[pathComponents.length - 1];
    },
    formatBytes(bytes, decimals = 2) {
      if (!+bytes) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = [
        "Bytes",
        "KiB",
        "MiB",
        "GiB",
        "TiB",
        "PiB",
        "EiB",
        "ZiB",
        "YiB",
      ];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    },
  },
};
</script>

<template>
  <Table class="border-b">
    <TableHeader>
      <TableRow>
        <TableHead class="w-24 text-center">#</TableHead>
        <TableHead>Название</TableHead>
        <TableHead>Тип</TableHead>
        <TableHead>Размер</TableHead>
        <TableHead></TableHead>
        <TableHead class="w-20"></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="(file, index) in files" :key="file.id" class="group">
        <TableCell class="w-24 text-center text-muted-foreground">{{ index + 1 }}</TableCell>
        <TableCell class="font-medium">
          {{ extractFileName(file) }}
        </TableCell>
        <TableCell class="font-medium">
          <Badge :class="{' bg-blue-500' : extractFileName(file).includes('.stl')}">
            {{ file.contentType }}
          </Badge>
        </TableCell>
        <TableCell class="font-medium">
          {{ formatBytes(file.length) }}
        </TableCell>
        <TableCell class="font-medium">
          <Button as="a" variant="link" :href="file.fullPath" target="_blank">
            <ArrowDownToLine class="size-4" />
            скачать
          </Button>
        </TableCell>
        <TableCell class="w-20">
          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button
                variant="link"
                class="opacity-0 group-hover:opacity-100 duration-75"
              >
                <Trash2 class="size-4" />
                Удалить
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader
                >Вы уверены что хотите удалить файл
                {{ extractFileName(file) }}?</AlertDialogHeader
              >
              <AlertDialogFooter>
                <AlertDialogCancel>Назад</AlertDialogCancel>
                <AlertDialogAction @click="$emit('onDelete', file.id)"
                  >Подтвержить</AlertDialogAction
                >
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
