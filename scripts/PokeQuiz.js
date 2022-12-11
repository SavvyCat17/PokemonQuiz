"use strict"

const createCache = () => {
    const pkCache = new PokeCache();
    const cacheClosure = () => pkCache;

    return cacheClosure;
}

const pkCache = createCache()();


class PokeQuiz {
    constructor() {
        this.pokemonData = [];
        this.usedPokemon = [];
        this.playerChoice = "";
        
        this.pokedexDict = {
            "I": [0, 151],
            "II": [151, 251],
            "III": [251, 386],
            "IV": [386, 493],
            "V": [493, 649],
            "VI": [649, 721],
            "VII": [721, 809],
            "VIII": [809, 905]
        };      
        
    }

    async populatePokemonData(gen) {
        this.clearPokemonData();
        if (!(pkCache.getGenKeys().includes(gen))) {
            
            const offset = this.pokedexDict[gen][0];
            const limit = this.pokedexDict[gen][1] - offset;

            const apiURL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

            pkCache.cache[gen] = [];

            let pokemon;
            
            try {
	            pokemon = await getPokeData(apiURL);
	            
	            for (const pk of pokemon.results) {
	
	                const pkObj = {
	                    "name": pk.name,
	                    "gen": gen,
	                    "url": pk.url,
	                    "type": [],
	                    "img": ""
	                };
	
	                this.pokemonData.push(pkObj);
	                pkCache.cache[gen].push(pkObj);
	                             
	            }
            } catch (error) {
                delete pkCache.cache[gen];
                throw error;
            }
        } else {
            this.pokemonData = pkCache.cache[gen].slice();
        }
    }

    randomArrayIndex(arr) {
        return Math.floor(Math.random() * arr.length);
    }

    async selectRandomPokemon() {
        if (this.pokemonData.length < 1) {
            this.pokemonData = this.usedPokemon.slice();
            this.usedPokemon = [];
        }
        
        let randPokemon = this.pokemonData.splice(this.randomArrayIndex(this.pokemonData), 1)[0];

        if (randPokemon.type.length < 1) {
            randPokemon = pkCache.getPokemon(randPokemon.gen, randPokemon.name);

            if (randPokemon.type.length < 1) {   
                let pkData;
                try {
	                pkData = await getPokeData(randPokemon.url);
	
	                randPokemon.type = pkData.types.map(ele => ele.type.name);
	                randPokemon.img = pkData.sprites.other["official-artwork"].front_default;
                } catch (error) {
                    throw error;
                }               
            }           
        }        

        this.usedPokemon.push(randPokemon);
    }

    getTypeOptions() {
        const pokemon = this.usedPokemon[this.usedPokemon.length - 1];
        const currPokeTypes = pokemon.type;
        const options = [];
        const types = Object.keys(pkTypeRelations);
        let maxDmg = { "name": "", "dmg": -1};
        
        for (let i = 0; i < 4; i++) {
            
            let typeObj = {};

            const tempTypes = types.slice();
            let randType;
            do {                
	            randType = tempTypes.splice(this.randomArrayIndex(tempTypes), 1)[0];
                typeObj = {
                    name: randType,
                    dmg: currPokeTypes.reduce((a, b) => a * pkTypeRelations[b][randType], 1)
                }

            } while (typeObj.dmg === maxDmg.dmg);

            types.splice(types.indexOf(randType), 1);

            if (typeObj.dmg > maxDmg.dmg) {
                maxDmg.name = typeObj.name;
                maxDmg.dmg = typeObj.dmg;
            }
            
            options.push(typeObj);
            
        }
        
        pokemon.quizOptions = {};
        pokemon.quizOptions.types = options;
        pokemon.quizOptions.max = maxDmg.name;
    }

    clearPokemonData() {
        this.pokemonData = [];
        this.usedPokemon = [];
    }
}