import type Type from './Type'

export default interface RawPokemon {
  name: string
  id: number
  types: Type[]
  height: number
  weight: number
  sprites: {
    front_default: string
  }
}
