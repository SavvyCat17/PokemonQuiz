"use strict"

class PokeCache {
    constructor() {
        this.cache = {};
    }

    getPokemon(gen, name) {
        
        for (const pk of this.cache[gen]) {
            if (pk.name === name) {
                return pk;
            }
        }
    }

    getGenKeys() {
        return Object.keys(this.cache);
    }
}