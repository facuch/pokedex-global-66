import mapPokemon from '@/helpers/mapPokemon'
import type IPokemonRepository from '../interfaces/IPokemonRepository'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 5000,
})

const PokemonRepository: IPokemonRepository = {
  getAllPokemons: async () => {
    const response = await axiosInstance.get('/pokemon')
    const { data } = response
    return mapPokemon(data.results)
  },
}

export default PokemonRepository
