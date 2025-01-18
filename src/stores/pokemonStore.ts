import { defineStore } from 'pinia'
import { ref } from 'vue'
import type Paginate from '@/interfaces/Paginate'
import PokemonRepository from '@/repository/PokemonRepository'
import type SimplePokemon from '@/interfaces/SimplePokemon'
import type AllPokemonsResponse from '@/interfaces/AllPokemonsResponse'

export const usePokemonStore = defineStore('pokemon', () => {
  const pokemons = ref<SimplePokemon[]>([])
  const pagination = ref<Paginate | null>(null)
  const isLoading = ref(false)

  const fetchAllPokemons = async (offset: number = 0, limit: number = 20) => {
    isLoading.value = true
    try {
      const response: AllPokemonsResponse = await PokemonRepository.getAllPokemons(offset, limit)
      pokemons.value = response.results
      updatePagination(response, offset, limit)
    } catch (error) {
      console.error('Error fetching pokemons:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchMorePokemons = async (offset: number = 0, limit: number = 20) => {
    isLoading.value = true
    try {
      const response: AllPokemonsResponse = await PokemonRepository.getAllPokemons(offset, limit)
      pokemons.value = [...pokemons.value, ...response.results]
      updatePagination(response, offset, limit)
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
