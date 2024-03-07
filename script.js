document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const startButton = document.createElement('div');
    startButton.id = 'start-button';
    startButton.textContent = '🎮 Start';
    gameContainer.appendChild(startButton);

    let score = 0;
    let timeLeft = 60;
    let timerInterval = null;
    let emojisFallingInterval = null;
    const emojis = ['🍎', '🍌', '🍇', '🍊', '🍒'];
    const bombEmoji = '💣';

    function updateDisplay() {
        scoreDisplay.textContent = `Score: ${score}`;
        timerDisplay.textContent = `Time: ${timeLeft}`;
    }

    function clearGameArea() {
        gameContainer.innerHTML = ''; // Clear the game area, removing all emojis
    }

    function endGame() {
        clearInterval(timerInterval);
        clearInterval(emojisFallingInterval);
        clearGameArea(); // Clears the game area

        const endMessage = document.createElement('div');
        endMessage.textContent = `Game Over! Your score was ${score}.`;
        endMessage.id = 'end-message';
        gameContainer.appendChild(endMessage);
        gameContainer.appendChild(startButton); // Add the start button back
        startButton.style.display = 'block'; // Ensure the start button is visible
    }

    function startGame() {
        clearGameArea(); // Ensure the game area is clear before starting
        score = 0;
        timeLeft = 60;
        updateDisplay();
        startButton.style.display = 'none'; // Hide the start button

        timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                endGame();
            } else {
                timeLeft--;
                updateDisplay();
            }
        }, 1000);

        emojisFallingInterval = setInterval(() => {
            const emoji = document.createElement('div');
            emoji.className = 'emoji';
            emoji.textContent = Math.random() < 0.9 ? emojis[Math.floor(Math.random() * emojis.length)] : bombEmoji; // 10% chance for bomb
            emoji.style.left = `${Math.floor(Math.random() * 90)}vw`;
            emoji.style.top = '0';
            gameContainer.appendChild(emoji);

            let fallSpeed = 2;
            function fall() {
                const currentPosition = parseInt(emoji.style.top);
                const nextPosition = currentPosition + fallSpeed;
                emoji.style.top = `${nextPosition}px`;

                // Stop falling if reaching the bottom of the game container
                if (nextPosition + emoji.offsetHeight >= gameContainer.offsetHeight) {
                    clearInterval(fallingInterval);
                }
            }
            const fallingInterval = setInterval(fall, 20);

            emoji.addEventListener('click', function() {
                if (this.textContent === bombEmoji) {
                    // Remove emojis around the bomb
                    const bombPosition = { left: this.offsetLeft, top: this.offsetTop };
                    Array.from(document.querySelectorAll('.emoji')).forEach(e => {
                        if (Math.abs(e.offsetLeft - bombPosition.left) < 100 && Math.abs(e.offsetTop - bombPosition.top) < 100) {
                            e.remove(); // Remove emojis close to the bomb
                        }
                    });
                    score += 10; // Increase score for bomb
                } else {
                    score++;
                }
                this.remove(); // Remove the clicked emoji
                updateDisplay();
            });
        }, 2000);
    }

    startButton.addEventListener('click', startGame);
});
