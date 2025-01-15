import type Pokemon from '@/interfaces/Pokemon'
import type IRawPokemon from '@/interfaces/IRawPokemon'

const mapPokemon = (rawPokemon: IRawPokemon[]): Pokemon[] => {
  return rawPokemon.map((pokemon) => {
    return {
      id: pokemon.id,
      name: pokemon.name,
      type: pokemon.type,
      height: pokemon.height,
      weight: pokemon.weight,
      image: pokemon.sprites.front_default,
    }
  })
}

export default mapPokemon
