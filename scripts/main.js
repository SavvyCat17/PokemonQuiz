"use strict"

const createScores = () => {
    const scores = new Scores();
    const scoreClosure = () => scores;

    return scoreClosure;
}

const createQuiz = () => {
    const pkQuiz = new PokeQuiz();
    const quizClosure = () => pkQuiz;

    return quizClosure;
}

const scores = createScores()();
const pkQuiz = createQuiz()();

let genSelect;
let playBtn;
let retireBtn;
let loading;

let scoreboard;
let scoreTracker;
let playArea;
let playContents;

let quizTitle;
let pokeImg;
let pokeTyping;
let pokeName;

let typeOptionsDisplay;
let dmgMultipliers;
let submitBtn;
let nextBtn;

let currGenSel;
let currTypeSel;
let incorrectChoice;
let correctChoice;



const opactityMouseOverEvent = evt => evt.target.classList.add("selection");

const opactityMouseOutEvent = evt => evt.target.classList.remove("selection");

const typeMouseOver = evt => evt.target.style["background-color"] = typeColorsCSS[evt.target.innerHTML.toLowerCase()].hover;

const typeMouseOut = evt => evt.target.style["background-color"] = typeColorsCSS[evt.target.innerHTML.toLowerCase()].default;

const getGeneration = evt => {
    genSelect = document.querySelectorAll("td.row-body");
    playBtn = document.querySelector("#play");
    loading = document.querySelector("#loading");
    currGenSel = document.querySelector("td.choice");
    const genSelectionEle = evt.target;

    if (currGenSel) {
        currGenSel.classList.remove("choice");
    }
    genSelectionEle.classList.add("choice");

    genSelect.forEach(td => td.removeEventListener("click", getGeneration));

    loading.innerHTML = "Please wait. Loading...";

    playBtn.disabled = true;
    pkQuiz.populatePokemonData(genSelectionEle.innerHTML).then(response => {
        genSelect.forEach(td => td.addEventListener("click", getGeneration));
        genSelectionEle.removeEventListener("click", getGeneration);
        loading.innerHTML = "";
        playBtn.disabled = false;
    }).catch(err => {
        loading.innerHTML = err.message + " Try again.";
        genSelectionEle.classList.remove("choice");
        genSelect.forEach(td => td.addEventListener("click", getGeneration));
    });
}

const typeSelection = evt => {
    submitBtn = document.querySelector("#submit");
    currTypeSel = document.querySelector("#type-choices p#player-choice");

    if (currTypeSel) {
        currTypeSel.id = "";        
        currTypeSel.style["border-style"] = "solid";
        currTypeSel.style["background-color"] = typeColorsCSS[currTypeSel.innerHTML.toLowerCase()].default;
        addMultiEvents([currTypeSel], ...typeEvents);
    }
    evt.target.id = "player-choice";    
    evt.target.style["border-style"] = "dashed"
    pkQuiz.playerChoice = evt.target.innerHTML.toLowerCase();

    removeMultiEvents([evt.target], ...typeEvents);

    submitBtn.disabled = false;
}

const tableEvents = [["click", getGeneration], ["mouseover", opactityMouseOverEvent], ["mouseout", opactityMouseOutEvent]];
const typeEvents = [["click", typeSelection], ["mouseover", typeMouseOver], ["mouseout", typeMouseOut]];

const addMultiEvents = (eles, ...events) => events.forEach(evt => eles.forEach(ele => ele.addEventListener(evt[0], evt[1])));

const removeMultiEvents = (eles, ...events) => events.forEach(evt => eles.forEach(ele => ele.removeEventListener(evt[0], evt[1])));

const showCurrTypes = evt => {
    pokeTyping = document.querySelector("#poke-types");
    pokeTyping.style.opacity = "100%";
}

const hideCurrTypes = evt => {
    pokeTyping = document.querySelector("#poke-types");
    pokeTyping.style.opacity = "0";
}

const displayQuiz = () => {
    loading = document.querySelector("#loading");
    quizTitle = document.querySelector("figure h2");
    pokeImg = document.querySelector("figure img");
    pokeTyping = document.querySelector("#poke-types");
    pokeName = document.querySelector("figcaption");
    typeOptionsDisplay = document.querySelectorAll("#type-choices p");
    submitBtn = document.querySelector("#submit");
    nextBtn = document.querySelector("#next");
    currGenSel = document.querySelector("td.choice");

    let pokemon;
    let typeOptions;

    loading.innerHTML =""; 
    pkQuiz.selectRandomPokemon().then(response => {
        pokemon = pkQuiz.usedPokemon[pkQuiz.usedPokemon.length - 1];

        quizTitle.innerHTML = `Gen ${currGenSel.innerHTML} Pokemon`;
        pokeImg.src = pokemon.img;
        pokeImg.alt = pokemon.name;
        pokeName.innerHTML = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

        pkQuiz.getTypeOptions();
        typeOptions = pokemon.quizOptions.types;

        pokeTyping.innerHTML = "";
        for (const type of pokemon.type) {
            pokeTyping.innerHTML += `<p style="background-color: ${typeColorsCSS[type].default}" >${type.toUpperCase()}</p>`;
        }
        
        for (let i = 0; i < typeOptions.length; i++) {
            const typeName = typeOptions[i].name;
            typeOptionsDisplay[i].innerHTML = typeName.toUpperCase();
            typeOptionsDisplay[i].style["background-color"] = typeColorsCSS[typeName].default;
            typeOptionsDisplay[i].style.color = typeColorsCSS[typeName].selected;
        }

        addMultiEvents(typeOptionsDisplay, ...typeEvents);

        submitBtn.disabled = true;
        nextBtn.disabled = true;

    }).catch(err => {
        playContents.style.opacity = "0";
        loading.innerHTML = err.message + " Game Lost. Try Again.";
        clearQuizResults();
        resetGame();
    }) ;
    
}

