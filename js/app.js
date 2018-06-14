/*
 * Create a list that holds all of your cards
 */


const faList = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-anchor", "fa-leaf", "fa-bicycle", "fa-diamond", "fa-bomb", "fa-leaf", "fa-bomb", "fa-bolt", "fa-bicycle", "fa-paper-plane-o", "fa-cube"];
const openCards = [];
let previousSelection = "";
let currentSelection = "";
init();

const cards = document.getElementsByClassName('card');
for (const card of cards) {
    card.addEventListener('click', showCard, false);
    card.addEventListener('transitionend', removeTransition);
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
    const shuffledCardList = shuffle(cardList);
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
        this.removeEventListener('click', reset);
    } else {
        currentSelection = this;
        if (matchSelectedCardToPreviousCard()) {
            previousSelection.classList.add('match');
            this.classList.add('match');
            openCards.push(previousSelection);
            openCards.push(currentSelection);
            this.removeEventListener('click', reset);
            resetSelectedCards();
        } else {
            previousSelection.classList.add('mismatch');
            currentSelection.classList.add('mismatch');
            // previousSelection.classList.remove('show', "open");
            // currentSelection.classList.remove('show', "open");
            resetSelectedCards();
        }   
    }
}

function removeTransition(e) {
    if (e.propertyName === "transform") {
        this.classList.remove('mismatch','show', "open")
        // currentSelection.classList.remove('mismatch','show', "open")
    }
    console.log(e)
}

function matchSelectedCardToPreviousCard() {
    return previousSelection.isEqualNode(currentSelection);

}

function reset() {
    console.log("cliek event removed");
}
 function resetSelectedCards() {
    previousSelection = "";
    currentSelection = "";
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
    const cardList = createCardList(faList);
    loadCardsOnPage(faList);
 }