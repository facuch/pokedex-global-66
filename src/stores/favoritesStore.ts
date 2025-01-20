import { defineStore } from 'pinia'
import { ref } from 'vue'
import localForage from 'localforage'
import type SimplePokemon from '@/interfaces/SimplePokemon'

const FAVORITES_KEY = 'pokemon_favorites'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<SimplePokemon[]>([])

  const loadFavorites = async () => {
    try {
      const storedFavorites = await localForage.getItem<string>(FAVORITES_KEY)
      if (storedFavorites) {
        favorites.value = JSON.parse(storedFavorites)
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }

  const saveFavorites = async () => {
    try {
      const favoritesJson = JSON.stringify(favorites.value)
      await localForage.setItem(FAVORITES_KEY, favoritesJson)
    } catch (error) {
      console.error('Error saving favorites:', error)
    }
  }

  const addFavorite = async (pokemon: SimplePokemon) => {
    if (!favorites.value.some((fav) => fav.id === pokemon.id)) {
      favorites.value.push({ id: pokemon.id, name: pokemon.name, url: pokemon.url })
      await saveFavorites()
    }
  }

  const removeFavorite = async (pokemonId: number | undefined) => {
    if (!pokemonId) return
    favorites.value = favorites.value.filter((fav) => fav.id !== pokemonId)
    await saveFavorites()
  }

  const isFavorite = (pokemonId: number | undefined): boolean => {
    if (pokemonId === undefined) return false
    return favorites.value.some((fav) => fav.id === pokemonId)
  }

  loadFavorites()

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  }
})
