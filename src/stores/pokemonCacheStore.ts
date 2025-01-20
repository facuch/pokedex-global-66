import { defineStore } from 'pinia'
import { ref } from 'vue'
import type Pokemon from '@/interfaces/Pokemon'
import PokemonRepository from '@/repository/PokemonRepository'

export const usePokemonCacheStore = defineStore('pokemonCache', () => {
  const cache = ref(new Map<number, Pokemon>())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const addToCache = (pokemon: Pokemon) => {
    cache.value.set(pokemon.id, pokemon)
  }

  const getFromCache = (id: number): Pokemon | undefined => {
    return cache.value.get(id)
  }

  const hasInCache = (id: number): boolean => {
    return cache.value.has(id)
  }

  const fetchPokemonData = async (id: number): Promise<Pokemon | null> => {
    isLoading.value = true
    error.value = null
    try {
      if (hasInCache(id)) {
        return getFromCache(id) || null
      } else {
        const fetchedPokemon = await PokemonRepository.getPokemon(id)
        addToCache(fetchedPokemon)
        return fetchedPokemon
      }
    } catch (err) {
      error.value = 'Failed to load Pokemon data'
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    cache,
    isLoading,
    error,
    addToCache,
    getFromCache,
    hasInCache,
    fetchPokemonData,
  }
})
