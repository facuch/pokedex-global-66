import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFavoritesStore } from '../favoritesStore'
import localForage from 'localforage'

vi.mock('localforage')

const pokemon = { id: 1, name: 'Bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }

describe('favoritesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with an empty favorites array', () => {
    const store = useFavoritesStore()
    expect(store.favorites).toEqual([])
  })

  it('should add a favorite', async () => {
    const store = useFavoritesStore()

    vi.spyOn(localForage, 'setItem').mockResolvedValue(undefined)

    await store.addFavorite(pokemon)

    expect(store.favorites).toContainEqual(pokemon)
    expect(localForage.setItem).toHaveBeenCalledWith('pokemon_favorites', JSON.stringify([pokemon]))
  })

  it('should not add duplicate favorites', async () => {
    const store = useFavoritesStore()

    vi.spyOn(localForage, 'setItem').mockResolvedValue(undefined)

    await store.addFavorite(pokemon)
    await store.addFavorite(pokemon)

    expect(store.favorites).toHaveLength(1)
    expect(store.favorites).toContainEqual(pokemon)
  })

  it('should remove a favorite', async () => {
    const store = useFavoritesStore()

    vi.spyOn(localForage, 'setItem').mockResolvedValue(undefined)

    await store.addFavorite(pokemon)
    await store.removeFavorite(pokemon.id)

    expect(store.favorites).not.toContainEqual(pokemon)
    expect(localForage.setItem).toHaveBeenCalledWith('pokemon_favorites', '[]')
  })

  it('should check if a pokemon is favorite', async () => {
    const store = useFavoritesStore()

    vi.spyOn(localForage, 'setItem').mockResolvedValue(undefined)

    await store.addFavorite(pokemon)

    expect(store.isFavorite(pokemon.id)).toBe(true)
    expect(store.isFavorite(2)).toBe(false)
  })

  it('should handle errors when saving favorites', async () => {
    const store = useFavoritesStore()

    vi.spyOn(localForage, 'setItem').mockRejectedValue(new Error('Save error'))
    vi.spyOn(console, 'error').mockImplementation(() => {})

    await store.addFavorite(pokemon)

    expect(console.error).toHaveBeenCalledWith('Error saving favorites:', expect.any(Error))
  })
})
