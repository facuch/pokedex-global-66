import mapPokemon from '@/helpers/mapPokemon'
import type IPokemonRepository from '../interfaces/PokemonRepository'
import axios from 'axios'
import addIdToSimplePokemonResponse from '@/helpers/addIdToSimplePokemonReponse'

export const axiosInstance = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 5000,
})

const PokemonRepository: IPokemonRepository = {
  getAllPokemons: async (offset = 0, limit = 20) => {
    const response = await axiosInstance.get(`/pokemon`, {
      params: { offset, limit },
    })
    response.data.results = addIdToSimplePokemonResponse(response.data.results)
    return response.data
  },
  getPokemon: async (id: number) => {
    const response = await axiosInstance.get(`/pokemon/${id}`)
    const { data } = response
    return mapPokemon(data)
  },
}

export default PokemonRepository
