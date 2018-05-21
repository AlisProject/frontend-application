import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import article from './article'
import APIMock from '~/../test/mock/api'

describe('store/modules/article.js', () => {

  let store

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    store = new Vuex.Store({
      modules: {
        article
      }
    })
    store.$axios = APIMock
  })

  afterEach(() => {
    store = null
  })

  // Action spec sample
  test('getUserInfo actions is return user entity', async() => {
    const result = await store.dispatch('article/getUserInfo', { userId: 'potato4d' })
    expect(Object.keys(result).length).toBe(4)
  })

  // Action using mutation and getters sample
  test('getLikesCountOfArticle action is set likesCount and can read it from getters', async() => {
    await store.dispatch('article/getLikesCountOfArticle', { articleId: 1 })
    expect(store.getters['article/likesCount']).toBe(10)
  })
})
