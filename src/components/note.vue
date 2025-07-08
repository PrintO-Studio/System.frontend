<script>
import {
  NotebookPen,
  NotebookText,
  Trash2,
  Loader2,
  Loader,
} from "lucide-vue-next";
import Button from "@/components/ui/button/Button.vue";
import Badge from "@/components/ui/badge/Badge.vue";
import Textarea from "@/components/ui/textarea/Textarea.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { mapActions } from "vuex";
import { displaySonnerError, displaySonnerSuccess } from "@/store/sonnerHelper";

export default {
  components: {
    NotebookPen,
    NotebookText,
    Trash2,
    Loader2,
    Button,
    Badge,
    Textarea,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  },
  props: {
    productId: {
      type: Number,
      required: true,
    },
    note: {
      type: Object,
      required: true,
    },
  },
  computed: {
    noteValue: {
      get() {
        return this.note;
      },
      set(value) {
        this.$emit("update:note", value);
      },
    },
  },
  methods: {
    ...mapActions(["patchNote", "deleteNote"]),
    async update() {
      this.isUpdating = true;
      await this.patchNote({
        productId: this.productId,
        id: this.noteValue.id,
        input: {
          text: this.noteValue.text,
          importance: this.noteValue.importance,
        },
        onSuccess: (response) => {
          //displaySonnerSuccess(`Заметка успешно обновлёна.`);
        },
        onError: (error) => {
          displaySonnerError(error);
        },
      });
      this.isUpdating = false;
    },
    async deleteThisNote() {
      await this.deleteNote({
        productId: this.productId,
        id: this.noteValue.id,
        onSuccess: (response) => {
          displaySonnerSuccess(`Заметка успешно удалена.`);
          this.$emit("onDelete");
        },
        onError: (error) => {
          displaySonnerError(error);
        },
      });
    },
  },
  watch: {
    noteValue: {
      handler(newVal) {
        this.$emit("update:note", newVal);

        if (this.updateTimer != undefined) clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(async () => {
          await this.update();
        }, 1000);
      },
      deep: true,
    },
  },
  data() {
    const importances = [
      { value: "Low", label: "Низкая важность" },
      { value: "Medium", label: "Средняя важность" },
      { value: "High", label: "Высокая важность" },
      { value: "Critical", label: "Критическая важность" },
      { value: "Emergency", label: "Чрезвычайная важность" },
    ];

    return {
      importances,
      isUpdating: false,
      updateTimer: undefined,
    };
  },
};
</script>

<template>
  <span
    class="flex flex-col gap-2 group hover:bg-secondary p-4 duration-75 rounded-lg"
  >
    <div class="flex justify-between">
      <span class="text-foreground/80 flex gap-4 items-center">
        <Select
          v-model="noteValue.importance"
          :default-value="noteValue.importance"
        >
          <SelectTrigger class="px-4 border-0 bg-primary text-background">
            <NotebookText class="size-4" />
            {{ importances.find((i) => i.value == noteValue.importance).label }}
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="importance in importances"
                :key="importance.value"
                as="button"
                :value="importance.value"
              >
                {{ importance.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </span>
      <div class="flex items-center gap-4">
        <Loader2 class="size-4 animate-spin" v-show="isUpdating" />
        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
              class="opacity-0 duration-75 group-hover:opacity-100"
            >
              <Trash2 class="size-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader
              >Вы уверены что хотите удалить заметку?</AlertDialogHeader
            >
            <AlertDialogFooter>
              <AlertDialogCancel>Назад</AlertDialogCancel>
              <AlertDialogAction @click="deleteThisNote"
                >Подтвержить</AlertDialogAction
              >
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
    <Textarea :maxlength="10000" v-model="noteValue.text" class="h-64" />
  </span>
</template>
