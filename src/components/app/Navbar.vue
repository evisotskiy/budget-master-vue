<template>
  <nav class="navbar orange lighten-1">
    <div class="nav-wrapper">
      <div class="navbar-left">
        <a href="#" @click.prevent="$emit('sandwitchClick')">
          <i class="material-icons black-text">dehaze</i>
        </a>
        <span class="black-text">{{ date | date("datetime") }}</span>
      </div>

      <ul class="right hide-on-small-and-down">
        <li>
          <a
            class="dropdown-trigger black-text"
            href="#"
            data-target="dropdown"
            ref="dropdown"
          >
            {{ name }}
            <i class="material-icons right">arrow_drop_down</i>
          </a>

          <ul id="dropdown" class="dropdown-content">
            <li>
              <router-link to="/profile" class="black-text">
                <i class="material-icons">account_circle</i>
                {{ "ProfileTitle" | localize }}
              </router-link>
            </li>
            <li class="divider" tabindex="-1"></li>
            <li>
              <a href="#" class="black-text" @click.prevent="logout">
                <i class="material-icons">assignment_return</i>
                {{ "Exit" | localize }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  data: () => ({
    date: new Date(),
    intervalId: null,
    dropdown: null
  }),
  mounted() {
    this.dropdown = global.M.Dropdown.init(this.$refs.dropdown, {});
    this.tick();
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
    this.dropdown && this.dropdown.destroy && this.dropdown.destroy();
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch("logout");
      } catch (e) {
        this.$store.commit("setError", e);
      }
      this.$router.push("/login?message=logout");
    },
    tick() {
      this.intervalId = setInterval(() => {
        this.date = new Date();
      }, 1000);
    }
  },
  computed: {
    name() {
      return this.$store.getters.info.name;
    }
  }
};
</script>
