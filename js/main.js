/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

// Build a 'master' deck of 'card' objects used to create shuffled decks
const masterDeck = buildMasterDeck();

/* state variables */
let shuffledDeck, dealersHand, playersHand = [];
let playersCardScore, dealersCardScore;

/* cached elements */
const playerContainer = document.getElementById('players-hand-container');
const dealerContainer = document.getElementById('dealers-hand-container');
const dealersScoreEl = document.getElementById('dealers-hand-score');
const playersScoreEl = document.getElementById('players-hand-score');

/* event listeners */
let hitBtnEl = document.getElementById('hit-btn')
    .addEventListener('click', playerHit);
let stayBtnEl = document.getElementById('stay-btn')
    .addEventListener('click', playerStay);
let restartBtnEl = document.getElementById('restart-btn')
    .addEventListener('click', restart);

// let playAgainEl = document.getElementById('play-again-btn');

/* functions */
function buildMasterDeck() {
    const deck = [];
    // Use nested forEach to generate card objects
    suits.forEach(function (suit) {
        ranks.forEach(function (rank) {
            deck.push({
                // The 'face' property maps to the library's CSS classes for cards
                face: `${suit}${rank}`,
                // Setting the 'value' property for game of blackjack, not war
                value: Number(rank) || (rank === 'A' ? 11 : 10)
            });
        });
    });
    return deck;
}

