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
    let existingEmojiPositions = [];


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
        startButton.style.display = 'none'; // Show start button
    }

    function endGame() {
        startButton.style.display = 'block';
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
                timeLeft += 5; // Add time for a correct match
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

        let numberOfObjects = Math.random() < 0.95 ? 1 : 2; // 95% chance to create 1 object, 5% for a bomb

        for (let i = 0; i < numberOfObjects; i++) {
            const object = document.createElement('div');
            object.classList.add('emoji');
            // Removed inline style
            object.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            object.style.position = 'absolute';

            let hasCollision = false;

            // Check for collisions with existing emojis
            for (let i = 0; i < existingEmojiPositions.length; i++) {
                const existingPosition = existingEmojiPositions[i];
                const buffer = 10; // Adjust buffer zone for potential overlap

                if (Math.abs(object.offsetLeft - existingPosition.left) < object.offsetWidth + buffer &&
                    Math.abs(object.offsetTop - existingPosition.top) < object.offsetHeight + buffer) {
                    // Collision detected, adjust position slightly
                    object.style.top = existingPosition.top - object.offsetHeight + 'px';
                    hasCollision = true;
                    break;
                }
            }

            // If no collision, use the randomly generated position
            if (!hasCollision) {
                object.style.left = `${Math.floor(Math.random() * (gameContainer.offsetWidth - 40))}px`;
                object.style.top = '-50px';
            }

            gameContainer.appendChild(object);

            object.addEventListener('click', function() {
                if (this.textContent === bombEmoji) {
                    gameContainer.querySelectorAll('.emoji').forEach(emoji => {
                        if (Math.abs(emoji.offsetLeft - this.offsetLeft) < 100 && // Example proximity check
                            Math.abs(emoji.offsetTop - this.offsetTop) < 100) {
                            emoji.remove(); // Remove emojis close to the bomb
                        }
                    });
                    this.remove(); // Remove the bomb itself
                    score += 10; // Increase score for using the bomb
                    updateDisplay();
                } else {
                    if (!selectedObjects.includes(this)) {
                        this.classList.add('selected');
                        selectedObjects.push(this);
                        checkForMatch();
                    }
                }
            });

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

            // Update existingEmojiPositions on object creation
            existingEmojiPositions.push({
                left: object.offsetLeft,
                top: object.offsetTop + object.offsetHeight
            });
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
