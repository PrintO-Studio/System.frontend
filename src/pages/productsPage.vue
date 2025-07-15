<script>
import Page from "@/components/page.vue";
import NavigationBar from "@/components/navigationBar.vue";
import ProductsTable from "@/components/products/productsTable.vue";
import { columns as productColumns } from "@/components/products/columns";
import { mapActions } from "vuex";
import { displaySonnerError } from "@/store/sonnerHelper";
import Button from "@/components/ui/button/Button.vue";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-vue-next";
import { PAGE_PRODUCT_CREATION } from "@/router";
import Input from "@/components/ui/input/Input.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ToolsButton from "@/components/toolsButton.vue";

export default {
  components: {
    Page,
    NavigationBar,
    ProductsTable,
    Button,
    Plus,
    Search,
    ChevronLeft,
    ChevronsLeft,
    ChevronRight,
    ChevronsRight,
    Input,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    ToolsButton,
  },
  methods: {
    ...mapActions(["getAllProducts"]),

    async fetchProducts() {
      this.isProductsLoading = true;
      this.products = [];
      await this.getAllProducts({
        startIndex: this.startIndex,
        pageSize: this.pageSize,
        searchQuery: this.searchQuery,
        onSuccess: (response) => {
          this.products = response.data.value.items.map((f) => f);
          this.lastPage = response.data.value.lastPage;
          this.totalCount = response.data.value.totalCount;
        },
        onError: (error) => {
          displaySonnerError(error);
        },
      });
      this.isProductsLoading = false;
    },
  },
  data() {
    let pageSize = Number(this.$route.query.pageSize ?? 25);
    let startIndex = (Number(this.$route.query.page ?? 1) - 1) * pageSize;
    let searchQuery = this.$route.query.search ?? "";

    return {
      products: [],
      productColumns,
      isProductsLoading: false,
      PAGE_PRODUCT_CREATION,
      lastPage: false,
      startIndex,
      pageSize,
      totalCount: 0,
      searchQuery,
      prevSearchQuery: searchQuery,
    };
  },
  watch: {
    startIndex(newVal) {
      this.fetchProducts();
    },
    searchQuery(newVal, oldVal) {
      let queryReplace = newVal;
      if (newVal.length == 0) queryReplace = undefined;
      this.$router.replace({
        query: { ...this.$route.query, search: queryReplace },
      });
      if (this.page != 1) this.page = 1;
      else if (oldVal.length > 0 && newVal.length == 0) this.fetchProducts();
    },
    pageSize(newVal) {
      this.$router.replace({
        query: { ...this.$route.query, pageSize: newVal },
      });
      if (this.page != 1) this.page = 1;
      else this.fetchProducts();
    },
  },
  computed: {
    lastPossiblePage() {
      return Math.ceil(this.totalCount / this.pageSize);
    },
    page: {
      get() {
        return this.startIndex / this.pageSize + 1;
      },
      set(value) {
        this.$router.replace({
          query: { ...this.$route.query, page: value },
        });
        this.startIndex = (value - 1) * this.pageSize;
      },
    },
  },
  async mounted() {
    await this.fetchProducts();

    if (this.page > this.lastPossiblePage) this.page = this.lastPossiblePage;
  },
};
</script>

<template>
  <Page class="flex flex-col">
    <NavigationBar>
      <template #pro-left>
        <RouterLink :to="PAGE_PRODUCT_CREATION">
          <Button variant="ghost">
            <Plus class="size-4" />
            Добавить товар
          </Button>
        </RouterLink>
      </template>
      <template #center>
        <div class="relative w-full h-9">
          <Input
            class="absolute w-full h-full"
            placeholder="Поиск..."
            v-model="searchQuery"
            @keypress.enter="fetchProducts"
          />
          <Button
            class="absolute top-1/2 -translate-y-1/2 right-0.5 size-8"
            variant="link"
            @click="fetchProducts"
          >
            <Search class="size-4" />
          </Button>
        </div>
      </template>
      <template #pre-right>
        <ToolsButton/>
      </template>
    </NavigationBar>
    <div class="border rounded-lg h-full w-full grow mb-4 flex flex-col">
      <ProductsTable
        :data="products"
        :columns="productColumns"
        :is-loading="isProductsLoading"
        class="grow h-full"
      />
      <div
        class="flex items-center justify-between p-4"
        v-if="!isProductsLoading"
      >
        <div class="flex space-x-2 items-center">
          <p class="text-sm mr-4">показывать по</p>
          <Select v-model="pageSize" :default-value="pageSize">
            <SelectTrigger class="bg-primary-foreground">
              <SelectValue placeholder="Размер страницы..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Размеры страницы</SelectLabel>
                <SelectItem as="button" :value="10">10</SelectItem>
                <SelectItem as="button" :value="25">25</SelectItem>
                <SelectItem as="button" :value="50">50</SelectItem>
                <SelectItem as="button" :value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="flex space-x-2 items-center">
          <p class="text-sm mr-4">
            страница {{ page }} из {{ lastPossiblePage }}
          </p>
          <Button
            variant="outline"
            size="sm"
            :disabled="page - 1 <= 0"
            @click="page = 1"
          >
            <ChevronsLeft class="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="page - 1 <= 0"
            @click="page--"
          >
            <ChevronLeft class="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="lastPage"
            @click="page++"
          >
            <ChevronRight class="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="lastPage"
            @click="page = lastPossiblePage"
          >
            <ChevronsRight class="size-4" />
          </Button>
        </div>
      </div>
    </div>
  </Page>
</template>
