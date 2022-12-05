import Vue from 'vue'
import VueEasytable, { VePagination, veLoading } from 'vue-easytable'

Vue.prototype.$veLoading = veLoading
Vue.use(VueEasytable)
Vue.use(VePagination)
