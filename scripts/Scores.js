"use strict"

class Scores {
    constructor() {
        this.scores = [];
        this.currentScore = 0;
        this.strikes = 0;
    }

    addScore(score, date) {
        this.scores.push({"score": score, "date": date});
        this.sortScores();
        this.updateScoreboard();
    }

    sortScores() {
        this.scores = this.scores.sort((a,b) => b.score - a.score).slice(0, 10);
    }

    newGame() {
        this.addScore(this.currentScore, new Date().toLocaleString());
        this.currentScore = 0;
        this.strikes = 0;
        document.querySelectorAll(".strike").forEach(x => x.style.opacity = "10%");
        this.updateScoreTracker();
    }

    addToScore() {
        this.currentScore++;
        this.updateScoreTracker();
    }

    addToStrikes() {
        this.strikes++;
        this.updateScoreTracker();
    }

    updateScoreTracker() {
        const liveScore = document.querySelector("#curr-score");
        const liveStrikes = document.querySelectorAll(".strike");
        
        liveScore.innerHTML = this.currentScore;

        if (this.strikes > 0) {
            liveStrikes[this.strikes - 1].style.opacity = "100%";
        }        

    }

    updateScoreboard() {
        const highScores = document.querySelector("#high-scores");
        highScores.innerHTML = "";

        for (const scr of this.scores) {
            highScores.innerHTML += `<li>${scr.score} <span class="datetime">${scr.date}</span></li>`;
        }

    }
}