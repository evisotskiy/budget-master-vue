<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ "Edit" | localize }}</h4>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{
              cat.title
            }}</option>
          </select>
          <label>{{ "SelectCategory" | localize }}</label>
        </div>

        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="title"
            :class="{ invalid: $v.title.$dirty && !$v.title.required }"
          />
          <label for="name">{{ "Title" | localize }}</label>
          <small
            class="helper-text invalid"
            v-if="$v.title.$dirty && !$v.title.required"
            >{{ "Message_CategoryTitle" | localize }}</small
          >
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{
              invalid:
                ($v.limit.$dirty && !$v.limit.required) ||
                ($v.limit.$dirty && !$v.limit.minValue)
            }"
          />
          <label for="limit">{{ "Limit" | localize }}</label>
          <small
            class="helper-text invalid"
            v-if="$v.limit.$dirty && !$v.limit.required"
            >{{ "Message_LimitRequired" | localize }}</small
          >
          <small
            class="helper-text invalid"
            v-else-if="$v.limit.$dirty && !$v.limit.minValue"
            >{{ "Message_MinLength" | localize }}:
            {{ $v.limit.$params.minValue.min }}</small
          >
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ "Update" | localize }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";
import localizeFilter from "@/filters/localize.filter";

export default {
  data: () => ({
    select: null,
    title: "",
    limit: 100,
    current: null
  }),
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  validations: {
    title: { required },
    limit: { required, minValue: minValue(100) }
  },
  watch: {
    current(value) {
      const { title, limit } = this.categories.find(({ id }) => id === value);
      this.title = title;
      this.limit = limit;
    }
  },
  created() {
    const { id, title, limit } = this.categories[0];
    this.current = id;
    this.title = title;
    this.limit = limit;
  },
  mounted() {
    this.select = global.M.FormSelect.init(this.$refs.select);
    global.M.updateTextFields();
  },
  beforeDestroy() {
    this.select && this.select.destroy && this.select.destroy();
  },
  methods: {
    async handleSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        const categoryData = {
          id: this.current,
          title: this.title,
          limit: this.limit
        };
        await this.$store.dispatch("updateCategory", categoryData);
        this.$message(localizeFilter("Category_HasBeenUpdated"));
        this.$emit("updated", categoryData);
      } catch (e) {
        this.$store.commit("setError", e);
      }
    }
  }
};
</script>
