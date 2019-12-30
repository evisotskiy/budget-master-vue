<template>
  <Fragment>
    <div class="page-title">
      <h3>{{ "Menu_NewRecord" | localize }}</h3>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!categories.length">
      {{ "NoCategories" | localize }}.
      <router-link to="/categories">{{ "AddFirst" | localize }}</router-link>
    </p>

    <form class="form" v-else @submit.prevent="handleSubmit">
      <div class="input-field">
        <select ref="select" v-model="category">
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{
            cat.title
          }}</option>
        </select>
        <label>{{ "SelectCategory" | localize }}</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>{{ "Income" | localize }}</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>{{ "Outcome" | localize }}</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{
            invalid:
              ($v.amount.$dirty && !$v.amount.required) ||
              ($v.amount.$dirty && !$v.amount.minValue)
          }"
        />
        <label for="amount">{{ "Amount" | localize }}</label>
        <small
          class="helper-text invalid"
          v-if="$v.amount.$dirty && !$v.amount.required"
          >{{ "Message_AmountRequired" | localize }}</small
        >
        <small
          class="helper-text invalid"
          v-else-if="$v.amount.$dirty && !$v.amount.minValue"
          >{{ "Message_MinLength" | localize }}
          {{ $v.amount.$params.minValue.min }}</small
        >
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{
            invalid: $v.description.$dirty && !$v.description.required
          }"
        />
        <label for="description">{{ "Description" | localize }}</label>
        <span
          class="helper-text invalid"
          v-if="$v.description.$dirty && !$v.description.required"
          >{{ "Message_EnterDescription" | localize }}</span
        >
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ "Create" | localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </Fragment>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
import localizeFilter from "@/filters/localize.filter";

export default {
  name: "record",
  metaInfo() {
    return {
      title: this.$pageTitle("Menu_NewRecord")
    };
  },
  data: () => ({
    loading: true,
    categories: [],
    select: null,
    category: null,
    type: "outcome",
    amount: 1,
    description: ""
  }),
  validations: {
    amount: { required, minValue: minValue(1) },
    description: { required }
  },
  mounted() {
    Promise.resolve(this.$store.dispatch("fetchCategories"))
      .then(categories => {
        this.categories = categories;
        this.loading = false;

        if (categories.length) {
          this.category = categories[0].id;
        }
      })
      .then(() => {
        this.select = global.M.FormSelect.init(this.$refs.select);
        global.M.updateTextFields();
      })
      .catch(e => this.$store.commit("setError", e));
  },
  beforeDestroy() {
    this.select && this.select.destroy && this.select.destroy();
  },
  computed: {
    ...mapGetters(["info"]),
    canCreateRecord() {
      if (this.type === "income") {
        return true;
      }

      return this.info.bill >= this.amount;
    }
  },
  methods: {
    async handleSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch("createRecord", {
            categoryId: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON()
          });
          const bill =
            this.type === "income"
              ? this.info.bill + this.amount
              : this.info.bill - this.amount;

          await this.$store.dispatch("updateInfo", { bill });
          this.$message(localizeFilter("RecordHasBeenCreated"));
          this.$v.$reset();
          this.amount = 1;
          this.description = "";
        } catch (e) {
          this.$store.commit("setError", e);
        }
      } else {
        this.$message(
          `${localizeFilter("NotEnoughMoney")} (${this.amount -
            this.info.bill})`
        );
      }
    }
  }
};
</script>
