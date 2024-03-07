document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const startButton = document.createElement('div');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    let score = 0;
    let timeLeft = 60;
    let selectedObjects = [];
    let gameActive = false;
    const emojis = ['🍎', '🍌', '🍇', '🍊', '🍒'];
    const bombEmoji = '💣';

    startButton.id = 'start-button';
    startButton.textContent = '🎮 Start';
    startButton.style.display = 'none'; // Initially hidden until DOM is loaded
    gameContainer.appendChild(startButton);

    function updateDisplay() {
        scoreDisplay.textContent = `Score: ${score}`;
        timerDisplay.textContent = `Time: ${timeLeft}`;
    }

    function clearGameArea() {
        gameContainer.innerHTML = ''; // Clear the game area
        gameContainer.appendChild(startButton); // Add the start button back
        startButton.style.display = 'block'; // Show start button
    }

    function endGame() {
        gameActive = false;
        clearGameArea(); // Clears the game area and shows the start button
        const endMessage = document.createElement('div');
        endMessage.textContent = `Game Over! Your score was ${score}.`;
        endMessage.classList.add('end-message');
        gameContainer.appendChild(endMessage);
        startButton.textContent = 'Restart 🎮';
    }

    function checkForMatch() {
        if (selectedObjects.length === 3) {
            if (selectedObjects.every(val => val.textContent === selectedObjects[0].textContent)) {
                score++;
                timeLeft += 3; // Add time for a correct match
                selectedObjects.forEach(obj => obj.remove());
            } else {
                selectedObjects.forEach(obj => obj.classList.remove('selected')); // Deselect if not matching
            }
            selectedObjects = []; // Reset selected objects
            updateDisplay();
        }
    }

    function createObject() {
        if (!gameActive) return;

        const object = document.createElement('div');
        object.classList.add('emoji');
        // Simplify object creation to focus on falling mechanics
        object.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        object.style.position = 'absolute';
        object.style.left = `${Math.floor(Math.random() * (gameContainer.offsetWidth - 40))}px`; // Adjusted to ensure it's within container width
        object.style.top = '-50px'; // Start above the game container
        gameContainer.appendChild(object);

        function fall() {
            let currentTop = parseInt(object.style.top, 10);
            let newTop = currentTop + 5; // Adjust the speed as necessary

            // Check for bottom of the container or another emoji below
            let bottomReached = newTop + object.offsetHeight >= gameContainer.offsetHeight;
            let collisionDetected = Array.from(gameContainer.children).some(other => {
                if (other !== object && other.offsetTop <= newTop + object.offsetHeight && other.offsetTop > currentTop) {
                    return parseInt(other.style.left, 10) < parseInt(object.style.left, 10) + object.offsetWidth &&
                        parseInt(other.style.left, 10) + other.offsetWidth > parseInt(object.style.left, 10);
                }
                return false;
            });

            if (!bottomReached && !collisionDetected) {
                object.style.top = `${newTop}px`;
                requestAnimationFrame(fall); // Continue falling
            }
        }
        fall();
    }


    // Animate the emoji falling
            let posY = 0;
            const fallInterval = setInterval(() => {
                if (posY < window.innerHeight - object.offsetHeight && gameActive) {
                    posY += 5; // Speed of falling
                    object.style.transform = `translateY(${posY}px)`;
                } else {
                    clearInterval(fallInterval);
                }
            }, 50);
        }
    }

    function startGame() {
        startButton.style.display = 'none';
        if (gameActive) return; // Prevent multiple starts

        gameActive = true;
        score = 0;
        timeLeft = 60;
        selectedObjects = [];
        clearGameArea();
        updateDisplay();

        // Game loop
        const gameLoop = setInterval(() => {
            if (!gameActive) clearInterval(gameLoop);
            createObject();
        }, 2000); // Adjust frequency of emoji generation

        // Timer logic
        const timer = setInterval(() => {
            if (timeLeft <= 0 || !gameActive) {
                clearInterval(timer);
                endGame();
            } else {
                timeLeft--;
                updateDisplay();
            }
        }, 1000);
    }

    startButton.addEventListener('click', startGame);
    startButton.style.display = 'block'; // Show start button after everything is loaded
});
