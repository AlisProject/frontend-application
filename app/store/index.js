import Vue from 'vue'
import Vuex from 'vuex'
import { createModule } from 'vuex-toast'
import article from './modules/article'
import user from './modules/user'

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
