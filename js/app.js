/*
 * Create a list that holds all of your cards
 */

const openCards = [];
let previousSelection = "";
let currentSelection = "";
let moveCounter = 0;
init();

function addEventListenersToGame() {
    const cards = document.getElementsByClassName('card');
    for (const card of cards) {
        // add click event to card
        card.addEventListener('click', showCard, false);
    }  
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


/**
 * Added logic to load card on page
 */
function loadCardsOnPage(faList) {
    const cardList = createCardList(faList);
    const shuffledCardList = cardList; //shuffle(cardList);
    const deck = document.querySelector('.deck');
    for (const card of shuffledCardList) {
        deck.insertAdjacentHTML('beforeend', card);
    }
}

function createCardList(faList) {
    return faList.map(faName => {
        return `<li class="card"><i class="fa ${faName}"></i></li>`;
    });
 }

 // restart game
 const restartIcon = document.querySelector('.restart');
 restartIcon.addEventListener('click', init);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function showCard(e) {
    this.classList.add('show', 'open');
    if (previousSelection == "") {
        previousSelection = this;
        // remove click event from card once it's been selected
        this.removeEventListener('click', () => console.log(`click event removed from ${this}`));
    } else {
        currentSelection = this;
        // check if selections match
        const isMatch = matchSelectedCardToPreviousCard()
        if (isMatch) {
            // 1. add match class to card
            previousSelection.classList.add('match');
            this.classList.add('match');
            // 2. add cards to openCards
            openCards.push(previousSelection);
            openCards.push(currentSelection);
            // 3. remove click event from current card
            this.removeEventListener('click', () => console.log("click event removed!"));
            // 4. reinitialize the card selection identifiers.
            resetSelectedCards();
        } else {
            // if cards don't match, then add mismatch class to items for some brief moment
            previousSelection.classList.add('mismatch');
            currentSelection.classList.add('mismatch');
            // 2. transition to remove mismatch, show and open from cards
            previousSelection.addEventListener('transitionend', removeTransition);
            currentSelection.addEventListener('transitionend', removeTransition);
            resetSelectedCards();
        } 
        // increment the number of moves by 1 after every two selections
        moveCounter++;
    }
    // if all cards are open, alert game over
    if (isGameOver()) {
        setTimeout(() => {
            alert("Game Over!");
        }, 1000)
        
    }
    
}

function removeTransition(e) {
    if (e.propertyName === "transform") {
        console.log(this);
        this.classList.remove('mismatch','show', "open")
        // currentSelection.classList.remove('mismatch','show', "open")
    }
    console.log(e)
}

function matchSelectedCardToPreviousCard() {
    return previousSelection.isEqualNode(currentSelection);

}

function resetSelectedCards() {
    previousSelection = "";
    currentSelection = "";
}

function isGameOver() {
    return openCards.length === 16;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 function init() {
    console.log("initalizing game!")
    const faList = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bomb", "fa-bicycle", "fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bomb", "fa-bicycle"];
    const deck = document.querySelector('.deck');
    deck.innerHTML = "";
    const openCards = [];
    let previousSelection = "";
    let currentSelection = "";
    let moveCounter = 0;
    const cardList = createCardList(faList);
    loadCardsOnPage(faList);
    addEventListenersToGame();
 }