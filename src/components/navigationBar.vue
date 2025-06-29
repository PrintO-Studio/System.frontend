<script>
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
import Logo from "@/components/logo.vue";
import Button from "./ui/button/Button.vue";

import { mapActions } from "vuex";
import { displaySonnerError } from "@/store/sonnerHelper";
import { UserRound, Plus } from "lucide-vue-next";

export default {
  components: {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
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
    Logo,
    Button,
    UserRound,
    Plus,
  },
  data() {
    return {
      me: undefined,
      memberships: [],
    };
  },
  methods: {
    ...mapActions([
      "getMe",
      "postLogOut",
      "getMyMemberships",
      "postSelectStore",
    ]),
    selectStore(storeId) {
      this.postSelectStore({
        storeId,
        onSuccess: () => {},
        onError: (error) => {
          displaySonnerError(error);
        },
      });
    },
  },
  async mounted() {
    await this.getMe({
      onSuccess: (response) => {
        this.me = response.data.value;
      },
      onError: (error) => {
        displaySonnerError(error);
      },
    });

    await this.getMyMemberships({
      onSuccess: (response) => {
        this.memberships = response.data.value;
      },
      onError: (error) => {
        displaySonnerError(error);
      },
    });
  },
};
</script>

<template>
  <div class="w-screen h-20 backdrop-blur-lg fixed left-0 top-0 z-10" />
  <div class="w-full h-20 sticky top-0 left-0 grid grid-cols-3 z-10">
    <div class="flex items-center justify-start gap-4">
      <slot name="pre-left" />
      <Select
        :model-value="me?.selectedStoreId"
        @update:model-value="selectStore($event)"
      >
        <SelectTrigger>
          <SelectValue placeholder="Выберите магазин..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Магазины</SelectLabel>
            <SelectItem
              v-for="store in memberships"
              :key="store.id"
              :value="store.id"
            >
              {{ store.name }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <slot name="pro-left" />
    </div>
    <div class="flex items-center justify-center">
      <slot name="center" />
    </div>
    <div class="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger class="flex items-center gap-2">
          <Button variant="outline">
            <UserRound class="size-4" />
            {{ me?.userName }}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Профиль</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="postLogOut">
            Выйти
            <DropdownMenuShortcut>Ctrl+Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>
