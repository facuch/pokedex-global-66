<template>
  <div>
    <h1>Pokémon List</h1>
    <ul>
      <li v-for="pokemon in pokemonStore.pokemons" :key="pokemon.id">
        {{ pokemon.name }}
      </li>
    </ul>
    <div class="load-more">
      <button @click="loadMore" :disabled="pokemonStore.isLoading || !canLoadMore">
        {{ pokemonStore.isLoading ? 'Loading...' : 'Load More' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'

const pokemonStore = usePokemonStore()
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

onMounted(() => {
  if (pokemonStore.pokemons.length === 0) {
    pokemonStore.fetchAllPokemons(0, LIMIT)
  }
})
</script>

<style scoped>
.load-more {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
