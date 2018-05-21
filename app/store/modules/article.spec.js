import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import article from './article'
import APIMock from '~/../test/mock/api'

describe('store/modules/article.js', () => {
  // Action spec sample
  test('getUserInfo actions is return user entity', async() => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    const store = new Vuex.Store({
      modules: {
        article
      }
    })
    store.$axios = APIMock
    const result = await store.dispatch('article/getUserInfo', { userId: 'potato4d' })
    expect(Object.keys(result).length).toBe(4)
  })

  // Action using mutation and getters sample
  test('getLikesCountOfArticle action is set likesCount and can read it from getters', async() => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    const store = new Vuex.Store({
      modules: {
        article
      }
    })
    store.$axios = APIMock
    await store.dispatch('article/getLikesCountOfArticle', { articleId: 1 })
    expect(store.getters['article/likesCount']).toBe(10)
  })
})
