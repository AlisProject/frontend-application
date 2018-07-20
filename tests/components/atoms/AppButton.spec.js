import { mount } from '@vue/test-utils'
import AppButton from '@/components/atoms/AppButton.vue'

describe('AppButton', () => {
  test('is handle click event ', () => {
    const wrapper = mount(AppButton)
    jest.spyOn(wrapper.vm, 'callback')
    wrapper.update()
    wrapper.find('button').trigger('click')
    expect(wrapper.vm.callback).toBeCalled()
  })
})
