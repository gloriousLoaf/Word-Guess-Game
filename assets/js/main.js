// User-facing variables to track
var wins = 0;
var losses = 0;
var guessesLeft = 7;
var playerGuess;
var guessesMade = [];
var selectWord = [];

// wordBank of computer choices
var wordBank = ["grapes", "orange", "peach", "mango", "apricot", "beans", "oats", "radish", "almonds", "pecans", "artichoke", "quinoa", "spinach", "kale", "grains", "corn", "peas"];

// No uppercase, numbers or symbols
var choices = "abcdefghijklmnopqrstuvwxyz";
var validChoices = choices.split("");

// Random word generator
var randomWord = wordBank[Math.floor(Math.random() * wordBank.length)];


/* Begin functions to call in Game Loop below: */

// Updates "Guesses left: " in html
function updateGuessesLeft() {
    document.getElementById("guesses-left").innerHTML = "Guesses Left: " + guessesLeft;
}

// Updates "Guesses Made: " in html
function updateGuessesMade() {
    document.getElementById("guesses-made").innerHTML = "Guesses Made: " + guessesMade.join(" ");
}

// Updates "The Word: " in html (selectWord[])
function updateSelectWord() {
    document.getElementById("select-word").innerHTML = "The Word:  " + selectWord.join(" ");
}

// Updates "Wins: " in html
function updateWins() {
    document.getElementById("wins").innerHTML = "Wins: " + wins;
}

// Updates "Losses: " in html
function updateLosses() {
    document.getElementById("losses").innerHTML = "Losses: " + losses;
}

// badGuyGoes starts at low opacity
function badGuyGoes() {
    document.getElementById("bad-guy").style.opacity = 0.3;
    document.getElementById("bad-guy-win").style.color = "white";
    document.getElementById("bad-guy-win").style.fontSize = "0.8em";
    document.getElementById("bad-guy-win").style.textAlign = "center";
}

// badGuyComes fades in the image for every wrong answer!
function badGuyComes() {
    var badGuy = document.getElementById("bad-guy");
    badGuy.style.opacity = parseFloat(badGuy.style.opacity) + 0.1;
}
// badyGuyWins pops up his villainous message
function badGuyWins() {
    document.getElementById("bad-guy-win").style.color = "darkred";
    document.getElementById("bad-guy-win").style.fontSize = "0.8em";
    document.getElementById("bad-guy-win").style.textAlign = "center";
}

/* New randomWord after win or loss, reset selectword[] ('The Word')
    first loop clears everything, so no letters from previous randomWord hangs around
    second loop, see notes in Game Loop */
function newRandomWord() {
    randomWord = wordBank[Math.floor(Math.random() * wordBank.length)];
    for (var i = 0; i < 20; i++) {
        selectWord[i] = " ";
    }
    updateSelectWord();
    for (var i = 0; i < randomWord.length; i++) {
        selectWord[i] = "_";
    }
    updateSelectWord();
}

// newGame() resets the board
var newGame = function () {
    newRandomWord();
    guessesLeft = 7;
    guessesMade = [];
    lettersLeft = randomWord.length;
    updateGuessesLeft();
    updateGuessesMade();
    badGuyGoes();
}

// If checkPlayerGuess() is correct, win or keep guessing? Timer delay on win so its not so jarring
var isGameWon = function () {
    if (lettersLeft == 0) {
        updateSelectWord();
        wins++;
        updateWins();
        setTimeout(function () {
            alert("That is the correct word! Play again?");
            newGame();
        }, 350);
    }
    else {
        updateSelectWord();
    }
}

// If checkPlayerGuess() is wrong, lose or keep guessing? Timer delay
var isGameLost = function () {
    if (guessesLeft <= 1) {
        losses++;
        updateLosses();
        badGuyComes();
        badGuyWins();
        setTimeout(function () {
            alert("Out of guesses, the word was '" + randomWord + "'. You lost. Play again?");
            newGame();
        }, 350);
    }
    else if (guessesLeft > 0) {
        guessesLeft--;;
        updateGuessesLeft();
        badGuyComes();
    }
}

/* End functions to call in Game Loop */


/* The Game Loop! */

badGuyGoes();

/*  selectWord[] dislays number of characters of 'The Word' in html, fills with correct guesses.
    This saved me! Tried but failed at high-level array sorting inside checkPlayerGuess() below.
    I found a similar solution in a JS for children lesson: https://nostarch.com/download/JS4K_ch7.pdf */
var selectWord = [];
for (var i = 0; i < randomWord.length; i++) {
    selectWord[i] = "_";
}

// This stores number of letters in randomWord, evaluated in isGameWon()
var lettersLeft = randomWord.length;

// shows the correct number of blanks for the first randomWord (The Word)
updateSelectWord();

document.onkeyup = function (event) {
    var playerGuess = event.key;

    // Verify that playerGuess is valid and not a duplicate, whether right or wrong
    var validate = validChoices.includes(playerGuess);
    var wrongDupe = guessesMade.includes(playerGuess);
    var rightDupe = selectWord.includes(playerGuess);
    if (validate == false) {
        alert("Lowercase only, no symbols or uppercase please.")
    }
    else if (wrongDupe == true) {
        alert("You played that letter already...");
    }
    else if (rightDupe == true) {
        alert("Yes, you already found that letter")
    }
    else if (validate == true && wrongDupe == false && rightDupe == false) {

        // Compares playerGuess against randomWord and sends it to isGameWon or isGameLost
        var checkPlayerGuess = function () {
            for (var i = 0; i < randomWord.length; i++) {
                if (playerGuess == randomWord.charAt(i)) {
                    selectWord[i] = playerGuess;
                    lettersLeft--;
                    console.log(true);
                    isGameWon();
                    break;
                }
            }
            if (playerGuess !== randomWord.charAt(i)) {
                console.log(false);
                guessesMade.push(playerGuess);
                updateGuessesMade();
                isGameLost();
            }
        }
        checkPlayerGuess();
    }
}