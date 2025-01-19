import { describe, it, expect, vi, beforeEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import PokemonRepository, { axiosInstance } from '../PokemonRepository'
import mapPokemon from '@/helpers/mapPokemon'
import type Pokemon from '@/interfaces/Pokemon'

vi.mock('@/helpers/mapPokemon')

describe('PokemonRepository', () => {
  let mock: MockAdapter
  const BASE_URL = 'https://pokeapi.co/api/v2'

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance)
    mock.reset()
  })

  describe('getAllPokemons', () => {
    it('should fetch all pokemons with default parameters', async () => {
      const mockResponse = {
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/', id: 1 },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/', id: 2 },
        ],
        count: 2,
        next: null,
        previous: null,
      }

      mock.onGet(`${BASE_URL}/pokemon`).reply(200, mockResponse)

      const result = await PokemonRepository.getAllPokemons()

      expect(result).toEqual(mockResponse)
      expect(mock.history.get[0].params).toEqual({ offset: 0, limit: 20 })
    })

    it('should fetch all pokemons with custom offset and limit', async () => {
      const mockResponse = {
        results: [{ name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/', id: 4 }],
        count: 1,
        next: null,
        previous: null,
      }

      mock.onGet(`${BASE_URL}/pokemon`).reply(200, mockResponse)

      const result = await PokemonRepository.getAllPokemons(3, 1)

      expect(result).toEqual(mockResponse)
      expect(mock.history.get[0].params).toEqual({ offset: 3, limit: 1 })
    })

    it('should handle API errors', async () => {
      mock.onGet(`${BASE_URL}/pokemon`).reply(500)

      try {
        await expect(PokemonRepository.getAllPokemons()).rejects.toThrow()
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
      }
    })
  })

  describe('getPokemon', () => {
    it('should fetch a single pokemon by id', async () => {
      const mockResponse = {
        id: 1,
        name: 'bulbasaur',
        types: [{ type: { name: 'grass' } }],
        height: 7,
        weight: 69,
        sprites: { front_default: 'https://example.com/bulbasaur.png' },
      }

      const mappedPokemon: Pokemon = {
        id: 1,
        name: 'Bulbasaur',
        type: 'grass',
        height: 7,
        weight: 69,
        image: 'https://example.com/bulbasaur.png',
      }

      mock.onGet(`${BASE_URL}/pokemon/1`).reply(200, mockResponse)

      vi.mocked(mapPokemon).mockReturnValue(mappedPokemon)

      const result = await PokemonRepository.getPokemon(1)

      expect(result).toEqual(mappedPokemon)

      expect(mapPokemon).toHaveBeenCalledWith(mockResponse)
    })

    it('should handle API errors when fetching a single pokemon', async () => {
      mock.onGet(`${BASE_URL}/pokemon/999`).reply(404)

      try {
        await expect(PokemonRepository.getPokemon(999)).rejects.toThrow()
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
      }
    })
  })
})
