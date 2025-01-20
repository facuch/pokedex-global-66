import { setActivePinia, createPinia } from 'pinia'
import { usePokemonCacheStore } from '../pokemonCacheStore'
import PokemonRepository from '@/repository/PokemonRepository'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import pokemonMock from '@/__mocks__/pokemon'

vi.mock('@/repository/PokemonRepository')

describe('pokemonCacheStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty cache', () => {
    const store = usePokemonCacheStore()
    expect(store.cache.size).toBe(0)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should add a pokemon to cache', () => {
    const store = usePokemonCacheStore()
    store.addToCache(pokemonMock)
    expect(store.cache.size).toBe(1)
    expect(store.cache.get(1)).toEqual(pokemonMock)
  })

  it('should get a pokemon from cache', () => {
    const store = usePokemonCacheStore()
    store.addToCache(pokemonMock)
    expect(store.getFromCache(1)).toEqual(pokemonMock)
  })

  it('should check if a pokemon is in cache', () => {
    const store = usePokemonCacheStore()
    store.addToCache(pokemonMock)
    expect(store.hasInCache(1)).toBe(true)
    expect(store.hasInCache(2)).toBe(false)
  })

  it('should fetch pokemon data from cache if available', async () => {
    const store = usePokemonCacheStore()
    store.addToCache(pokemonMock)
    const result = await store.fetchPokemonData(1)
    expect(result).toEqual(pokemonMock)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should fetch pokemon data from API if not in cache', async () => {
    const store = usePokemonCacheStore()
    vi.mocked(PokemonRepository.getPokemon).mockResolvedValue(pokemonMock)
    const result = await store.fetchPokemonData(1)
    expect(result).toEqual(pokemonMock)
    expect(store.cache.get(1)).toEqual(pokemonMock)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should handle errors when fetching pokemon data', async () => {
    const store = usePokemonCacheStore()
    vi.mocked(PokemonRepository.getPokemon).mockRejectedValue(new Error('API Error'))
    const result = await store.fetchPokemonData(1)
    expect(result).toBeNull()
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe('Failed to load Pokemon data')
  })
})
