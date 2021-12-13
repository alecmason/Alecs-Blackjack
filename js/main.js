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

function dealCards(hand, container) {
    for (i = 0; i < 2; i++) {
        const rndIdx = Math.floor(Math.random() * shuffledDeck.length);
        hand.push(shuffledDeck.splice(rndIdx, 1)[0]);
    }
};

function playerHit() {
    if (playersCardScore < 21) {
        const rndIdx = Math.floor(Math.random() * shuffledDeck.length);
        playersHand.push(shuffledDeck.splice(rndIdx, 1)[0]);
    }

    if (dealersCardScore < 17) {
        const rndIdx = Math.floor(Math.random() * shuffledDeck.length);
        dealersHand.push(shuffledDeck.splice(rndIdx, 1)[0]);
    }
    render();

    playersCardScore = calculateCardScore(playersHand);
    dealersCardScore = calculateCardScore(dealersHand);

    checkCardScore(playersCardScore, dealersCardScore);
}

function playerStay() {
    console.log('stay button');
    let hitButton = document.getElementById('hit-btn').disabled = true;
    while (dealersCardScore < 17) {
        const rndIdx = Math.floor(Math.random() * shuffledDeck.length);
        dealersHand.push(shuffledDeck.splice(rndIdx, 1)[0]);
        renderDeckInContainer(dealersHand, dealerContainer);
        dealersCardScore = calculateCardScore(dealersHand);
    }
    checkCardScore(playersCardScore, dealersCardScore);
}

function restart() {
    init();
}

function calculateCardScore(hand) {
    return hand.reduce((a, b) => a + b.value, 0);
}

function checkCardScore(playerScore, dealerScore) {
    if (dealersCardScore === 21) {
        console.log('Dealer wins with 21');
        let hitButton = document.getElementById('hit-btn').disabled = true;
        // overlay message and restart game button
    } else if (playersCardScore === 21 && dealersCardScore === 21) {
        console.log('Dealer wins with 21. both 21');
        let hitButton = document.getElementById('hit-btn').disabled = true;
        // overlay message and restart button
    } else if (playersCardScore > 21) {
        console.log('player busts');
        let hitButton = document.getElementById('hit-btn').disabled = true;
        // overlay message and restart button
    } else if (dealersCardScore > 21) {
        console.log('dealers busts');
        let hitButton = document.getElementById('hit-btn').disabled = true;
    } else if (dealersCardScore > playersCardScore && playersCardScore < 21) {
        console.log('dealer wins');
        let hitButton = document.getElementById('hit-btn').disabled = true;
    }
}

function render() {
    renderDeckInContainer(playersHand, playerContainer);
    renderDeckInContainer(dealersHand, dealerContainer);
}

function init() {
    playersHand = [];
    dealersHand = [];
    let hitButton = document.getElementById('hit-btn').disabled = false;
    winner = null;
    shuffledDeck = getNewShuffledDeck();
    dealCards(playersHand, playerContainer);
    dealCards(dealersHand, dealerContainer);
    playersCardScore = calculateCardScore(playersHand);
    dealersCardScore = calculateCardScore(dealersHand);
    render();
}
