import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ButtonComponent from '../ButtonComponent.vue'

describe('ButtonComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(ButtonComponent, {
      props: {
        text: 'Click me',
        onClick: vi.fn(),
        disabled: false,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct text', () => {
    const wrapper = mount(ButtonComponent, {
      props: {
        text: 'Click me',
        onClick: vi.fn(),
        disabled: false,
      },
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('calls onClick when clicked and not disabled', async () => {
    const onClick = vi.fn()
    const wrapper = mount(ButtonComponent, {
      props: {
        text: 'Click me',
        onClick,
        disabled: false,
      },
    })
    await wrapper.find('button').trigger('click')
    expect(onClick).toHaveBeenCalled()
  })

  it('does not call onClick when clicked and disabled', async () => {
    const onClick = vi.fn()
    const wrapper = mount(ButtonComponent, {
      props: {
        text: 'Click me',
        onClick,
        disabled: true,
      },
    })
    await wrapper.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('has disabled attribute when disabled prop is true', () => {
    const wrapper = mount(ButtonComponent, {
      props: {
        text: 'Click me',
        onClick: vi.fn(),
        disabled: true,
      },
    })
    expect(wrapper.find('button').element.disabled).toBe(true)
  })

  it('does not have disabled attribute when disabled prop is false', () => {
    const wrapper = mount(ButtonComponent, {
      props: {
        text: 'Click me',
        onClick: vi.fn(),
        disabled: false,
      },
    })
    expect(wrapper.attributes('disabled')).toBeUndefined()
  })

  it('renders icon when icon prop is provided', () => {
    const wrapper = mount(ButtonComponent, {
      props: {
        text: 'Click me',
        onClick: vi.fn(),
        disabled: false,
        icon: '/path/to/icon.png',
      },
    })
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe('/path/to/icon.png')
  })

  it('does not render icon when icon prop is not provided', () => {
    const wrapper = mount(ButtonComponent, {
      props: {
        text: 'Click me',
        onClick: vi.fn(),
        disabled: false,
      },
    })
    expect(wrapper.find('img').exists()).toBe(false)
  })
})
