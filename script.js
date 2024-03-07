const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

let score = 0;
let timeLeft = 60;
let selectedObjects = [];

// A small selection of emojis for demonstration purposes
const emojis = ['🍎', '🍌', '🍇', '🍊', '🍒'];

function updateDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time: ${timeLeft}`;
}

function createObject() {
    const object = document.createElement('div');
    object.classList.add('falling-object');
    const objectIndex = Math.floor(Math.random() * emojis.length);
    object.textContent = emojis[objectIndex]; // Set emoji as text content
    object.dataset.emoji = emojis[objectIndex]; // Use dataset to store the emoji for comparison
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
        if (!selectedObjects.includes(object.dataset.emoji)) {
            selectedObjects.push(object.dataset.emoji);
        }
        if (selectedObjects.length === 3) {
            if (selectedObjects.every(val => val === object.dataset.emoji)) {
                score++;
                timeLeft += 3;
                updateDisplay();
            }
            selectedObjects = [];
        }
    });
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
    setInterval(createObject, 10000); // Adjust this value as needed for gameplay balance
}

startGame();
