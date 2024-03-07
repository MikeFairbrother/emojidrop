let timerInterval = null;
let createObjectsInterval = null;
const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

let score = 0;
let timeLeft = 60;
let selectedObjects = [];
const emojis = ['🍎', '🍌', '🍇', '🍊', '🍒', '💣']; // Including the bomb emoji
let fallSpeed = 2; // Control the falling speed of the emojis

// This function is used to calculate the bottom position of the emojis and make them stop to simulate piling up
function calculateBottomPosition(object) {
    let bottomPos = window.innerHeight - object.offsetTop - object.offsetHeight;
    // Check each emoji to see if it should stop because it "hits" another emoji
    Array.from(gameContainer.children).forEach(child => {
        if (child !== object) {
            let childBottomPos = window.innerHeight - child.offsetTop - child.offsetHeight;
            if (object.offsetLeft < child.offsetLeft + child.offsetWidth &&
                object.offsetLeft + object.offsetWidth > child.offsetLeft &&
                bottomPos < childBottomPos + fallSpeed) {
                bottomPos = childBottomPos;
            }
        }
    });
    return bottomPos;
}

function updateDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time: ${timeLeft}`;
}

function startFalling(object) {
    let interval = setInterval(() => {
        let bottomPos = calculateBottomPosition(object);
        if (bottomPos <= 0) {
            clearInterval(interval);
        } else {
            object.style.transform = `translateY(${window.innerHeight - object.offsetTop - object.offsetHeight - bottomPos}px)`;
        }
    }, 20);
}

function createObject() {
    const numberOfObjects = Math.floor(Math.random() * 21) + 10; // Between 10 and 30

    for (let i = 0; i < numberOfObjects; i++) {
        const object = document.createElement('div');
        object.classList.add('falling-object');
        const objectIndex = Math.floor(Math.random() * emojis.length);
        object.textContent = emojis[objectIndex];
        object.style.left = `${Math.floor(Math.random() * (gameContainer.offsetWidth - 40))}px`; // Ensuring emojis fall within the container width
        gameContainer.appendChild(object);
        object.style.top = `${-object.offsetHeight}px`; // Start above the screen

        startFalling(object);

        // Handle bomb emoji and selection
        if (object.textContent === '💣') {
            object.classList.add('bomb');
        }

        object.addEventListener('click', () => {
            if (object.textContent === '💣') {
                // Special handling for bomb emoji
                clearSelectedEmojis(true, object); // Implement this function based on previous example
                return;
            }
            if (!selectedObjects.includes(object)) {
                selectedObjects.push(object);
                object.classList.add('selected'); // Visual feedback for selection
                checkForMatch(); // Implement match checking and scoring based on previous example
            }
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

function clearGameArea() {
    gameContainer.innerHTML = ''; // Clear the game area
    gameContainer.appendChild(startButton); // Add the start button back
}

function endGame() {
    clearInterval(timerInterval);
    clearInterval(createObjectsInterval);
    clearGameArea(); // Clears the game area and shows the start button
    const endMessage = document.createElement('div');
    endMessage.textContent = `Game Over! Your score was ${score}.`;
    endMessage.style.position = 'absolute';
    endMessage.style.top = '40%';
    endMessage.style.left = '50%';
    endMessage.style.transform = 'translate(-50%, -50%)';
    endMessage.style.fontSize = '20px';
    gameContainer.appendChild(endMessage);
}

function startGame() {
    clearGameArea(); // Ensure the game area is clear before starting
    timeLeft = 60; // Reset time
    score = 0; // Reset score
    updateDisplay();

    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            endGame();
        } else {
            timeLeft--;
            updateDisplay();
        }
    }, 1000);

    createObjectsInterval = setInterval(createObject, 5000); // Adjust as needed
}

startButton.addEventListener('click', startGame);