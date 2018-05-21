import moment from 'moment'
import { mount } from '@vue/test-utils'
import ArticleCardContentDataCreatedAt from './ArticleCardContentDataCreatedAt'

describe('ArticleCardContentDataCreatedAt', () => {
  test('is a Vue instance', () => {
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
