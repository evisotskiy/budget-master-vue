<template>
  <form class="card auth-card" @submit.prevent="handleSubmit">
    <div class="card-content">
      <span class="card-title">{{ "app_Title" | localize }}</span>

      <div class="input-field">
        <input
          id="email"
          type="text"
          v-model.trim="email"
          :class="{
            invalid:
              ($v.email.$dirty && !$v.email.required) ||
              ($v.email.$dirty && !$v.email.email)
          }"
        />
        <label for="email">{{ "Email" | localize }}</label>
        <small
          class="helper-text invalid"
          v-if="$v.email.$dirty && !$v.email.required"
          >{{ "Message_EmailRequired" | localize }}</small
        >
        <small
          class="helper-text invalid"
          v-else-if="$v.email.$dirty && !$v.email.email"
          >{{ "Message_EmailValid" | localize }}</small
        >
      </div>
      <div class="input-field">
        <input
          id="password"
          type="password"
          v-model="password"
          :class="{
            invalid:
              ($v.password.$dirty && !$v.password.required) ||
              ($v.password.$dirty && !$v.password.minLength)
          }"
        />
        <label for="password">{{ "Password" | localize }}</label>
        <small
          class="helper-text invalid"
          v-if="$v.password.$dirty && !$v.password.required"
          >{{ "Message_EnterPassword" | localize }}</small
        >
        <small
          class="helper-text invalid"
          v-else-if="$v.password.$dirty && !$v.password.minLength"
          >{{ "Message_MinLength" | localize }}
          {{ $v.password.$params.minLength.min }}</small
        >
      </div>
      <div class="input-field">
        <input id="name" type="text" class="validate" v-model.trim="name" />
        <label for="name">{{ "Name" | localize }}</label>
        <small
          class="helper-text invalid"
          v-if="$v.name.$dirty && !$v.name.required"
          >{{ "Message_EnterName" | localize }}</small
        >
      </div>
      <p>
        <label>
          <input type="checkbox" v-model="agree" />
          <span>{{ "AcceptRules" | localize }}</span>
        </label>
      </p>
    </div>
    <div class="card-action">
      <div>
        <button
          class="btn waves-effect waves-light auth-submit"
          type="submit"
          :disabled="!agree"
        >
          {{ "Register" | localize }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{ "HasAccount" | localize }}
        <router-link to="/login">{{ "Login" | localize }}</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import { required, minLength, email } from "vuelidate/lib/validators";

export default {
  name: "register",
  metaInfo() {
    return {
      title: this.$pageTitle("Register")
    };
  },
  data: () => ({
    email: "",
    password: "",
    name: "",
    agree: false
  }),
  validations: {
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(6)
    },
    name: {
      required
    },
    agree: {
      checked: Boolean
    }
  },
  methods: {
    async handleSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      const formData = {
        email: this.email,
        password: this.password,
        name: this.name
      };

      try {
        await this.$store.dispatch("register", formData);
        this.$router.push("/");
      } catch (e) {
        this.$store.commit("setError", e);
      }
    }
  }
};
</script>
