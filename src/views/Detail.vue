<template>
  <div>
    <Loader v-if="loading" />
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">{{
          "Menu_History" | localize
        }}</router-link>
        <a class="breadcrumb">{{
          record.type === "income" ? "Доход" : "Расход" | localize
        }}</a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div
            class="card"
            :class="{
              red: record.type === 'outcome',
              green: record.type === 'income'
            }"
          >
            <div class="card-content white-text">
              <p>{{ "Description" | localize }}: {{ record.description }}</p>
              <p>
                {{ "Amount" | localize }}: {{ record.amount | currency("UAH") }}
              </p>
              <p>{{ "Category" | localize }}: {{ record.categoryName }}</p>

              <small>{{ record.date | date("datetime") }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="center" v-else>
      Запись с
      <strong>id={{ $route.params.id }}</strong> не найдена
    </p>
  </div>
</template>

<script>
export default {
  name: "detail",
  metaInfo() {
    return {
      title: this.$pageTitle("Detail_Title")
    };
  },

  data: () => ({
    record: null,
    loading: true
  }),
  async mounted() {
    const id = this.$route.params.id;
    try {
      const record = await this.$store.dispatch("fetchRecordById", id);
      const category = await this.$store.dispatch(
        "fetchCategoryById",
        record.categoryId
      );

      this.record = {
        ...record,
        date: new Date(record.date),
        categoryName: category.title
      };

      this.loading = false;
    } catch (e) {
      this.$store.commit("setError", e);
    }
  }
};
</script>
