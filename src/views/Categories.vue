<template>
  <Fragment>
    <div class="page-title">
      <h3>{{ "Categories" | localize }}</h3>
    </div>
    <section>
      <Loader v-if="loading" />
      <div class="row" v-else>
        <CategoryCreate @created="addNewCategory" />

        <CategoryEdit
          @updated="updateCategory"
          v-if="!!categories.length"
          :categories="categories"
          :key="updateCount"
        />
        <p v-else class="center">{{ "NoCategories" | localize }}</p>
      </div>
    </section>
  </Fragment>
</template>

<script>
import CategoryCreate from "@/components/CategoryCreate";
import CategoryEdit from "@/components/CategoryEdit";

export default {
  name: "categories",
  metaInfo() {
    return {
      title: this.$pageTitle("Menu_Categories")
    };
  },
  data: () => ({
    categories: [],
    loading: true,
    updateCount: 0
  }),
  components: {
    CategoryCreate,
    CategoryEdit
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category);
      this.updateCount++;
    },
    updateCategory(category) {
      this.categories = this.categories.map(cat => {
        return cat.id === category.id ? category : cat;
      });
      this.updateCount++;
    }
  },
  async mounted() {
    try {
      this.categories = await this.$store.dispatch("fetchCategories");
      this.loading = false;
    } catch (e) {
      this.$store.commit("setError", e);
    }
  }
};
</script>
