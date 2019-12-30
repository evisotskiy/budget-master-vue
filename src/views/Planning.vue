<template>
  <Fragment>
    <div class="page-title">
      <h3>{{ "Menu_Planning" | localize }}</h3>
      <h4>{{ info.bill | currency("UAH") }}</h4>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!categories.length">
      {{ "NoCategories" | localize }}.
      <router-link to="/categories">{{ "AddFirst" | localize }}</router-link>
    </p>

    <section v-else>
      <div v-for="cat in categories" :key="cat.id">
        <p>
          <strong>{{ cat.title }}:</strong>
          {{ cat.spent | currency("UAH") }} {{ "Of" | localize }}
          {{ cat.limit | currency("UAH") }}
        </p>
        <div class="progress" v-tooltip.noloc="cat.tooltip">
          <div
            class="determinate"
            :class="cat.progressColor"
            :style="{ width: `${cat.progressPercent}%` }"
          ></div>
        </div>
      </div>
    </section>
  </Fragment>
</template>

<script>
import { mapGetters } from "vuex";
import currencyFilter from "@/filters/currency.filter";
import localizeFilter from "@/filters/localize.filter";

export default {
  name: "planning",
  metaInfo() {
    return {
      title: this.$pageTitle("Menu_Planning")
    };
  },
  data: () => ({
    loading: true,
    categories: []
  }),
  computed: {
    ...mapGetters(["info"])
  },
  async mounted() {
    try {
      const records = await this.$store.dispatch("fetchRecords");
      const categories = await this.$store.dispatch("fetchCategories");

      this.categories = categories.map(cat => {
        const spent = records
          .filter(r => r.categoryId === cat.id)
          .filter(r => r.type === "outcome")
          .reduce((total, record) => {
            return (total += +record.amount);
          }, 0);
        const percent = (100 * spent) / cat.limit;
        const progressPercent = percent > 100 ? 100 : percent;
        const progressColor =
          percent < 60 ? "green" : percent < 100 ? "yellow" : "red";

        const tooltipValue = cat.limit - spent;
        const tooltip = `${
          tooltipValue < 0 ? localizeFilter("MoreThan") : localizeFilter("Left")
        } ${currencyFilter(Math.abs(tooltipValue))}`;

        return {
          ...cat,
          progressPercent,
          progressColor,
          spent,
          tooltip
        };
      });

      this.loading = false;
    } catch (e) {
      this.$store.commit("setError", e);
    }
  }
};
</script>
