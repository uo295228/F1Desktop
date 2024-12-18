class Memoria {
    constructor() {
        this.elements = [
            { element: "RedBull", source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
            { element: "McLaren", source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg" },
            { element: "Alpine", source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg" },
            { element: "AstonMartin", source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg" },
            { element: "Ferrari", source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg" },
            { element: "Mercedes", source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg" }
        ];

        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;

        this.createElements();
        this.addEventListeners();
    }

    createElements() {
        const gameBoard = document.querySelector('main');  // Usa 'section' para el tablero

        const cards = [...this.elements, ...this.elements];
        this.shuffleElements(cards);

        cards.forEach(cardData => {
            const card = document.createElement('article');
            card.dataset.element = cardData.element;
            card.dataset.state = 'initial';

            //const cardContainer = document.createElement('section');  // Usado en lugar de "card-inner"

            //const frontFace = document.createElement('h3');
            const frontFace = document.createElement('img');
            frontFace.src = cardData.source;
            frontFace.alt = cardData.element;
            //frontFace.appendChild(cardImage);

            const backFace = document.createElement('h3');
            backFace.textContent = "Tarjeta de memoria";

           card.appendChild(frontFace);
            card.appendChild(backFace);
           
            

            gameBoard.appendChild(card);
        });
    }

    shuffleElements(cards) {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    addEventListeners() {
        const cards = document.querySelectorAll('main > article');  // Selecciona las cartas dentro de section
        cards.forEach(card => {
            card.addEventListener('click', this.flipCard.bind(card, this));
       
        });
    }

    flipCard(game) {
        if (this.dataset.state === 'revealed' || game.lockBoard || this === game.firstCard) return;

        this.dataset.state = 'flipped';
        

        if (!game.hasFlippedCard) {
            game.hasFlippedCard = true;
            game.firstCard = this;
        } else {
            game.secondCard = this;
            game.checkForMatch();
        }
    }

    checkForMatch() {
        const isMatch = this.firstCard.dataset.element === this.secondCard.dataset.element;
        isMatch ? this.disableCards() : this.unflipCards();
    }

    unflipCards() {
        this.lockBoard = true;

        setTimeout(() => {
            this.firstCard.dataset.state = 'initial';
            this.secondCard.dataset.state = 'initial';
           
            this.resetBoard();
        }, 1000);
    }

    disableCards() {
        this.firstCard.dataset.state = 'revealed';
        this.secondCard.dataset.state = 'revealed';
        this.firstCard.removeEventListener('click', this.flipCard);
        this.secondCard.removeEventListener('click', this.flipCard);
        this.resetBoard();
    }

    resetBoard() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }
}
