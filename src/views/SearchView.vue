<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { usePokemonStore } from '@/stores/pokemonStore'
import { useFavoritesStore } from '@/stores/favoritesStore'
import type SimplePokemon from '@/interfaces/SimplePokemon'
import PokemonList from '@/components/PokemonList/PokemonList.vue'
import TabBar from '@/components/TabBar/TabBar.vue'
import SearchBar from '@/components/SearchBar/SearchBar.vue'
import ButtonComponent from '@/components/Button/ButtonComponent.vue'
import PokemonModal from '@/components/PokemonModal/PokemonModal.vue'

const pokemonStore = usePokemonStore()
const favoritesStore = useFavoritesStore()
const LIMIT = 20

const activeTab = ref<'all' | 'favorites'>('all')
const searchQuery = ref('')
const fakeLoader = ref(true)
const selectedPokemonId = ref<number | undefined>(undefined)
const isModalOpen = ref(false)

const displayedPokemons = computed(() => {
  const pokemons = activeTab.value === 'all' ? pokemonStore.pokemons : favoritesStore.favorites
  if (searchQuery.value) {
    return pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }
  return pokemons
})

const canLoadMore = computed(() => {
  return pokemonStore.pagination?.next !== null
})

const noResults = computed(() => {
  return searchQuery.value !== '' && displayedPokemons.value.length === 0
})

setTimeout(() => {
  fakeLoader.value = false
}, 1500)

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

const handleSearch = (query: string) => {
  searchQuery.value = query
}

const handleCleanSearch = () => {
  searchQuery.value = ''
  activeTab.value = 'all'
}

const openModal = (pokemon: SimplePokemon) => {
  selectedPokemonId.value = pokemon.id
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedPokemonId.value = undefined
}

const toggleFavoriteInModal = (id: number) => {
  if (favoritesStore.isFavorite(id)) {
    favoritesStore.removeFavorite(id)
  } else {
    const pokemon = pokemonStore.pokemons.find((p) => p.id === id)
    if (pokemon) {
      favoritesStore.addFavorite(pokemon)
    }
  }
}

onMounted(async () => {
  if (pokemonStore.pokemons.length === 0) {
    await pokemonStore.fetchAllPokemons(0, LIMIT)
  }
})
</script>

<template>
  <div v-if="pokemonStore.isLoading || fakeLoader" class="spinner-div">
    <img src="@/assets/Loader.png" alt="Loading" class="spinner" />
  </div>
  <div v-else class="search-view">
    <SearchBar @search="handleSearch" v-model:value="searchQuery" />
    <div v-if="noResults" class="no-results">
      <span class="title">Uh-oh!</span>
      <span class="subtitle">You look lost on your journey!</span>
      <ButtonComponent :text="'Go to Home'" @click="handleCleanSearch" />
    </div>
    <PokemonList
      v-else
      :pokemons="displayedPokemons"
      :toggleFavorite="toggleFavorite"
      :isFavorite="favoritesStore.isFavorite"
      @pokemon-selected="openModal"
    />
    <div v-if="activeTab === 'all' && !noResults" class="load-more">
      <ButtonComponent
        @click="loadMore"
        :text="pokemonStore.isLoading ? 'Loading...' : 'Load More'"
        :disabled="pokemonStore.isLoading || !canLoadMore"
      />
    </div>
    <TabBar @tab-change="handleTabChange" />
    <PokemonModal
      :pokemon-id="selectedPokemonId"
      :is-open="isModalOpen"
      @close="closeModal"
      :is-favorite="favoritesStore.isFavorite(selectedPokemonId)"
      @toggle-favorite="toggleFavoriteInModal"
    />
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

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 36px;
  font-weight: 700;
  line-height: 43.2px;
  text-align: center;
  text-decoration-skip-ink: none;
  margin-bottom: 10px;
}
.subtitle {
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
  text-align: center;
  margin-bottom: 10px;
  color: var(--font-grey);
}

.spinner-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.spinner {
  animation: rotation 2s infinite linear;
}
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
