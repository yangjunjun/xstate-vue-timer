import Vue from "vue";
import App from "./App.vue";
import VueCompositionApi from "@vue/composition-api";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPause, faStop, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { inspect } from "@xstate/inspect";

inspect({ iframe: false });

library.add(faPause, faStop, faPlay);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App)
}).$mount("#app");
