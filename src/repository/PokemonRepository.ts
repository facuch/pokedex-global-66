import mapPokemon from '@/helpers/mapPokemon'
import type PokemonRepository from '../interfaces/PokemonRepository'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 5000,
})

const PokemonRepository: PokemonRepository = {
  getAllPokemons: async () => {
    const response = await axiosInstance.get('/pokemon')
    const { data } = response
    return data.results
  },
  getPokemon: async (id: number) => {
    const response = await axiosInstance.get(`/pokemon/${id}`)
    const { data } = response
    return mapPokemon(data)
  },
}

export default PokemonRepository
