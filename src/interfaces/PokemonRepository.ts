import type Pokemon from './Pokemon'
import type AllPokemonsResponse from './AllPokemonsResponse'

export default interface PokemonRepository {
  getAllPokemons(offset?: number, limit?: number): Promise<AllPokemonsResponse>
  getPokemon(id: number): Promise<Pokemon>
}
