class PokemonAPI {
    static convertDetailToPokemon(pokeDetail) {
      const { id, name, types, sprites, height, weight, moves } = pokeDetail;
      const pokemon = {
        number: id,
        name,
        types: types.map((typeSlot) => typeSlot.type.name),
        type: types[0]?.type.name || "Unknown",
        photo: sprites.other.dream_world.front_default,
        height: height,
        weight: weight,
        moves: moves.map((move) => move.move.name),
      };
      return pokemon;
    }
  
    static async getPokemonDetail(pokemon) {
      try {
        const response = await fetch(pokemon.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch Pokemon details for ${pokemon.name}`);
        }
  
        const pokeDetail = await response.json();
        return PokemonAPI.convertDetailToPokemon(pokeDetail);
      } catch (error) {
        console.error(error.message);
        throw error;
      }
    }
  
    async getPokemons(offset = 0, limit = 5) {
      try {
        const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error(`Failed to fetch Pokemon list`);
        }
  
        const jsonBody = await response.json();
        const pokemons = jsonBody.results;
  
        const detailRequests = pokemons.map(PokemonAPI.getPokemonDetail);
        const pokemonsDetails = await Promise.all(detailRequests);
  
        return pokemonsDetails;
      } catch (error) {
        console.error(error.message);
        throw error;
      }
    }
  }
  