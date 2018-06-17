
let openCards = [];
let previousSelection = "";
let currentSelection = "";
let moveCounter = 0;

/**
 * Inialize the game
 */
init();

function addEventListenersToGame() {
    const cards = document.getElementsByClassName('card');
    for (const card of cards) {
        // add click event to card
        card.addEventListener('click', showCard, false);
    }
    // modal restart button
    const restartButton = document.getElementById('restart');
    restartButton.addEventListener('click', closeModal);
    
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
    // show card and disable it.
    this.classList.add('show', 'open', 'disable');
    if (previousSelection == "") {
        previousSelection = this;
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
        setNumberOfStarsOnPage();
        setMoves();
        console.log("Number of stars:", getNumberOfStars());
    }
    // if all cards are open, alert game over
    if (isGameOver()) {
        setTimeout(() => {
            showGameEndModal();
            // alert("Game Over!");
            // console.log("Congratulations, you won with", moveCounter , "moves!!!");
        }, 500)   
    }  
}

/**
 * Transition effect for cards that do not match
 * @param {*} e 
 */
function removeTransition(e) {
    if (e.propertyName === "transform") {
        console.log(this);
        this.classList.remove('mismatch','show', "open", "disable")
        // currentSelection.classList.remove('mismatch','show', "open")
    }
    console.log(e)
}

/**
 *  check if the selected cards match.
 */
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

function setNumberOfStarsOnPage() {
    const stars = document.querySelector('.stars');
    stars.innerHTML = "";
    const numberOfStarsToDisplay = getNumberOfStars();
    for (let i = 0; i < numberOfStarsToDisplay; i++) {
        const li = document.createElement("li");
        li.insertAdjacentHTML('beforeend', '<i class="fa fa-star"></i>');
        stars.appendChild(li);
    }
}

function setMoves() {
    const moves = document.querySelector('.moves');
    moves.innerHTML = moveCounter;
}
/**
 * determines the number of stars to display
 */
function getNumberOfStars() {
    if (moveCounter <= 8) {
        return 5;
    } else {
        return parseInt(5 / (moveCounter / 8));
    }
}

/**
 * Show the modal when the game is over!
 */
function showGameEndModal(){
    const gameResult = document.getElementById('result');
    // clear modal 
    gameResult.innerHTML = "";
    // set with new data
    const checkIcon ='<i class="fa fa-diamond"></i>';
    gameResult.insertAdjacentHTML("afterbegin", `<p>Congratulations, You won with ${moveCounter} moves!</p>`);
    gameResult.insertAdjacentHTML("afterbegin", checkIcon);
    const gameEndModal = document.getElementById('gameEnd');
    gameEndModal.showModal();
}

/**
 * Closes the modal and restart game.
 */
function closeModal() {
    const gameEndModal = document.getElementById('gameEnd');
    gameEndModal.close();
    // restart game;
    init();
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
    openCards = [];
    previousSelection = "";
    currentSelection = "";
    moveCounter = 0;
    const cardList = createCardList(faList);
    setMoves();
    setNumberOfStarsOnPage();
    loadCardsOnPage(faList);
    addEventListenersToGame();
 }