const startPokeQuiz = evt => {
    genSelect = document.querySelectorAll("td.row-body");
    retireBtn = document.querySelector("#retire");
    scoreboard = document.querySelector("#left");
    scoreTracker = document.querySelector("#right");
    playArea = document.querySelector("#game");
    playContents = document.querySelector("#contents");

    evt.target.disabled = true;
    retireBtn.disabled = false;

    removeMultiEvents(genSelect, ...tableEvents);

    playContents.style.opacity = "0";
    displayQuiz();
    playContents.style.opacity = "100%";

    playArea.classList.remove("hidden");
    scoreboard.classList.remove("hidden");
    scoreTracker.classList.remove("hidden");
}

const clearQuizResults = () => {
    dmgMultipliers = document.querySelectorAll("#type-choices span");
    incorrectChoice = document.querySelector("#type-choices p.incorrect");
    correctChoice = document.querySelector("#type-choices p.correct");
    currTypeSel = document.querySelector("#type-choices p#player-choice");

    if (incorrectChoice) {
        incorrectChoice.classList.remove("incorrect");
    }

    if (correctChoice) {
        correctChoice.classList.remove("correct");
    }

    if (currTypeSel) {
        currTypeSel.style["border-style"] = "solid";
    }

    dmgMultipliers.forEach(lbl => lbl.innerHTML = "");
}

const resetGame = () => {
    genSelect = document.querySelectorAll("td.row-body");
    playBtn = document.querySelector("#play");
    retireBtn = document.querySelector("#retire");
    scoreTracker = document.querySelector("#right");
    playArea = document.querySelector("#game");
    pokeImg = document.querySelector("figure img");

    scores.newGame();

    pokeImg.src = "";
    scoreTracker.classList.add("hidden");
    playArea.classList.add("hidden");
    retireBtn.disabled = true;
    playBtn.disabled = false;

    addMultiEvents(genSelect, ...tableEvents);
}

const retireQuiz = evt => {
    const userResponse = confirm("This will end the game with your current score.\nWould you like to continue?");

    if (userResponse) {
        clearQuizResults();
        resetGame();
    }
}

const playerSubmit = evt => {
    typeOptionsDisplay = document.querySelectorAll("#type-choices p");
    dmgMultipliers = document.querySelectorAll("#type-choices span");
    nextBtn = document.querySelector("#next");
    currTypeSel = document.querySelector("#type-choices p#player-choice");

    const pokemon = pkQuiz.usedPokemon[pkQuiz.usedPokemon.length - 1];
    const typeOptions = pokemon.quizOptions.types;

    evt.target.disabled = true;
    removeMultiEvents(typeOptionsDisplay, ...typeEvents);

    currTypeSel.style["border-style"] = "solid";

    if (pokemon.quizOptions.max === pkQuiz.playerChoice) {
        currTypeSel.classList.add("correct");
        scores.addToScore();
    } else {
        currTypeSel.classList.add("incorrect");
        scores.addToStrikes();

        for (let i = 0; i < typeOptionsDisplay.length; i++) {
            if (pokemon.quizOptions.max === typeOptionsDisplay[i].innerHTML.toLowerCase()) {
                typeOptionsDisplay[i].classList.add("correct");
                break;
            }
        }
    }

    for (let i = 0; i < dmgMultipliers.length; i++) {
        dmgMultipliers[i].innerHTML = `x${typeOptions[i].dmg}`
    }

    nextBtn.disabled = false;

}

const advanceGameState = evt => {
    submitBtn = document.querySelector("#submit");

    evt.target.disabled = true;
    submitBtn.diabled = true;
    
    clearQuizResults();

    if (scores.strikes < 3) {
        playContents.style.opacity = "0";
        displayQuiz();
        playContents.style.opacity = "100%";
    } else {
        alert("You've reached 3 strikes. Game Over.");
        resetGame();        
    }
}

window.addEventListener("load", evt => {
    genSelect = document.querySelectorAll("td.row-body");
    playBtn = document.querySelector("#play");
    retireBtn = document.querySelector("#retire");
    scoreboard = document.querySelector("#left");
    scoreTracker = document.querySelector("#right");
    playArea = document.querySelector("#game");
    pokeImg = document.querySelector("figure img");
    submitBtn = document.querySelector("#submit");
    nextBtn = document.querySelector("#next");

    playBtn.disabled = true;
    retireBtn.disabled = true;

    scoreTracker.classList.add("hidden");
    playArea.classList.add("hidden");
    scoreboard.classList.add("hidden");
    
    addMultiEvents(genSelect, ...tableEvents);

    pokeImg.addEventListener("mouseover", showCurrTypes);
    pokeImg.addEventListener("mouseout", hideCurrTypes);

    playBtn.addEventListener("click", startPokeQuiz);
    retireBtn.addEventListener("click", retireQuiz);
    submitBtn.addEventListener("click", playerSubmit);
    nextBtn.addEventListener("click", advanceGameState);
});