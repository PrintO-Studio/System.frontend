<script>
import GoBackButton from "@/components/goBackButton.vue";
import HomeButton from "@/components/homeButton.vue";
import NavigationBar from "@/components/navigationBar.vue";
import Page from "@/components/page.vue";
import Button from "@/components/ui/button/Button.vue";
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
import { Loader2 } from "lucide-vue-next";

import { mapActions } from "vuex";
import { displaySonnerSuccess, displaySonnerError } from "@/store/sonnerHelper";

export default {
  components: {
    Page,
    NavigationBar,
    GoBackButton,
    HomeButton,
    Button,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    Loader2,
  },
  methods: {
    ...mapActions(["postUpdateAllFigurinesOzon"]),
    async invokeFullOzonIntegration() {
      this.ozonFullIntegrationIsLoading = true;
      displaySonnerSuccess("Полная интеграция Ozon запущена.");
      await this.postUpdateAllFigurinesOzon({
        onSuccess: (response) => {
          displaySonnerSuccess("Полная интеграция Ozon успешна.");
        },
        onError: (error) => {
          displaySonnerError(error);
        },
      });
      this.ozonFullIntegrationIsLoading = false;
    },
  },
  data() {
    return {
      ozonFullIntegrationIsLoading: false,
    };
  },
};
</script>

<template>
  <Page class="flex flex-col">
    <NavigationBar>
      <template #pre-left>
        <GoBackButton />
      </template>
      <template #pro-left>
        <HomeButton />
      </template>
    </NavigationBar>
    <div
      class="border rounded-lg h-full w-full grow mb-4 grid grid-cols-4 grid-rows-2 p-4 gap-4"
    >
      <div class="border rounded-lg border-dotted col-span-2 p-4 flex flex-col">
        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button
              size="lg"
              variant="secondary"
              :disabled="ozonFullIntegrationIsLoading"
            >
              <Loader2
                v-if="ozonFullIntegrationIsLoading"
                class="size-4 animate-spin"
              />
              <template v-else> Запустить полную интеграцию Ozon </template>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              Вы уверены что хотите запустить полную интеграцию Ozon?
            </AlertDialogHeader>
            <h class="text-foreground/60">
              Это может занять несколько минут.
            </h>
            <AlertDialogFooter>
              <AlertDialogCancel>Назад</AlertDialogCancel>
              <AlertDialogAction @click="invokeFullOzonIntegration"
                >Подтвержить</AlertDialogAction
              >
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div
        class="border rounded-lg border-dotted col-span-2 flex items-center justify-center"
      >
        <h class="text-foreground/60"> В разработке </h>
      </div>
      <div
        class="border rounded-lg border-dotted col-span-full flex items-center justify-center"
      >
        <h class="text-foreground/60"> В разработке </h>
      </div>
    </div>
  </Page>
</template>
