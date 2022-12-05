import Vue from 'vue'
import Vuex from 'vuex'
import { createModule } from 'vuex-toast'
import article from './modules/article'
import articleModals from './modules/articleModals'
import user from './modules/user'
import tag from './modules/tag'
import report from './modules/report'
import presentation from './modules/presentation'
import badge from './modules/badge'
import nftGames from './modules/nftGames'

Vue.use(Vuex)

export default () =>
  new Vuex.Store({
    modules: {
      article,
      articleModals,
      user,
      tag,
      report,
      presentation,
      badge,
      nftGames,
      toast: createModule({
        dismissInterval: 2000
      })
    }
  })
