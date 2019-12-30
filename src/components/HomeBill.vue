<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue bill-card">
      <div class="card-content white-text">
        <span class="card-title">{{ "BillInCurrency" | localize }}</span>

        <p v-for="curr of currencies" :key="curr" class="currency-line">
          <span>{{ getCurrency(curr) | currency(curr) }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    base() {
      return (
        this.$store.getters.info.bill / (this.rates["UAH"] / this.rates["EUR"])
      );
    }
  },
  props: ["rates"],
  methods: {
    getCurrency(curr) {
      return Math.floor(this.base * this.rates[curr]);
    }
  },
  data: () => ({
    currencies: ["UAH", "USD", "EUR"]
  })
};
</script>
