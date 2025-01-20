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
</script>

<template>
  <div>
    <ul>
      <li v-for="pokemon in props.pokemons" :key="pokemon.id">
        {{ pokemon.name }} (ID: {{ pokemon.id }})
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
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
}
</style>
