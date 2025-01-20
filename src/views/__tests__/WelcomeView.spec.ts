import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import WelcomeView from '../WelcomeView.vue'
import ButtonComponent from '@/components/Button/ButtonComponent.vue'

const mockPush = vi.fn()
const mockRouter = {
  push: mockPush,
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  createRouter: vi.fn(),
  createWebHistory: vi.fn(),
}))

describe('WelcomeView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders properly', () => {
    const wrapper = mount(WelcomeView)
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct title', () => {
    const wrapper = mount(WelcomeView)
    expect(wrapper.find('.title').text()).toBe('Welcome to Pokédex')
  })

  it('displays the correct subtitle', () => {
    const wrapper = mount(WelcomeView)
    expect(wrapper.find('.subtitle').text()).toBe(
      'The digital encyclopedia created by Professor Oak is an invaluable tool to Trainers in the Pokémon world.',
    )
  })

  it('contains a ButtonComponent', () => {
    const wrapper = mount(WelcomeView)
    expect(wrapper.findComponent(ButtonComponent).exists()).toBe(true)
  })

  it('ButtonComponent has correct props', () => {
    const wrapper = mount(WelcomeView)
    const button = wrapper.findComponent(ButtonComponent)
    expect(button.props('text')).toBe('Get Started')
    expect(button.props('disabled')).toBe(false)
  })

  it('navigates to search page when button is clicked', async () => {
    const wrapper = mount(WelcomeView)
    const button = wrapper.findComponent(ButtonComponent)

    await button.props().onClick()

    await flushPromises()

    expect(mockPush).toHaveBeenCalledWith('/search')
  })
})
