<template>
  <Loader v-if="loading" />
  <div v-else class="app-main-layout" :key="locale">
    <Navbar @sandwitchClick="isOpen = !isOpen" />

    <Sidebar v-model="isOpen" />

    <main class="app-content" :class="{ full: !isOpen }">
      <div class="app-page">
        <router-view />
      </div>
    </main>

    <div class="fixed-action-btn">
      <router-link
        class="btn-floating btn-large blue"
        to="/record"
        v-tooltip="'CreateNewRecord'"
        data-position="left"
      >
        <i class="large material-icons">add</i>
      </router-link>
    </div>
  </div>
</template>

<script>
import messages from "@/utils/messages";
import Navbar from "@/components/app/Navbar";
import Sidebar from "@/components/app/Sidebar";

export default {
  name: "main-layout",
  components: {
    Navbar,
    Sidebar
  },
  data: () => ({
    isOpen: true,
    loading: true
  }),
  async mounted() {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch("fetchInfo");
    }
    this.loading = false;
  },
  computed: {
    error() {
      return this.$store.getters.error;
    },
    locale() {
      return this.$store.getters.info.locale;
    }
  },
  watch: {
    error(fbError) {
      if (messages[fbError.code]) {
        this.$message(messages[fbError.code]);
      } else {
        this.$message(fbError.message);
      }
    }
  }
};
</script>
