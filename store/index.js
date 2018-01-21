import Vue from 'vue'
import Vuex from 'vuex'
import story from './modules/story'
import user from './modules/user'

Vue.use(Vuex)

export default () =>
  new Vuex.Store({
    modules: {
      story,
      user
    }
  })
