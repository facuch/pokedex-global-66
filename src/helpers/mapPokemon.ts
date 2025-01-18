import type Pokemon from '@/interfaces/Pokemon'
import type RawPokemon from '@/interfaces/RawPokemon'
import type Type from '@/interfaces/Type'

const typeMapper = (types: Type[]): string => {
  if (types.length === 1) {
    return types[0].type.name
  }
  return types.map((type) => type.type.name).join(', ')
}

const mapPokemon = (rawPokemon: RawPokemon): Pokemon => {
  return {
    id: rawPokemon.id,
    name: rawPokemon.name,
    type: typeMapper(rawPokemon.types),
    height: rawPokemon.height,
    weight: rawPokemon.weight,
    image: rawPokemon.sprites.front_default,
  }
}

export default mapPokemon
