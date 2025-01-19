import { defineStore } from 'pinia'
import { ref } from 'vue'
import localForage from 'localforage'
import type Paginate from '@/interfaces/Paginate'
import PokemonRepository from '@/repository/PokemonRepository'
import type SimplePokemon from '@/interfaces/SimplePokemon'
import type AllPokemonsResponse from '@/interfaces/AllPokemonsResponse'

localForage.config({
  name: 'PokemonApp',
  storeName: 'pokemon_cache',
})

export const usePokemonStore = defineStore('pokemon', () => {
  const pokemons = ref<SimplePokemon[]>([])
  const pagination = ref<Paginate | null>(null)
  const isLoading = ref(false)

  const CACHE_EXPIRATION_TIME = 1000 * 60 * 60 // 1 hora

  const savePokemonsToCache = async (offset: number, limit: number, data: SimplePokemon[]) => {
    const cacheKey = `pokemons_${offset}_${limit}`
    await localForage.setItem(cacheKey, {
      data,
      timestamp: Date.now(),
    })
  }

  const loadPokemonsFromCache = async (
    offset: number,
    limit: number,
  ): Promise<SimplePokemon[] | null> => {
    const cacheKey = `pokemons_${offset}_${limit}`
    const cachedData = (await localForage.getItem(cacheKey)) as {
      data: SimplePokemon[]
      timestamp: number
    } | null

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION_TIME) {
      return cachedData.data
    }
    return null
  }

  const fetchAllPokemons = async (offset: number = 0, limit: number = 20) => {
    const cachedData = await loadPokemonsFromCache(offset, limit)
    if (cachedData) {
      pokemons.value = cachedData
      return
    }

    isLoading.value = true
    try {
      const response: AllPokemonsResponse = await PokemonRepository.getAllPokemons(offset, limit)
      pokemons.value = response.results
      updatePagination(response, offset, limit)
      await savePokemonsToCache(offset, limit, response.results)
    } catch (error) {
      console.error('Error fetching pokemons:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchMorePokemons = async (offset: number = 0, limit: number = 20) => {
    isLoading.value = true
    try {
      const cachedData = await loadPokemonsFromCache(offset, limit)
      let newPokemons: SimplePokemon[]
      let response: AllPokemonsResponse | null = null

      if (cachedData) {
        newPokemons = cachedData
      } else {
        response = await PokemonRepository.getAllPokemons(offset, limit)
        newPokemons = response.results
        await savePokemonsToCache(offset, limit, newPokemons)
      }

      pokemons.value = [...pokemons.value, ...newPokemons]

      if (response) {
        updatePagination(response, offset, limit)
      } else if (pagination.value) {
        pagination.value = {
          ...pagination.value,
          offset: offset,
          limit: limit,
        }
      }
    } catch (error) {
      console.error('Error fetching more pokemons:', error)
    } finally {
      isLoading.value = false
    }
  }

  const updatePagination = (response: AllPokemonsResponse, offset: number, limit: number) => {
    pagination.value = {
      count: response.count,
      next: response.next,
      previous: response.previous,
      limit,
      offset,
    }
  }

  return {
    pokemons,
    pagination,
    isLoading,
    fetchAllPokemons,
    fetchMorePokemons,
  }
})
