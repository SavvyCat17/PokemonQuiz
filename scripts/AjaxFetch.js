"use strict"

const getPokeData = async url => {    
    try {
        /* if (Math.random() > 0.5) {
            throw new Error("Fetch Error");
        } */
        
        let response = await fetch(url);

        if (response.status != 200) {
            throw new Error("Fetch Error.");
        }

	    return await response.json();

    } catch (error) {
        throw error;
    }
}