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
        endMessage.classList.add('endMessage');
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

        let numberOfObjects = Math.random() < 0.2 ? 1 : 2; // Adjusted for simplicity

        for (let i = 0; i < numberOfObjects; i++) {
            const object = document.createElement('div');
            object.classList.add('emoji');
            object.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            object.style.position = 'absolute';
            object.style.left = `${Math.floor(Math.random() * (gameContainer.offsetWidth - object.offsetWidth))}px`; // Random horizontal position within container
            object.style.top = `-50px`; // Start above the game container
            gameContainer.appendChild(object);

            let posY = parseInt(object.style.top, 10); // Starting Y position

            const fallInterval = setInterval(() => {
                posY += 5; // Speed of falling
                object.style.top = `${posY}px`; // Update Y position

                // Check collision with the container bottom
                if (posY + object.offsetHeight >= gameContainer.offsetHeight) {
                    clearInterval(fallInterval);
                } else {
                    // Check collision with other emojis
                    let collision = Array.from(gameContainer.querySelectorAll('.emoji')).some(other => {
                        if (other !== object) {
                            let rect1 = object.getBoundingClientRect();
                            let rect2 = other.getBoundingClientRect();
                            let overlap = !(rect1.right < rect2.left ||
                                rect1.left > rect2.right ||
                                rect1.bottom < rect2.top ||
                                rect1.top > rect2.bottom);
                            return overlap && rect1.top < rect2.bottom; // Check if the falling emoji is above and overlaps
                        }
                        return false;
                    });

                    if (collision) {
                        clearInterval(fallInterval); // Stop falling if collision is detected
                    }
                }
            }, 50);


            object.addEventListener('click', function() {
                if (this.textContent === bombEmoji) {
                    gameContainer.querySelectorAll('.emoji').forEach(emoji => {
                        if (Math.abs(emoji.offsetLeft - this.offsetLeft) < 100 &&
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
        }, 1000); // Adjust frequency of emoji generation

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
