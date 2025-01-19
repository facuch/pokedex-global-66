import { describe, expect, it } from 'vitest'
import addIdToSimplePokemonResponse from '../addIdToSimplePokemonReponse'

describe('addIdToSimplePokemonResponse', () => {
  it('should add id field to the repository response', () => {
    const mockedResponse = [{ name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' }]

    expect(addIdToSimplePokemonResponse(mockedResponse)).toEqual([
      { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/', id: 4 },
    ])
  })
})
