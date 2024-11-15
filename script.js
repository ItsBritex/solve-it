// ... (Keep the existing bubble creation code at the beginning)

const startButton = document.getElementById('startButton');
const gameArea = document.getElementById('gameArea');
const problem = document.getElementById('problem');
const answer = document.getElementById('answer');
const submitButton = document.getElementById('submitButton');
const result = document.getElementById('result');
const timer = document.getElementById('timer');
const stopButton = document.getElementById('stopButton');
const stats = document.getElementById('stats');
const progressBar = document.getElementById('progressBar');
const progressPercentage = document.getElementById('progressPercentage');
const totalTime = document.getElementById('totalTime');
const totalQuestions = document.getElementById('totalQuestions');
const resultsTable = document.getElementById('resultsTable');
const restartButton = document.getElementById('restartButton');
const homeButton = document.getElementById('homeButton');
const countdown = document.getElementById('countdown');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

let startTime, endTime, timerInterval;
let currentProblem = {};
let results = [];
let problemStartTime;

startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);
submitButton.addEventListener('click', checkAnswer);
answer.addEventListener('input', toggleSubmitButton);
answer.addEventListener('keyup', function(event) {
    if (event.key === 'Enter' && submitButton.style.display !== 'none') {
        checkAnswer();
    }
});
restartButton.addEventListener('click', restartGame);
homeButton.addEventListener('click', goHome);
loginBtn.addEventListener('click', () => alert('Login functionality to be implemented'));
registerBtn.addEventListener('click', () => alert('Register functionality to be implemented'));

function startGame() {
    startButton.style.display = 'none';
    gameArea.style.display = 'block';
    startTime = new Date();
    generateProblem();
    startTimer();
}

function generateProblem() {
    let num1, num2;
    const problemCount = results.length;

    if (problemCount < 30) {
        num1 = Math.floor(Math.random() * 9) + 1;
        num2 = Math.floor(Math.random() * 9) + 1;
    } else if (problemCount < 100) {
        if (Math.random() < 0.5) {
            num1 = Math.floor(Math.random() * 9) + 1;
            num2 = Math.floor(Math.random() * 9) + 1;
        } else {
            num1 = Math.floor(Math.random() * 90) + 10;
            num2 = Math.floor(Math.random() * 90) + 10;
        }
    } else {
        const rand = Math.random();
        if (rand < 0.33) {
            num1 = Math.floor(Math.random() * 9) + 1;
            num2 = Math.floor(Math.random() * 9) + 1;
        } else if (rand < 0.66) {
            num1 = Math.floor(Math.random() * 90) + 10;
            num2 = Math.floor(Math.random() * 90) + 10;
        } else {
            num1 = Math.floor(Math.random() * 900) + 100;
            num2 = Math.floor(Math.random() * 900) + 100;
        }
    }

    // Ensure num1 and num2 are different
    while (num1 === num2) {
        num2 = Math.floor(Math.random() * 9) + 1;
    }

    currentProblem = {
        num1: num1,
        num2: num2,
        answer: num1 + num2
    };

    problem.textContent = `${num1} + ${num2} = `;
    answer.value = '';
    result.textContent = '';
    answer.focus();
    problemStartTime = new Date();
}

function checkAnswer() {
    const userAnswer = parseInt(answer.value);
    const problemEndTime = new Date();
    const timeTaken = (problemEndTime - problemStartTime) / 1000; // in seconds

    if (userAnswer === currentProblem.answer) {
        result.textContent = '✓';
        result.style.color = 'green';
    } else {
        result.textContent = `✗ Correct answer: ${currentProblem.answer}`;
        result.style.color = 'red';
    }

    results.push({
        problem: `${currentProblem.num1} + ${currentProblem.num2}`,
        userAnswer: userAnswer,
        correctAnswer: currentProblem.answer,
        isCorrect: userAnswer === currentProblem.answer,
        time: timeTaken.toFixed(2)
    });

    submitButton.style.display = 'none';
    setTimeout(() => {
        result.textContent = '';
        generateProblem();
    }, 1500);
}

function toggleSubmitButton() {
    if (answer.value.trim() !== '') {
        submitButton.style.display = 'inline-block';
    } else {
        submitButton.style.display = 'none';
    }
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;
    timer.textContent = `Time: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function stopGame() {
    clearInterval(timerInterval);
    endTime = new Date();
    gameArea.style.display = 'none';
    showStats();
}

function showStats() {
    const totalTimeSpent = Math.floor((endTime - startTime) / 1000);
    const hours = Math.floor(totalTimeSpent / 3600);
    const minutes = Math.floor((totalTimeSpent % 3600) / 60);
    const seconds = totalTimeSpent % 60;

    const correctAnswers = results.filter(r => r.isCorrect).length;
    const totalProblems = results.length;
    const percentageCorrect = (correctAnswers / totalProblems * 100).toFixed(2);

    progressBar.style.width = `${percentageCorrect}%`;
    progressPercentage.textContent = `${percentageCorrect}%`;
    totalTime.textContent = `Tiempo total del desafío: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    totalQuestions.textContent = `Total de preguntas resueltas: ${totalProblems}`;

    const tbody = resultsTable.querySelector('tbody');
    tbody.innerHTML = '';
    results.forEach(r => {
        const row = tbody.insertRow();
        row.insertCell().textContent = r.problem;
        row.insertCell().textContent = r.userAnswer;
        row.insertCell().textContent = r.correctAnswer;
        row.insertCell().textContent = `${r.time}s`;
    });

    stats.style.display = 'block';
}

function restartGame() {
    countdown.style.display = 'block';
    let count = 3;
    countdown.textContent = count;
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdown.textContent = count;
        } else {
            clearInterval(countdownInterval);
            countdown.style.display = 'none';
            stats.style.display = 'none';
            resetGame();
            startGame();
        }
    }, 1000);
}

function resetGame() {
    results = [];
    clearInterval(timerInterval);
}

function goHome() {
    stats.style.display = 'none';
    startButton.style.display = 'block';
    resetGame();
}

// Initial setup
resetGame();