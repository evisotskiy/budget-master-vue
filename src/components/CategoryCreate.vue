<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ "Create" | localize }}</h4>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="title"
            :class="{ invalid: $v.title.$dirty && !$v.title.required }"
          />
          <label for="name">{{ "Title" | localize }}</label>
          <small
            v-if="$v.title.$dirty && !$v.title.required"
            class="helper-text invalid"
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
          {{ "Create" | localize }}
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
    title: "",
    limit: 100
  }),
  validations: {
    title: { required },
    limit: { required, minValue: minValue(100) }
  },
  methods: {
    async handleSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      try {
        const category = await this.$store.dispatch("createCategory", {
          title: this.title,
          limit: this.limit
        });
        this.title = "";
        this.limit = 100;
        this.$v.$reset();
        this.$message(localizeFilter("Category_HasBeenCreated"));
        this.$emit("created", category);
      } catch (e) {
        this.$store.commit("setError", e);
      }
    }
  },
  mounted() {
    global.M.updateTextFields();
  },
  updated() {
    global.M.updateTextFields();
  }
};
</script>
