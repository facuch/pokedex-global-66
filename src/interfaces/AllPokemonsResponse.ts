import type Paginate from './Paginate'
import type SimplePokemon from './SimplePokemon'

export default interface AllPokemonsResponse extends Paginate {
  results: SimplePokemon[]
}
