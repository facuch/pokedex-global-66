import { setActivePinia, createPinia } from 'pinia'
import { usePokemonStore } from '../pokemonStore'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import PokemonRepository from '@/repository/PokemonRepository'
import localForage from 'localforage'
import type AllPokemonsResponse from '@/interfaces/AllPokemonsResponse'

vi.mock('@/repository/PokemonRepository')
vi.mock('localforage')

describe('pokemonStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with empty pokemons array', () => {
    const store = usePokemonStore()
    expect(store.pokemons).toEqual([])
  })

  it('should fetch pokemons from API when cache is empty', async () => {
    const store = usePokemonStore()
    const mockResponse: AllPokemonsResponse = {
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
      count: 1,
      next: null,
      previous: null,
      limit: 20,
      offset: 0,
    }

    vi.spyOn(localForage, 'getItem').mockResolvedValue(null)
    vi.spyOn(PokemonRepository, 'getAllPokemons').mockResolvedValue(mockResponse)

    await store.fetchAllPokemons()

    expect(PokemonRepository.getAllPokemons).toHaveBeenCalledWith(0, 20)
    expect(store.pokemons).toEqual(mockResponse.results)
    expect(localForage.setItem).toHaveBeenCalled()
  })

  it('should load pokemons from cache when available', async () => {
    const store = usePokemonStore()
    const cachedData = {
      data: [{ name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' }],
      timestamp: Date.now(),
    }

    vi.spyOn(localForage, 'getItem').mockResolvedValue(cachedData)

    await store.fetchAllPokemons()

    expect(PokemonRepository.getAllPokemons).not.toHaveBeenCalled()
    expect(store.pokemons).toEqual(cachedData.data)
  })

  it('should fetch more pokemons', async () => {
    const store = usePokemonStore()
    const initialPokemons = [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }]
    store.pokemons = initialPokemons

    const mockResponse: AllPokemonsResponse = {
      results: [{ name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' }],
      count: 2,
      next: null,
      previous: null,
      limit: 1,
      offset: 1,
    }

    vi.spyOn(localForage, 'getItem').mockResolvedValue(null)
    vi.spyOn(PokemonRepository, 'getAllPokemons').mockResolvedValue(mockResponse)

    await store.fetchMorePokemons(1, 1)

    expect(PokemonRepository.getAllPokemons).toHaveBeenCalledWith(1, 1)
    expect(store.pokemons).toEqual([...initialPokemons, ...mockResponse.results])
  })

  it('should update pagination correctly', async () => {
    const store = usePokemonStore()
    const mockResponse: AllPokemonsResponse = {
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
      count: 1,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
      previous: null,
      limit: 20,
      offset: 0,
    }

    vi.spyOn(localForage, 'getItem').mockResolvedValue(null)
    vi.spyOn(PokemonRepository, 'getAllPokemons').mockResolvedValue(mockResponse)

    await store.fetchAllPokemons()

    expect(store.pagination).toEqual({
      count: 1,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
      previous: null,
      limit: 20,
      offset: 0,
    })
  })

  it('should handle errors when fetching pokemons', async () => {
    const store = usePokemonStore()
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    vi.spyOn(localForage, 'getItem').mockResolvedValue(null)
    vi.spyOn(PokemonRepository, 'getAllPokemons').mockRejectedValue(new Error('API Error'))

    await store.fetchAllPokemons()

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching pokemons:', expect.any(Error))
    expect(store.pokemons).toEqual([])
    expect(store.isLoading).toBe(false)

    consoleErrorSpy.mockRestore()
  })
})
