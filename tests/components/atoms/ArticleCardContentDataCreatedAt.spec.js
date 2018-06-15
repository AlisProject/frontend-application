import moment from 'moment'
import { mount } from '@vue/test-utils'
import ArticleCardContentDataPublishedAt from '@/components/atoms/ArticleCardContentDataPublishedAt.vue'

describe('ArticleCardContentDataPublishedAt', () => {
  test('is render "2018/05/21" when createdAt = 1526858710 ', () => {
    const publishedAt = 1526858710 // 2018/05/21
    const wrapper = mount(ArticleCardContentDataPublishedAt, {
      propsData: {
        publishedAt
      }
    })
    expect(wrapper.element.innerHTML).toMatch(
      moment(publishedAt, 'X')
        .locale('ja')
        .format('L')
    )
  })
})