function getNewShuffledDeck() {
    // Create a copy of the masterDeck (leave masterDeck untouched!)
    const tempDeck = [...masterDeck];
    const newShuffledDeck = [];
    while (tempDeck.length) {
        // Get a random index for a card still in the tempDeck
        const rndIdx = Math.floor(Math.random() * tempDeck.length);
        // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
        newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    return newShuffledDeck;
}



init();

function renderDeckInContainer(deck, container) {
    container.innerHTML = '';
    // Let's build the cards as a string of HTML
    let cardsHtml = '';
    deck.forEach(function (card) {
        cardsHtml += `<div class="card ${card.face}"></div>`;
    });

    // Or, use reduce to 'reduce' the array into a single thing - in this case a string of HTML markup 
    // const cardsHtml = deck.reduce(function(html, card) {
    //   return html + `<div class="card ${card.face}"></div>`;
    // }, '');
    container.innerHTML = cardsHtml;
}

// deal cards to the player and dealers hand array
function dealCards(hand, container) {
    for (i = 0; i < 2; i++) {
        const rndIdx = Math.floor(Math.random() * shuffledDeck.length);
        hand.push(shuffledDeck.splice(rndIdx, 1)[0]);
    }
};

/* One of the main functions of the game.
allows the player to add another card to their hand and calcualates the cardScore of the player and dealer */
function playerHit() {
    if (playersCardScore < 21) {
        const rndIdx = Math.floor(Math.random() * shuffledDeck.length);
        playersHand.push(shuffledDeck.splice(rndIdx, 1)[0]);
    }

    render();

    playersCardScore = calculateCardScore(playersHand);
    dealersCardScore = calculateCardScore(dealersHand);

    checkCardScore(playersCardScore, dealersCardScore);
}

/* Another main function of the game. This function does some of the game logic and comparing logic to determine the winner. Will display in color and text the winner by score or loser by busting. */
function playerStay() {
    let hitButtonEl = document.getElementById('hit-btn').disabled = true;
    while (dealersCardScore < 17) {
        const rndIdx = Math.floor(Math.random() * shuffledDeck.length);
        dealersHand.push(shuffledDeck.splice(rndIdx, 1)[0]);
        renderDeckInContainer(dealersHand, dealerContainer);
        dealersCardScore = calculateCardScore(dealersHand);
    }
    displayScore();
    checkCardScore();
    
    if (dealersCardScore >= playersCardScore && dealersCardScore <= 21){
        console.log('dealers wins !!');
        dealersScoreEl.innerText = `The Dealer wins with ${dealersCardScore}`;

        hitButtonEl.disabled = true;
        dealersScoreEl.style.border = 'solid limegreen';
        dealersScoreEl.style.color = 'limegreen';
        playersScoreEl.style.border = 'solid red';
        playersScoreEl.style.color = 'red';
    } else if (playersCardScore > dealersCardScore && playersCardScore <= 21){
        console.log('player wins !!');

        playersScoreEl.innerText = `You win with ${playersCardScore}`;
    
        hitButtonEl.disabled = true;
        dealersScoreEl.style.border = 'solid red';
        dealersScoreEl.style.color = 'red';
        playersScoreEl.style.border = 'solid limegreen';
        playersScoreEl.style.color = 'limegreen';
    }
}

/* the restart function invokes the init() function to reset the state variables and return the color of the text back to white */
function restart() {
    init();
    playersScoreEl.style.border = '';
    playersScoreEl.style.color = 'white';
    dealersScoreEl.style.border = '';
    dealersScoreEl.style.color = 'white';
}

/* this function takes the dealers and players hand array and uses the reduce() method to calcualte the total value and return it to a variable to compare the cardScores */
function calculateCardScore(hand) {
    return hand.reduce((a, b) => a + b.value, 0);
}

/* the function houses most of the game logic, comparing the dealers card score to the players card score. This functino will disable the HIT button if certain win/lose conditions are met. The players and dealers text will turn a certain color and the text will change based on winning or losing conditions. */
function checkCardScore() {

    let hitButtonEl = document.getElementById('hit-btn');
    displayScore();

    if (dealersCardScore === 21) {
        console.log('Dealer wins with 21');
        dealersScoreEl.innerText = `The Dealer wins with ${dealersCardScore}`;

        hitButtonEl.disabled = true;
        dealersScoreEl.style.border = 'solid limegreen';
        dealersScoreEl.style.color = 'limegreen';
        playersScoreEl.style.border = 'solid red';
        playersScoreEl.style.color = 'red';
    } else if (playersCardScore === 21 && dealersCardScore === 21) {
        console.log('Dealer wins with 21. both 21');
        dealersScoreEl.innerText = `The Dealer wins with ${dealersCardScore}`;

        hitButtonEl.disabled = true;
        dealersScoreEl.style.border = 'solid limegreen';
        dealersScoreEl.style.color = 'limegreen';
        playersScoreEl.style.border = 'solid red';
        playersScoreEl.style.color = 'red';
    } else if (playersCardScore > 21) {
        console.log('player busts > 21');
        playersScoreEl.innerText = `You've busted with ${playersCardScore}`;

        hitButtonEl.disabled = true;
        dealersScoreEl.style.border = 'solid limegreen';
        dealersScoreEl.style.color = 'limegreen';
        playersScoreEl.style.border = 'solid red';
        playersScoreEl.style.color = 'red';
    } else if (dealersCardScore > 21) {
        console.log('dealers busts > 21');
        dealersScoreEl.innerText = `The Dealer busts with ${dealersCardScore}`;

        hitButtonEl.disabled = true;
        dealersScoreEl.style.border = 'solid red';
        dealersScoreEl.style.color = 'red';
        playersScoreEl.style.border = 'solid limegreen';
        playersScoreEl.style.color = 'limegreen';
    } else if (playersCardScore === dealersCardScore){
        console.log('dealers wins same #');
        dealersScoreEl.innerText = `The Dealer wins the tie with ${dealersCardScore}`;
        playersScoreEl.innerText = `Your Hand is ${playersCardScore}`;

        hitButtonEl.disabled = true;
        dealersScoreEl.style.border = 'solid limegreen';
        dealersScoreEl.style.color = 'limegreen';
        playersScoreEl.style.border = 'solid red';
        playersScoreEl.style.color = 'red';
    }
}

/* this function is for initially displaying the dealers and players score but will be updated to display who has won or lost as the game is played. */
function displayScore(){
    dealersScoreEl.innerText = `The Dealer's hand is ${dealersCardScore}`;
    playersScoreEl.innerText = `Your Hand is ${playersCardScore}`;
}

/* the render function displays the cards for the dealer and player in a div in html */
function render() {
    renderDeckInContainer(playersHand, playerContainer);
    renderDeckInContainer(dealersHand, dealerContainer);
}

/* the initialize function begins the start of the game with initial values */
function init() {
    playersHand = [];
    dealersHand = [];
    let hitButton = document.getElementById('hit-btn').disabled = false;
    shuffledDeck = getNewShuffledDeck();
    dealCards(playersHand, playerContainer);
    dealCards(dealersHand, dealerContainer);
    playersCardScore = calculateCardScore(playersHand);
    dealersCardScore = calculateCardScore(dealersHand);
    displayScore();
    render();
}
