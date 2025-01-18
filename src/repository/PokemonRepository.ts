import mapPokemon from '@/helpers/mapPokemon'
import type IPokemonRepository from '../interfaces/PokemonRepository'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 5000,
})

const PokemonRepository: IPokemonRepository = {
  getAllPokemons: async (offset: number = 0, limit: number = 20) => {
    const response = await axiosInstance.get('/pokemon')
    return response.data
  },
  getPokemon: async (id: number) => {
    const response = await axiosInstance.get(`/pokemon/${id}`)
    const { data } = response
    return mapPokemon(data)
  },
}

export default PokemonRepository
