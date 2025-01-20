import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import TabBar from '../TabBar.vue'
import ButtonComponent from '@/components/Button/ButtonComponent.vue'

describe('TabBar', () => {
  it('renders correctly', () => {
    const wrapper = mount(TabBar, {
      props: {
        onTabChange: vi.fn(),
      },
    })
    expect(wrapper.findAllComponents(ButtonComponent)).toHaveLength(2)
  })

  it('sets initial active tab to "all"', () => {
    const wrapper = mount(TabBar, {
      props: {
        onTabChange: vi.fn(),
      },
    })
    const allButton = wrapper.findAllComponents(ButtonComponent)[0]
    const favoritesButton = wrapper.findAllComponents(ButtonComponent)[1]

    expect(allButton.classes()).toContain('active')
    expect(favoritesButton.classes()).not.toContain('active')
  })

  it('changes active tab when clicked', async () => {
    const onTabChange = vi.fn()
    const wrapper = mount(TabBar, {
      props: {
        onTabChange,
      },
    })
    const allButton = wrapper.findAllComponents(ButtonComponent)[0]
    const favoritesButton = wrapper.findAllComponents(ButtonComponent)[1]

    expect(allButton.classes()).toContain('active')
    expect(favoritesButton.classes()).not.toContain('active')

    await favoritesButton.vm.$emit('click')

    await wrapper.vm.$nextTick()

    expect(allButton.classes()).not.toContain('active')
    expect(favoritesButton.classes()).toContain('active')
    expect(onTabChange).toHaveBeenCalledWith('favorites')
  })

  it('disables the active tab button', async () => {
    const onTabChange = vi.fn()
    const wrapper = mount(TabBar, {
      props: {
        onTabChange,
      },
    })
    const allButton = wrapper.findAllComponents(ButtonComponent)[0]
    const favoritesButton = wrapper.findAllComponents(ButtonComponent)[1]

    expect(allButton.props('disabled')).toBe(false)
    expect(favoritesButton.props('disabled')).toBe(true)

    await favoritesButton.vm.$emit('click')

    await wrapper.vm.$nextTick()

    expect(allButton.props('disabled')).toBe(true)
    expect(favoritesButton.props('disabled')).toBe(false)

    expect(onTabChange).toHaveBeenCalledWith('favorites')
  })

  it('sets tabBar prop to true for both buttons', () => {
    const wrapper = mount(TabBar, {
      props: {
        onTabChange: vi.fn(),
      },
    })
    const buttons = wrapper.findAllComponents(ButtonComponent)

    buttons.forEach((button) => {
      expect(button.props('tabBar')).toBe(true)
    })
  })
})
