<script>
import draggableComponent from "vuedraggable";
import ImageFile from "./imageFile.vue";
import Separator from "@/components/ui/separator/Separator.vue";
import Badge from "@/components/ui/badge/Badge.vue";
import Button from "./ui/button/Button.vue";
import { Image, ImageOff, Loader2, Save } from "lucide-vue-next";

export default {
  components: {
    draggableComponent,
    ImageFile,
    Separator,
    Badge,
    Button,
    Image,
    ImageOff,
    Save,
    Loader2,
  },
  props: {
    files: {
      type: Array,
      required: true,
    },
    images: {
      type: Array,
      required: true
    },
    isSaving: Boolean
  },
  watch: {
    files: {
      handler(newVal) {
        const imageFiles = []
        newVal.forEach((file) => {
          if (file.contentType.includes("image")) {
            imageFiles.push(file);
          }
        });
        this.usedImages = []
        this.unusedImages = []
        for(let imageKey in imageFiles) {
          let imageFile = imageFiles[imageKey]

          let image = this.images.find(i => i.fileId == imageFile.id)
          if (image != undefined) {
            this.usedImages.push({ ...imageFile, index: image.index })
          }
          else {
            this.unusedImages.push(imageFile)
          }
        }
        this.usedImages = this.usedImages.sort((a, b) => a.index - b.index)
      },
      immediate: true,
    },
  },
  data() {
    return {
      usedImages: [],
      unusedImages: [],
    };
  },
  mounted() {
    
  }
};
</script>

<template>
  <div class="grow flex flex-col">
    <p class="font-medium m-4 flex items-center gap-2">
      <Image class="size-4" />
      Прикрепленные изображения к карточке товара
    </p>
    <draggableComponent
      :list="usedImages"
      group="images"
      @change=""
      itemKey="id"
      class="flex flex-wrap min-h-96 overflow-x-auto gap-4 mx-4"
    >
      <template #item="{ element, index }">
        <ImageFile :file="element" class="size-64">
          <Badge class="text-sm absolute left-2 top-2">
            {{ index + 1 }}
          </Badge>
        </ImageFile>
      </template>
    </draggableComponent>

    <div class="flex m-4">
      <Button 
        class="ml-[auto]" 
        @click="$emit('onOrderSave', usedImages)"
        :disabled="isSaving"
      >
        <template v-if="!isSaving">
          <Save class="size-4"/>
          Сохранить порядок
        </template>
        <Loader2 v-else class="animate-spin" />
      </Button>
    </div>

    <Separator class="" />

    <p class="mx-4 font-medium m-4 flex items-center gap-2">
      <ImageOff class="size-4" />
      Остальные изображения
    </p>

    <draggableComponent
      :list="unusedImages"
      group="images"
      @change=""
      itemKey="id"
      class="flex flex-wrap w-full h-full mx-4 mb-4 gap-4"
    >
      <template #item="{ element, index }">
        <ImageFile :file="element" class="size-64" />
      </template>
    </draggableComponent>
  </div>
</template>
