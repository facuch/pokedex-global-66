import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import PokemonModal from '../PokemonModal.vue'
import { createPinia, setActivePinia } from 'pinia'
import { usePokemonCacheStore } from '@/stores/pokemonCacheStore'
import type Pokemon from '@/interfaces/Pokemon'

vi.mock('@/stores/pokemonCacheStore')

const mockPokemon: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  type: 'grass, poison',
  height: 7,
  weight: 69,
  image: 'http://example.com/bulbasaur.png',
}

type PokemonCacheStore = ReturnType<typeof usePokemonCacheStore>

// Add this type definition
type NavigatorWithClipboard = Navigator & {
  clipboard: { writeText: (text: string) => Promise<void> }
}
interface MockStore extends Partial<PokemonCacheStore> {
  fetchPokemonData: ReturnType<typeof vi.fn>
  isLoading?: boolean
}

describe('PokemonModal', () => {
  let mockStore: MockStore

  beforeEach(() => {
    setActivePinia(createPinia())
    mockStore = {
      fetchPokemonData: vi.fn().mockResolvedValue(mockPokemon),
      isLoading: false,
      error: null,
    }
    vi.mocked(usePokemonCacheStore).mockReturnValue(mockStore as PokemonCacheStore)
  })

  interface PokemonModalProps {
    pokemonId: number
    isOpen: boolean
    isFavorite: boolean
  }

  const mountComponent = (props: PokemonModalProps) => {
    return mount(PokemonModal, {
      global: {
        plugins: [createPinia()],
      },
      props,
    })
  }

  it('does not render when isOpen is false', () => {
    const wrapper = mountComponent({
      pokemonId: 1,
      isOpen: false,
      isFavorite: false,
    })

    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('renders properly when isOpen is true', async () => {
    const wrapper = mountComponent({
      pokemonId: 1,
      isOpen: true,
      isFavorite: false,
    })

    await flushPromises()

    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.find('.modal-content').exists()).toBe(true)
    expect(wrapper.find('.pokemon-content').exists()).toBe(true)
  })

  it('displays loading state when isLoading is true', async () => {
    mockStore.isLoading = true
    const wrapper = mountComponent({
      pokemonId: 1,
      isOpen: true,
      isFavorite: false,
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Loading...')
  })

  it('displays error message when there is an error', async () => {
    mockStore.fetchPokemonData.mockRejectedValue(new Error('Error fetching Pokemon'))

    const wrapper = mountComponent({
      pokemonId: 1,
      isOpen: true,
      isFavorite: false,
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Error fetching Pokemon')
  })

  it('displays correct pokemon information', async () => {
    const wrapper = mountComponent({
      pokemonId: 1,
      isOpen: true,
      isFavorite: false,
    })

    await flushPromises()

    expect(wrapper.find('.pokemon-name').text()).toContain('bulbasaur')
    expect(wrapper.find('.pokemon-type').text()).toContain('grass, poison')
    expect(wrapper.find('.pokemon-height').text()).toContain('7')
    expect(wrapper.find('.pokemon-weight').text()).toContain('69')
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mountComponent({
      pokemonId: 1,
      isOpen: true,
      isFavorite: false,
    })

    await wrapper.find('.close-button').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits toggleFavorite event when favorite button is clicked', async () => {
    const wrapper = mountComponent({
      pokemonId: 1,
      isOpen: true,
      isFavorite: false,
    })

    await flushPromises()

    await wrapper.find('.favorite-icon').trigger('click')

    expect(wrapper.emitted('toggleFavorite')).toBeTruthy()
    expect(wrapper.emitted('toggleFavorite')?.[0]).toEqual([1])
  })

  it('copies Pokemon data to clipboard when Share button is clicked', async () => {
    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
    }

    // Use the new type for the navigator
    const originalNavigator = global.navigator
    global.navigator = {
      ...originalNavigator,
      clipboard: mockClipboard,
    } as unknown as NavigatorWithClipboard

    const wrapper = mountComponent({
      pokemonId: 1,
      isOpen: true,
      isFavorite: false,
    })

    await flushPromises()

    const shareButton = wrapper.find('button')
    await shareButton.trigger('click')

    expect(mockClipboard.writeText).toHaveBeenCalledWith('bulbasaur,7,69,grass, poison')

    // Clean up
  })
})
