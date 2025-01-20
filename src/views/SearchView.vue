<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { usePokemonStore } from '@/stores/pokemonStore'
import { useFavoritesStore } from '@/stores/favoritesStore'
import type SimplePokemon from '@/interfaces/SimplePokemon'
import PokemonList from '@/components/PokemonList/PokemonList.vue'

const pokemonStore = usePokemonStore()
const favoritesStore = useFavoritesStore()
const LIMIT = 20

const canLoadMore = computed(() => {
  return pokemonStore.pagination?.next !== null
})

const loadMore = async () => {
  if (canLoadMore.value) {
    const nextOffset = pokemonStore.pokemons.length
    await pokemonStore.fetchMorePokemons(nextOffset, LIMIT)
  }
}

const toggleFavorite = async (pokemon: SimplePokemon) => {
  if (favoritesStore.isFavorite(pokemon.id)) {
    await favoritesStore.removeFavorite(pokemon.id)
  } else {
    await favoritesStore.addFavorite({ id: pokemon.id, name: pokemon.name, url: pokemon.url })
  }
}

onMounted(async () => {
  if (pokemonStore.pokemons.length === 0) {
    await pokemonStore.fetchAllPokemons(0, LIMIT)
  }
})
</script>

<template>
  <div class="search-view">
    <PokemonList
      :pokemons="pokemonStore.pokemons"
      :toggleFavorite="toggleFavorite"
      :isFavorite="favoritesStore.isFavorite"
    />
    <div class="load-more">
      <button @click="loadMore" :disabled="pokemonStore.isLoading || !canLoadMore">
        {{ pokemonStore.isLoading ? 'Loading...' : 'Load More' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-view {
  width: 100%;
  max-width: 570px;
  display: flex;
  justify-content: center;
  align-items: 'center';
  flex-direction: column;
}
.load-more {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
}
</style>
