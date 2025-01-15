export default interface IRawPokemon {
  name: string
  id: number
  type: string[]
  height: number
  weight: number
  sprites: {
    front_default: string
  }
}
