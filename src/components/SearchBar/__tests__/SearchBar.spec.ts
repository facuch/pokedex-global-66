import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '../SearchBar.vue'

describe('SearchBar', () => {
  it('renders properly', () => {
    const wrapper = mount(SearchBar, { props: { value: '' } })
    expect(wrapper.find('.search-bar').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('img.search-icon').exists()).toBe(true)
  })

  it('displays the initial value', () => {
    const initialValue = 'Pikachu'
    const wrapper = mount(SearchBar, {
      props: { value: initialValue },
    })
    expect(wrapper.find('input').element.value).toBe(initialValue)
  })

  it('emits search event when input changes', async () => {
    const wrapper = mount(SearchBar, { props: { value: '' } })
    const input = wrapper.find('input')

    await input.setValue('Charizard')

    expect(wrapper.emitted('update:value')).toBeTruthy()
    expect(wrapper.emitted('update:value')![0]).toEqual(['Charizard'])
  })

  it('updates input value when typed', async () => {
    const wrapper = mount(SearchBar, { props: { value: '' } })
    const input = wrapper.find('input')

    await input.setValue('Bulbasaur')

    expect(input.element.value).toBe('Bulbasaur')
  })

  it('has correct placeholder text', () => {
    const wrapper = mount(SearchBar, { props: { value: '' } })
    const input = wrapper.find('input')

    expect(input.attributes('placeholder')).toBe('Search')
  })

  it('uses the correct search icon', () => {
    const wrapper = mount(SearchBar, { props: { value: '' } })
    const icon = wrapper.find('img.search-icon')

    expect(icon.attributes('src')).toContain('Search.svg')
    expect(icon.attributes('alt')).toBe('Search')
  })
})
