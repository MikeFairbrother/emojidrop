const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

let score = 0;
let timeLeft = 60;
let selectedObjects = [];

const emojis = ['🍎', '🍌', '🍇', '🍊', '🍒', '💣']; // Added bomb emoji

function updateDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time: ${timeLeft}`;
}

function clearSelectedEmojis(bomb = false, bombObject = null) {
    if (bomb && bombObject) {
        const bombIndex = Array.from(gameContainer.children).indexOf(bombObject);
        const emojisToRemove = [bombIndex - 1, bombIndex, bombIndex + 1]; // Example logic to remove emojis around the bomb
        emojisToRemove.forEach(index => {
            if (gameContainer.children[index]) {
                gameContainer.removeChild(gameContainer.children[index]);
            }
        });
        score += 10; // Increase score by 10 for bomb
    } else {
        selectedObjects.forEach(obj => obj.remove());
    }
    selectedObjects = [];
    updateDisplay();
}

function checkForMatch() {
    if (selectedObjects.length === 3) {
        if (selectedObjects.every((val, _, arr) => val.textContent === arr[0].textContent)) {
            score++;
            timeLeft += 3;
            clearSelectedEmojis();
        } else {
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
        object.style.left = `${Math.floor(Math.random() * 90) + 5}vw`;
        gameContainer.appendChild(object);

        // Handle bomb emoji differently
        if (object.textContent === '💣') {
            object.classList.add('bomb');
        }

        object.addEventListener('click', () => {
            if (object.textContent === '💣') {
                clearSelectedEmojis(true, object); // Handle bomb click
                return;
            }
            if (!selectedObjects.includes(object)) {
                selectedObjects.push(object);
                object.classList.add('selected');
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
    setInterval(createObject, 5000); // Continuously create objects
}

startGame();
