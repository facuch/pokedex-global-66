<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { usePokemonStore } from '@/stores/pokemonStore'
import { useFavoritesStore } from '@/stores/favoritesStore'

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

const toggleFavorite = async (pokemon) => {
  if (favoritesStore.isFavorite(pokemon.id)) {
    await favoritesStore.removeFavorite(pokemon.id)
  } else {
    await favoritesStore.addFavorite({ id: pokemon.id, name: pokemon.name })
  }
}

onMounted(async () => {
  if (pokemonStore.pokemons.length === 0) {
    await pokemonStore.fetchAllPokemons(0, LIMIT)
  }
})
</script>

<template>
  <div>
    <h1>Pokémon List</h1>
    <ul>
      <li v-for="pokemon in pokemonStore.pokemons" :key="pokemon.id">
        {{ pokemon.name }} (ID: {{ pokemon.id }})
        <button @click="toggleFavorite(pokemon)">
          {{ favoritesStore.isFavorite(pokemon.id) ? '❤️' : '🤍' }}
        </button>
      </li>
    </ul>
    <div class="load-more">
      <button @click="loadMore" :disabled="pokemonStore.isLoading || !canLoadMore">
        {{ pokemonStore.isLoading ? 'Loading...' : 'Load More' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.load-more {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
}
</style>
