import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import presentation from '@/store/modules/presentation'
import axios from '../../helpers/axios'

describe('store/modules/presentation.js', () => {
  let store

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    store = new Vuex.Store({
      modules: {
        presentation
      }
    })
    store.$axios = axios
  })

  afterEach(() => {
    store = null
  })

  // Action spec sample
  test("when dispatch 'setArticleListScrollHeight' with scrollHeight=100, articleListScrollHeight changed to 100", async () => {
    const scrollHeight = 100
    store.dispatch('presentation/setArticleListScrollHeight', { scrollHeight })
    expect(store.getters['presentation/articleListScrollHeight']).toBe(100)
  })
})
