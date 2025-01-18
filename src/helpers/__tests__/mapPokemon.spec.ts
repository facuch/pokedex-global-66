import { describe, it, expect } from 'vitest'
import mapPokemon from '../mapPokemon'
import { rawPokemonMock, rawPokemonMockMultipleTypes } from '@/__mocks__/rawPokemonMock'

const expectedMappedData = {
  id: 4,
  name: 'charmander',
  type: 'fire',
  height: 6,
  weight: 85,
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
}

describe('mapPokemon tests', () => {
  it('should map pokemons given correct data', () => {
    expect(mapPokemon(rawPokemonMock)).toEqual(expectedMappedData)
  })
  it('should concat multiple types', () => {
    expect(mapPokemon(rawPokemonMockMultipleTypes)).toEqual({
      ...expectedMappedData,
      type: 'fire, ground',
    })
  })
})
