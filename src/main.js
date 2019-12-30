import Vue from "vue";
import VueMeta from "vue-meta";
import Vuelidate from "vuelidate";
import Paginate from "vuejs-paginate";
import { Fragment } from "vue-fragment";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import dateFilter from "@/filters/date.filter";
import currencyFilter from "@/filters/currency.filter";
import localizeFilter from "@/filters/localize.filter";
import messagePlugin from "@/utils/message.plugin";
import titlePlugin from "@/utils/title.plugin";
import Loader from "@/components/app/Loader";
import tooltipDirective from "@/directives/tooltip.directive";
import "./registerServiceWorker";
import "materialize-css";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

Vue.config.productionTip = false;
Vue.use(VueMeta);
Vue.use(Vuelidate);
Vue.use(messagePlugin);
Vue.use(titlePlugin);
Vue.filter("date", dateFilter);
Vue.filter("currency", currencyFilter);
Vue.filter("localize", localizeFilter);
Vue.directive("tooltip", tooltipDirective);
Vue.component("Loader", Loader);
Vue.component("Fragment", Fragment);
Vue.component("Paginate", Paginate);

firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: "vue-crm-277a9.firebaseapp.com",
  databaseURL: "https://vue-crm-277a9.firebaseio.com",
  projectId: "vue-crm-277a9",
  storageBucket: "vue-crm-277a9.appspot.com",
  messagingSenderId: "789802143487",
  appId: "1:789802143487:web:0fdfcf39da243010f806ca",
  measurementId: "G-W6239HNYYW"
});

let app;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});
