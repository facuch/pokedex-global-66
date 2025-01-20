<script lang="ts" setup>
import type SimplePokemon from '@/interfaces/SimplePokemon'
import Fav from '@/assets/active.png'
import Unfav from '@/assets/Disabled.png'

interface PokemonList {
  toggleFavorite(pokemon: SimplePokemon): Promise<void>
  isFavorite(id: number | undefined): boolean
  pokemons: SimplePokemon[]
}

const props = defineProps<PokemonList>()

const emit = defineEmits<{
  (e: 'pokemonSelected', pokemon: SimplePokemon): void
}>()

const handlePokemonClick = (pokemon: SimplePokemon) => {
  console.log('opened')
  emit('pokemonSelected', pokemon)
}
</script>

<template>
  <div class="pokemon-list-container">
    <ul>
      <li v-for="pokemon in props.pokemons" :key="pokemon.id" @click="handlePokemonClick(pokemon)">
        {{ pokemon.name }}
        <button @click.stop="props.toggleFavorite(pokemon)">
          <img :src="props.isFavorite(pokemon.id) ? Fav : Unfav" alt="Fav icon" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.pokemon-list-container {
  width: 100%;
  max-width: 570px;
  margin: 0 auto;
  padding: 0 20px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--white);
  border-radius: 5px;
  padding: 10px;
  text-transform: capitalize;
  cursor: pointer;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

button img {
  width: 24px;
  height: 24px;
}
</style>
