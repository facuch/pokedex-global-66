<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type Pokemon from '@/interfaces/Pokemon'
import ButtonComponent from '../Button/ButtonComponent.vue'
import Fav from '@/assets/active.png'
import Unfav from '@/assets/Disabled.png'
import { usePokemonCacheStore } from '@/stores/pokemonCacheStore'

const props = defineProps<{
  pokemonId: number | undefined
  isOpen: boolean
  isFavorite?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'toggleFavorite', id: number): void
}>()

const pokemonCacheStore = usePokemonCacheStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const pokemon = ref<Pokemon | null>(null)

const fetchPokemonData = async (id: number) => {
  isLoading.value = true
  error.value = null
  try {
    pokemon.value = await pokemonCacheStore.fetchPokemonData(id)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'An error occurred'
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && props.pokemonId) {
      fetchPokemonData(props.pokemonId)
    } else {
      pokemon.value = null
    }
  },
)

onMounted(() => {
  if (props.isOpen && props.pokemonId) {
    fetchPokemonData(props.pokemonId)
  }
})

const toggleFavorite = () => {
  if (pokemon.value) {
    emit('toggleFavorite', pokemon.value.id)
  }
}

const copyPokemonData = () => {
  if (pokemon.value) {
    const { name, height, weight, type } = pokemon.value
    const pokemonData = `${name},${height},${weight},${type}`
    navigator.clipboard
      .writeText(pokemonData)
      .then(() => {
        alert('Pokemon data copied to clipboard!')
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err)
      })
  }
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <img src="@/assets/Close.png" class="close-button" @click="emit('close')" alt="Close" />
      <div v-if="isLoading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else-if="pokemon" class="pokemon-content">
        <div class="image-container">
          <img src="@/assets/Background.png" alt="Background" class="background-image" />
          <img :src="pokemon.image" :alt="pokemon.name" class="pokemon-image" />
        </div>
        <div class="pokemon-info">
          <p class="pokemon-name">
            Name: <span>{{ pokemon.name }}</span>
          </p>
          <p class="pokemon-height">
            Height: <span>{{ pokemon.height }}</span>
          </p>
          <p class="pokemon-weight">
            Weight: <span>{{ pokemon.weight }}</span>
          </p>
          <p class="pokemon-type">
            Types: <span>{{ pokemon.type }}</span>
          </p>
          <div class="button-container">
            <ButtonComponent text="Share to my friends" :onClick="copyPokemonData" />
            <img
              :src="isFavorite ? Fav : Unfav"
              alt="Fav icon"
              @click="toggleFavorite"
              class="favorite-icon"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  position: relative;
  background-color: white;
  border-radius: 5px;
  max-width: 570;
  max-height: 80%;
  overflow-y: auto;
  padding-bottom: 10px;
  margin: 0px 10px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  z-index: 10;
}

.close-button:hover {
  opacity: 0.8;
}

.pokemon-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pokemon-info {
  width: 100%;
  margin: 0px 20px;
  align-self: flex-start;
}

.image-container {
  position: relative;
  width: 100%;
  margin-bottom: 5px;
}

.background-image {
  height: auto;
}

.pokemon-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 180px;
  width: 180px;
}

.favorite-indicator {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px 10px;
  border-radius: 15px;
  font-weight: bold;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin: 20px 30px 10px 0px;
}

p {
  text-transform: capitalize;
  margin: 5px 0;
  border-bottom: 1px solid var(--grey-background);
  font-weight: 700;
  color: var(--font-grey);
  padding-bottom: 5px;
}

p span {
  color: var(--font-grey);
  font-weight: 500;
}
</style>
