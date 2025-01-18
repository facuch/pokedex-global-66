const rawPokemonMock = {
  height: 6,
  id: 4,
  name: 'charmander',
  species: {
    name: 'charmander',
    url: 'https://pokeapi.co/api/v2/pokemon-species/4/',
  },
  sprites: {
    back_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png',
    back_female: null,
    back_shiny:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/4.png',
    back_shiny_female: null,
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    front_female: null,
    front_shiny:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/4.png',
    front_shiny_female: null,
  },
  types: [
    {
      slot: 1,
      type: {
        name: 'fire',
        url: 'https://pokeapi.co/api/v2/type/10/',
      },
    },
  ],
  weight: 85,
}

const rawPokemonMockMultipleTypes = {
  ...rawPokemonMock,
  types: [
    {
      slot: 1,
      type: {
        name: 'fire',
        url: 'https://pokeapi.co/api/v2/type/10/',
      },
    },
    {
      slot: 2,
      type: {
        name: 'ground',
        url: 'https://pokeapi.co/api/v2/type/5/',
      },
    },
  ],
}

export { rawPokemonMock, rawPokemonMockMultipleTypes }
