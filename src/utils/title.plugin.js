import localizeFilter from "@/filters/localize.filter";

/* Create title for pages */
export default {
  install(Vue) {
    Vue.prototype.$pageTitle = function(titleKey) {
      const appName = process.env.VUE_APP_TITLE;
      return `${localizeFilter(titleKey)} | ${appName}`;
    };
  }
};
