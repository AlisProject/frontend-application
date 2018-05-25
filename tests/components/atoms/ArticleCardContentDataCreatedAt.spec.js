import moment from 'moment'
import { mount } from '@vue/test-utils'
import ArticleCardContentDataCreatedAt from '@/components/atoms/ArticleCardContentDataCreatedAt.vue'

describe('ArticleCardContentDataCreatedAt', () => {
  test('is render "2018/05/21" when createdAt = 1526858710 ', () => {
    const createdAt = 1526858710 // 2018/05/21
    const wrapper = mount(ArticleCardContentDataCreatedAt, {
      propsData: {
        createdAt
      }
    })
    expect(wrapper.element.innerHTML).toMatch(
      moment(createdAt, 'X').locale('ja').format('L')
    )
  })
})
