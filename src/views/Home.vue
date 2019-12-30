<template>
  <div>
    <div class="page-title">
      <h3>{{ "Bill" | localize }}</h3>

      <button class="btn waves-effect waves-light btn-small" @click="refresh">
        <i class="material-icons">refresh</i>
      </button>
    </div>

    <Loader v-if="loading" />

    <div v-else class="row">
      <HomeBill :rates="currency.rates" />
      <HomeCurrency :rates="currency.rates" :dateStr="currency.date" />
    </div>
  </div>
</template>

<script>
import HomeBill from "@/components/HomeBill";
import HomeCurrency from "@/components/HomeCurrency";

export default {
  name: "home",
  metaInfo() {
    return {
      title: this.$pageTitle("Menu_Bill")
    };
  },
  components: { HomeBill, HomeCurrency },
  data: () => ({
    loading: true,
    currency: null
  }),
  async mounted() {
    this.currency = await this.$store.dispatch("fetchCurrency");
    this.loading = false;
  },
  methods: {
    async refresh() {
      this.loading = true;
      setTimeout(async () => {
        this.currency = await this.$store.dispatch("fetchCurrency");
        this.loading = false;
      }, 500);
    }
  }
};
</script>
