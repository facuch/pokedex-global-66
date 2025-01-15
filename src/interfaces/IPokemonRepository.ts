import type Pokemon from './Pokemon'

export default interface IPokemonRepository {
  getAllPokemons(): Promise<Pokemon[]>
}
