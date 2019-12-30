import localizeFilter from "@/filters/localize.filter";

export default {
  install(Vue) {
    Vue.prototype.$message = function(html) {
      global.M.toast({ html });
    };
    Vue.prototype.$error = function(html) {
      global.M.toast({ html: `[${localizeFilter("Error")}]: ${html}` });
    };
  }
};
