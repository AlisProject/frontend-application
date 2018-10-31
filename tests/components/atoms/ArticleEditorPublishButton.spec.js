import { mount } from '@vue/test-utils'
import ArticleEditorPublishButton from '@/components/atoms/ArticleEditor/ArticleEditorPublishButton.vue'

describe('ArticleEditorPublishButton', () => {
  test('default snapshot ', () => {
    const wrapper = mount(ArticleEditorPublishButton)
    expect(wrapper.element).toMatchSnapshot()
  })

  test('publishable snapshot ', () => {
    const wrapper = mount(ArticleEditorPublishButton, {
      propsData: {
        publishable: true
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
