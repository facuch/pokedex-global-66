import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import SearchView from '../SearchView.vue'
import { usePokemonStore } from '@/stores/pokemonStore'
import { useFavoritesStore } from '@/stores/favoritesStore'
import PokemonList from '@/components/PokemonList/PokemonList.vue'
import SearchBar from '@/components/SearchBar/SearchBar.vue'
import TabBar from '@/components/TabBar/TabBar.vue'
import PokemonModal from '@/components/PokemonModal/PokemonModal.vue'
import type SimplePokemon from '@/interfaces/SimplePokemon'

interface SearchViewComponent {
  activeTab: string
  searchQuery: string
  displayedPokemons: SimplePokemon[]
}

describe('SearchView', () => {
  let wrapper: VueWrapper
  let pokemonStore: ReturnType<typeof usePokemonStore>
  let favoritesStore: ReturnType<typeof useFavoritesStore>

  beforeEach(() => {
    vi.useFakeTimers()
    wrapper = mount(SearchView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              pokemon: {
                pokemons: [
                  { id: 1, name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
                  { id: 2, name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
                ],
                isLoading: false,
                pagination: { next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20' },
              },
              favorites: {
                favorites: [],
              },
            },
          }),
        ],
        stubs: {
          PokemonList: true,
          SearchBar: true,
          TabBar: true,
          PokemonModal: true,
        },
      },
    })

    pokemonStore = usePokemonStore()
    favoritesStore = useFavoritesStore()

    vi.spyOn(pokemonStore, 'fetchMorePokemons')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  async function waitForLoader() {
    vi.advanceTimersByTime(1500)
    await flushPromises()
    await wrapper.vm.$nextTick()
  }

  it('renders correctly', async () => {
    await waitForLoader()
    expect(wrapper.findComponent(SearchBar).exists()).toBe(true)
    expect(wrapper.findComponent(PokemonList).exists()).toBe(true)
    expect(wrapper.findComponent(TabBar).exists()).toBe(true)
  })

  it('changes tab when TabBar emits tab-change', async () => {
    await waitForLoader()
    wrapper.findComponent(TabBar).vm.$emit('tab-change', 'favorites')
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as unknown as SearchViewComponent).activeTab).toBe('favorites')
  })

  it('opens modal when a pokemon is selected', async () => {
    await waitForLoader()
    wrapper.findComponent(PokemonList).vm.$emit('pokemon-selected', { id: 1, name: 'bulbasaur' })
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(PokemonModal).props('isOpen')).toBe(true)
    expect(wrapper.findComponent(PokemonModal).props('pokemonId')).toBe(1)
  })

  it('closes modal when PokemonModal emits close', async () => {
    await waitForLoader()
    wrapper.findComponent(PokemonList).vm.$emit('pokemon-selected', { id: 1, name: 'bulbasaur' })
    await wrapper.vm.$nextTick()
    wrapper.findComponent(PokemonModal).vm.$emit('close')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(PokemonModal).props('isOpen')).toBe(false)
  })

  it('handles search correctly', async () => {
    await waitForLoader()

    wrapper.findComponent(SearchBar).vm.$emit('search', 'bulba')
    await wrapper.vm.$nextTick()

    expect((wrapper.vm as unknown as SearchViewComponent).searchQuery).toBe('bulba')

    // Verificar que los pokémons filtrados son los correctos
    const displayedPokemons = (wrapper.vm as unknown as SearchViewComponent).displayedPokemons
    expect(displayedPokemons.length).toBe(1)
    expect(displayedPokemons[0].name).toBe('bulbasaur')
  })

  it('displays "No Results" when search query yields no results', async () => {
    await waitForLoader()
    pokemonStore.pokemons = []
    wrapper.findComponent(SearchBar).vm.$emit('search', 'nonexistent')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.no-results').exists()).toBe(true)
  })

  it('clears search and resets to "all" tab when "Go to Home" is clicked', async () => {
    await waitForLoader()
    pokemonStore.pokemons = []
    wrapper.findComponent(SearchBar).vm.$emit('search', 'nonexistent')
    await wrapper.vm.$nextTick()

    const goToHomeButton = wrapper.find('.no-results button')
    expect(goToHomeButton.exists()).toBe(true)

    await goToHomeButton.trigger('click')
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as unknown as SearchViewComponent).searchQuery).toBe('')
    expect((wrapper.vm as unknown as SearchViewComponent).activeTab).toBe('all')
  })

  it('toggles favorite status when PokemonModal emits toggle-favorite', async () => {
    await waitForLoader()
    const pokemon = { id: 1, name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
    wrapper.findComponent(PokemonList).vm.$emit('pokemon-selected', pokemon)
    await wrapper.vm.$nextTick()

    const addFavoriteSpy = vi.spyOn(favoritesStore, 'addFavorite')
    const removeFavoriteSpy = vi.spyOn(favoritesStore, 'removeFavorite')

    vi.spyOn(favoritesStore, 'isFavorite').mockReturnValue(false)

    wrapper.findComponent(PokemonModal).vm.$emit('toggle-favorite', pokemon.id)

    expect(addFavoriteSpy).toHaveBeenCalledWith(pokemon)

    vi.spyOn(favoritesStore, 'isFavorite').mockReturnValue(true)

    wrapper.findComponent(PokemonModal).vm.$emit('toggle-favorite', pokemon.id)

    expect(removeFavoriteSpy).toHaveBeenCalledWith(pokemon.id)
  })
})
