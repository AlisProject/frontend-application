import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import article from '@/store/modules/article'
import axios from '../../helpers/axios'

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
    store.$axios = axios
  })

  afterEach(() => {
    store = null
  })

  // Action spec sample
  test('getUserInfo actions is return user entity', async () => {
    const result = await store.dispatch('article/getUserInfo', { userId: '{user_1}' })
    expect(Object.keys(result).length).toBe(4)
  })

  // Action using mutation and getters sample
  test('getLikesCountOfArticle action is set likesCount and can read it from getters', async () => {
    await store.dispatch('article/getLikesCountOfArticle', { articleId: '{article_1}' })
    expect(store.getters['article/likesCount']).toBe(10)
  })

  describe('actions', () => {
    test('"getArticleDetail" sets article, likes, comments data to module', async () => {
      await store.dispatch('article/getArticleDetail', { articleId: '{article_1}' })
      expect(store.getters['article/article'].body).toBe(
        'Article overview, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      )
      expect(store.getters['article/article'].comments).toHaveLength(1)
      expect(store.getters['article/article'].article_id).toBe('{article_1}')
      expect(store.getters['article/likesCount']).toBe(10)
    })
  })
})
