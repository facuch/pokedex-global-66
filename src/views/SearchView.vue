<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { usePokemonStore } from '@/stores/pokemonStore'
import { useFavoritesStore } from '@/stores/favoritesStore'
import type SimplePokemon from '@/interfaces/SimplePokemon'
import PokemonList from '@/components/PokemonList/PokemonList.vue'
import TabBar from '@/components/TabBar/TabBar.vue'

const pokemonStore = usePokemonStore()
const favoritesStore = useFavoritesStore()
const LIMIT = 20

const activeTab = ref<'all' | 'favorites'>('all')

const displayedPokemons = computed(() => {
  return activeTab.value === 'all' ? pokemonStore.pokemons : favoritesStore.favorites
})

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

const handleTabChange = (tab: 'all' | 'favorites') => {
  activeTab.value = tab
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
      :pokemons="displayedPokemons"
      :toggleFavorite="toggleFavorite"
      :isFavorite="favoritesStore.isFavorite"
    />
    <div v-if="activeTab === 'all'" class="load-more">
      <button @click="loadMore" :disabled="pokemonStore.isLoading || !canLoadMore">
        {{ pokemonStore.isLoading ? 'Loading...' : 'Load More' }}
      </button>
    </div>
    <TabBar @tab-change="handleTabChange" />
  </div>
</template>

<style scoped>
.search-view {
  width: 100%;
  max-width: 570px;
  display: flex;
  flex-direction: column;
  padding-bottom: 60px;
  min-height: 100vh;
}
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
