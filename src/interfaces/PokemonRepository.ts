import type AllPokemonsResponse from './AllPokemonsResponse'
import type Pokemon from './Pokemon'

export default interface PokemonRepository {
  getAllPokemons(): Promise<AllPokemonsResponse[]>
  getPokemon(id: number): Promise<Pokemon>
}
