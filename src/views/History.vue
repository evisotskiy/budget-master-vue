<template>
  <div>
    <div class="page-title">
      <h3>{{ "History_Title" | localize }}</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!records.length">
      {{ "NoRecords" | localize }}.
      <router-link to="/record">{{ "AddFirst" | localize }}</router-link>
    </p>

    <section v-else>
      <HistoryTable :records="items" />
      <Paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="goToPage"
        :prev-text="'Back' | localize"
        :next-text="'Forward' | localize"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
        :prev-class="'waves-effect'"
        :next-class="'waves-effect'"
      />
    </section>
  </div>
</template>

<script>
import paxinationMixin from "@/mixins/pagination.mixin";
import HistoryTable from "@/components/HistoryTable";
import { Pie } from "vue-chartjs";
import localizeFilter from "@/filters/localize.filter";

export default {
  name: "history",
  metaInfo() {
    return {
      title: this.$pageTitle("Menu_History")
    };
  },
  extends: Pie,
  mixins: [paxinationMixin],
  data: () => ({
    loading: true,
    records: []
  }),
  async mounted() {
    try {
      this.records = await this.$store.dispatch("fetchRecords");
      const categories = await this.$store.dispatch("fetchCategories");
      this.setup({ categories });

      this.loading = false;
    } catch (e) {
      this.$store.commit("setError", e);
    }
  },
  methods: {
    setup({ categories }) {
      this.setupPagination(
        this.records.map(record => {
          return {
            ...record,
            date: new Date(record.date),
            categoryName: categories.find(cat => cat.id === record.categoryId)
              .title,
            typeClass: record.type === "income" ? "green" : "red",
            typeText:
              record.type === "income"
                ? localizeFilter("Income")
                : localizeFilter("Outcome")
          };
        })
      );

      this.renderChart({
        labels: categories.map(cat => cat.title),
        datasets: [
          {
            label: localizeFilter("CostsForCategories"),
            data: categories.map(cat => {
              return this.records.reduce((total, record) => {
                if (record.categoryId === cat.id && record.type === "outcome") {
                  total += +record.amount;
                }
                return total;
              }, 0);
            }),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      });
    }
  },
  components: { HistoryTable },
  watch: {
    $route(to) {
      if (!to.query.page) {
        this.goToPage(1);
        this.page = 1;
      }
    }
  }
};
</script>
