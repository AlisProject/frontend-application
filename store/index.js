import Vue from 'vue'
import Vuex from 'vuex'
import header from './modules/header'
import story from './modules/story'

Vue.use(Vuex)

export default () =>
  new Vuex.Store({
    modules: {
      header,
      story
    }
  })
