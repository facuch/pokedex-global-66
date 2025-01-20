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
  <div>
    <ul>
      <li v-for="pokemon in props.pokemons" :key="pokemon.id" @click="handlePokemonClick(pokemon)">
        {{ pokemon.name }}
        <button @click="props.toggleFavorite(pokemon)">
          <img :src="props.isFavorite(pokemon.id) ? Fav : Unfav" alt="Fav icon" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  background-color: red;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
}
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  background-color: var(--white);
  border-radius: 5px;
  width: 100%;
  padding-left: 10px;
  text-transform: capitalize;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
}
</style>
