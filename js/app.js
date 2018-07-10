
let openCards = [];
let previousSelection = '';
let currentSelection = '';
let moveCounter = 0;
let timer;

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
	// restart game
	const restartIcon = document.querySelector('.restart');
	restartIcon.addEventListener('click', restart);
}

/**
 *  timer functionality using Timer.js
 */
function MyTimer() {
	/*global Timer*/
	this.counter = 0;
	this.seconds = 0;
	this.mins = 0;

	this.myTimer = new Timer(({
		tick: 1,
		onstart : () => {console.log('timer started');},
		onstop  : () => { console.log('timer stopped');},
		onpause : () => { console.log('timer set on pause');},
		onend   : () => { console.log('timer ended normally');},
		ontick  : () => {
			this.counter = this.counter + 1;
			let sec = this.counter % 60;
			this.seconds = sec < 10 ? `0${sec}` : sec;
			this.mins = parseInt(this.counter / 60);
			let minutes = this.mins < 10 ? `0${this.mins}` : this.mins; 
			const time = `${minutes}:${this.seconds}`;
			document.getElementById('timer').textContent = time;
		},
	}));

	this.startTime = function() {
		this.myTimer.start(60 * 60);
	};
	this.stopTime = function() {
		this.myTimer.off('all');
		this.myTimer == null;
	};
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
	const deck = document.querySelector('.deck');
	// remove any existing cards on page
	deck.innerHTML = '';
	const cardList = createCardList(faList);
	const shuffledCardList = shuffle(cardList);
	
	for (const card of shuffledCardList) {
		deck.insertAdjacentHTML('beforeend', card);
	}
}

/**
 * at start of game, briefly show all the cards on page
 * @param {*} faList 
 */
function brieflyShowAllCardsOnPage(faList) {
	const deck = document.querySelector('.deck');
	setTimeout(() => {
		const openCards = createOpenCardList(faList);
		for (const card of openCards) {
			deck.insertAdjacentHTML('beforeend', card);
		}
	}, 100);
	
}

function createCardList(faList) {
	return faList.map(faName => {
		return `<li class="card"><i class="fa ${faName}"></i></li>`;
	});
}

function createOpenCardList(faList) {
	return faList.map(faName => {
		return `<li class="card show open"><i class="fa ${faName}"></i></li>`;
	});
}

function shuffle(array) {
	const length = array.length;
	for (let i = 0; i < length; i++) {
		let randomIndex =  Math.floor(Math.random() * length);
		let temp = array[i];
		array[i] = array[randomIndex];
		array[randomIndex] = temp;
	}
	return array;
}

function showCard() {
	// show card and disable it.
	this.classList.add('show', 'open', 'disable');
	if (previousSelection == '') {
		previousSelection = this;
	} else {
		currentSelection = this;
		// check if selections match
		const isMatch = matchSelectedCardToPreviousCard();
		if (isMatch) {
			// 1. add match class to card
			previousSelection.classList.add('match');
			this.classList.add('match');
			// 2. add cards to openCards
			openCards.push(previousSelection);
			openCards.push(currentSelection);
			// 3. remove click event from current card
			this.removeEventListener('click', () => console.log('click event removed!'));
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
		console.log('Number of stars:', getNumberOfStars());
	}
	// if all cards are open, alert game over
	if (isGameOver()) {
		setTimeout(() => {
			timer.stopTime();
			showGameEndModal();
		}, 500);
	}
}

/**
 * Transition effect for cards that do not match
 * @param {*} e 
 */
function removeTransition(e) {
	if (e.propertyName === 'transform') {
		console.log(this);
		this.classList.remove('mismatch', 'show', 'open', 'disable');
		// currentSelection.classList.remove('mismatch','show', "open")
	}
	console.log(e);
}

/**
 *  check if the selected cards match.
 */
function matchSelectedCardToPreviousCard() {
	return previousSelection.isEqualNode(currentSelection);

}

function resetSelectedCards() {
	previousSelection = '';
	currentSelection = '';
}

function isGameOver() {
	return openCards.length === 16;
}

function setNumberOfStarsOnPage() {
	const stars = document.querySelector('.stars');
	stars.innerHTML = '';
	const numberOfStarsToDisplay = getNumberOfStars();
	for (let i = 0; i < numberOfStarsToDisplay; i++) {
		const li = document.createElement('li');
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
function showGameEndModal() {
	const gameResult = document.getElementById('result');
	// clear modal 
	gameResult.innerHTML = '';
	// set with new data
	const checkIcon = '<i class="fa fa-diamond"></i>';
	gameResult.insertAdjacentHTML('afterbegin', `<p>It took you ${document.getElementById('timer').innerText} minutes!</p>`);
	gameResult.insertAdjacentHTML('afterbegin', `<p>Congratulations, You won with ${moveCounter} moves and a rating of ${getNumberOfStars()}!</p>`);
	gameResult.insertAdjacentHTML('afterbegin', checkIcon);
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

/**
 * restart game when the restart icon is clicked
 */
function restart() {
	document.getElementById('timer').textContent = '00.00';
	timer.stopTime();
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
	console.log('initalizing game!');
	const symbols = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bomb', 'fa-bicycle'];
	const faList = [...symbols, ...symbols];
	const deck = document.querySelector('.deck');
	deck.innerHTML = '';
	openCards = [];
	previousSelection = '';
	currentSelection = '';
	moveCounter = 0;
	setMoves();
	setNumberOfStarsOnPage();
	brieflyShowAllCardsOnPage(faList);
	// runs after all cards are briefly shown on page

	setTimeout(() => {
		loadCardsOnPage(faList);
		addEventListenersToGame();
	}, 500);
	timer = new MyTimer();
	timer.startTime();
}