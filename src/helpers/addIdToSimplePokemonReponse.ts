import type SimplePokemon from '@/interfaces/SimplePokemon'

const addIdToSimplePokemonResponse = (pokemons: SimplePokemon[]): SimplePokemon[] => {
  return pokemons.map((pokemon, index) => ({
    ...pokemon,
    id: Number(pokemon.url.split('/').slice(-2, -1)[0]),
  }))
}

export default addIdToSimplePokemonResponse
