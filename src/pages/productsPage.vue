<script>
import Page from "@/components/page.vue";
import NavigationBar from "@/components/navigationBar.vue";
import ProductsTable from "@/components/products/productsTable.vue";
import { columns as productColumns } from "@/components/products/columns";
import { mapActions } from "vuex";
import { displaySonnerError } from "@/store/sonnerHelper";
import Button from "@/components/ui/button/Button.vue";
import { Plus, Search } from "lucide-vue-next";
import { PAGE_PRODUCT_CREATION } from "@/router";
import Input from "@/components/ui/input/Input.vue";

export default {
  components: {
    Page,
    NavigationBar,
    ProductsTable,
    Button,
    Plus,
    Search,
    Input,
  },
  methods: {
    ...mapActions(["getAllProducts"]),
    async fetchProducts() {
      this.isProductsLoading = true;
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
    let pageSize = 10;
    let page = this.$route.query.page ?? 1;
    let startIndex = (page - 1) * pageSize;

    return {
      products: [],
      productColumns,
      isProductsLoading: false,
      PAGE_PRODUCT_CREATION,
      page,
      lastPage: false,
      startIndex,
      pageSize,
      totalCount: 0,
      searchQuery: this.$route.search ?? "",
    };
  },
  watch: {
    async page(newVal) {
      this.startIndex = (newVal - 1) * this.pageSize;
      this.$router.replace({ query: { page: newVal } });
      await this.fetchProducts();
    },
    searchQuery(newVal, oldVal) {
      let queryReplace = newVal;
      if (newVal.length == 0) queryReplace = undefined;
      this.$router.replace({ query: { search: queryReplace } });

      if (oldVal.length > 0 && newVal.length == 0) this.fetchProducts();
    },
  },
  computed: {
    lastPossiblePage() {
      return Math.ceil(this.totalCount / this.pageSize);
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
            @keyup.enter="fetchProducts"
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
    </NavigationBar>
    <div class="border rounded-lg h-full w-full grow mb-4">
      <ProductsTable
        :data="products"
        :columns="productColumns"
        :is-loading="isProductsLoading"
        class="border-b"
      />
      <div class="flex items-center justify-end p-4 space-x-2">
        <p class="text-sm mr-4">
          страница {{ page }} из {{ lastPossiblePage }}
        </p>
        <Button
          variant="outline"
          size="sm"
          :disabled="page - 1 <= 0"
          @click="page--"
        >
          Назад
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="lastPage"
          @click="page++"
        >
          Вперёд
        </Button>
      </div>
    </div>
  </Page>
</template>
