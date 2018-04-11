import Vue from 'vue'
import Vuex from 'vuex'
import article from './modules/article'
import user from './modules/user'
import { createModule } from 'vuex-toast'

Vue.use(Vuex)

export default () =>
  new Vuex.Store({
    modules: {
      article,
      user,
      toast: createModule({
        dismissInterval: 2000
      })
    }
  })
