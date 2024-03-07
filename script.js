const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

let score = 0;
let timeLeft = 60;
let selectedObjects = [];

const emojis = ['🍎', '🍌', '🍇', '🍊', '🍒'];

function updateDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time: ${timeLeft}`;
}

function clearSelectedEmojis() {
    selectedObjects.forEach(obj => obj.remove());
    selectedObjects = [];
}

function checkForMatch() {
    if (selectedObjects.length === 3) {
        if (selectedObjects.every((val, _, arr) => val.textContent === arr[0].textContent)) {
            score++;
            timeLeft += 3;
            updateDisplay();
            clearSelectedEmojis();
        } else {
            // If they do not match, deselect them (this can be changed based on game design)
            selectedObjects.forEach(obj => obj.classList.remove('selected'));
            selectedObjects = [];
        }
    }
}

function createObject() {
    const numberOfObjects = Math.floor(Math.random() * 21) + 10; // Between 10 and 30

    for (let i = 0; i < numberOfObjects; i++) {
        const object = document.createElement('div');
        object.classList.add('falling-object');
        const objectIndex = Math.floor(Math.random() * emojis.length);
        object.textContent = emojis[objectIndex];
        object.style.left = `${Math.floor(Math.random() * 100)}vw`;
        gameContainer.appendChild(object);

        let position = 0;
        const fallInterval = setInterval(() => {
            if (position >= 100) {
                clearInterval(fallInterval);
                gameContainer.removeChild(object);
            } else {
                position++;
                object.style.bottom = `${position}%`;
            }
        }, 100);

        object.addEventListener('click', () => {
            if (!selectedObjects.includes(object)) {
                selectedObjects.push(object);
                object.classList.add('selected'); // Add a class to visually indicate selection
            }
            checkForMatch();
        });
    }
}

function startTimer() {
    const timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert(`Time's up! Your score was ${score}.`);
        } else {
            timeLeft--;
            updateDisplay();
        }
    }, 1000);
}

function startGame() {
    updateDisplay();
    startTimer();
    createObject(); // Adjust how often emojis fall based on game design
    setInterval(() => {
        if (gameContainer.children.length < 30) { // Avoid overcrowding the screen
            createObject();
        }
    }, 5000); // Adjust timing as needed
}

startGame();
