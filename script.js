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

        let numberOfObjects = Math.random() < 0.95 ? 1 : 2; // 95% chance to create 1 object, 5% for a bomb

        for (let i = 0; i < numberOfObjects; i++) {
            const object = document.createElement('div');
            object.classList.add('emoji');
            object.textContent = i === 0 ? emojis[Math.floor(Math.random() * emojis.length)] : bombEmoji;
            object.style.left = `${Math.floor(Math.random() * 90) + 5}%`;
            object.style.fontSize = '40px'; // Adjust size as needed
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
        }
    }

    function startGame() {
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
