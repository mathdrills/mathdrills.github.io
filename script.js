// Math Drills Web App - Times Tables and Counting
let questions = [];
let current = 0;
let correct = 0;
let incorrect = [];
let startTime = 0;
let currentGame = '';

// DOM elements
const homeScreen = document.getElementById('home-screen');
const timesTablesScreen = document.getElementById('times-tables-screen');
const countingScreen = document.getElementById('counting-screen');
const quizDiv = document.getElementById('quiz');
const questionDiv = document.getElementById('question');
const countingDisplay = document.getElementById('counting-display');
const answerForm = document.getElementById('answer-form');
const answerInput = document.getElementById('answer');
const progressDiv = document.getElementById('progress');
const summaryDiv = document.getElementById('summary');

// Navigation buttons
const timesTablesBtn = document.getElementById('times-tables-btn');
const countingBtn = document.getElementById('counting-btn');
const backFromTimes = document.getElementById('back-from-times');
const backFromCounting = document.getElementById('back-from-counting');
const backFromQuiz = document.getElementById('back-from-quiz');

// Forms
const setupForm = document.getElementById('setup-form');
const countingSetupForm = document.getElementById('counting-setup-form');

// Animal emojis for counting game
const animals = {
    bears: ['🐻', '🧸', '🐨'],
    owls: ['🦉', '🦆'],
    wolves: ['🐺', '🦊', '🐕']
};

// Event listeners for navigation
timesTablesBtn.addEventListener('click', () => showScreen('times-tables'));
countingBtn.addEventListener('click', () => showScreen('counting'));
backFromTimes.addEventListener('click', () => showScreen('home'));
backFromCounting.addEventListener('click', () => showScreen('home'));
backFromQuiz.addEventListener('click', goBackFromQuiz);

// Times tables setup
setupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const tables = document.getElementById('tables').value.trim().split(/\s+/).map(Number).filter(n => n > 0);
    const numProblems = parseInt(document.getElementById('num-problems').value, 10);
    if (!tables.length || isNaN(numProblems) || numProblems < 1) {
        alert('Please enter valid tables and number of problems.');
        return;
    }

    currentGame = 'times-tables';
    generateTimesTablesQuestions(tables, numProblems);
    startQuiz();
});

// Counting setup
countingSetupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const numProblems = parseInt(document.getElementById('counting-problems').value, 10);
    const maxCount = parseInt(document.getElementById('max-count').value, 10);
    if (isNaN(numProblems) || numProblems < 1 || isNaN(maxCount) || maxCount < 1) {
        alert('Please enter valid numbers.');
        return;
    }

    currentGame = 'counting';
    generateCountingQuestions(numProblems, maxCount);
    startQuiz();
});

// Answer submission
answerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const userAns = parseInt(answerInput.value.trim(), 10);
    const correctAns = questions[current].answer;

    if (userAns === correctAns) {
        correct++;
    } else {
        incorrect.push({
            idx: current + 1,
            question: questions[current].display,
            user: answerInput.value.trim(),
            correct: correctAns
        });
    }

    current++;
    showQuestion();
});

function showScreen(screen) {
    // Hide all screens
    homeScreen.style.display = 'none';
    timesTablesScreen.style.display = 'none';
    countingScreen.style.display = 'none';
    quizDiv.style.display = 'none';
    summaryDiv.style.display = 'none';

    // Show requested screen
    switch (screen) {
        case 'home':
            homeScreen.style.display = '';
            break;
        case 'times-tables':
            timesTablesScreen.style.display = '';
            break;
        case 'counting':
            countingScreen.style.display = '';
            break;
        case 'quiz':
            quizDiv.style.display = '';
            break;
        case 'summary':
            summaryDiv.style.display = '';
            break;
    }
}

function generateTimesTablesQuestions(tables, numProblems) {
    // Generate all possible questions
    let allQuestions = [];
    tables.forEach(table => {
        for (let i = 1; i <= 12; i++) {
            allQuestions.push({ a: table, b: i });
        }
    });

    // Shuffle and select questions
    questions = [];
    if (numProblems > allQuestions.length) {
        for (let i = 0; i < numProblems; i++) {
            questions.push(allQuestions[Math.floor(Math.random() * allQuestions.length)]);
        }
    } else {
        allQuestions = allQuestions.sort(() => Math.random() - 0.5);
        questions = allQuestions.slice(0, numProblems);
    }

    // Convert to question format
    questions = questions.map(q => {
        // Randomly swap a and b
        let [x, y] = Math.random() < 0.5 ? [q.a, q.b] : [q.b, q.a];
        return {
            display: `${x} × ${y} = ?`,
            answer: x * y,
            type: 'times-tables'
        };
    });
}

function generateCountingQuestions(numProblems, maxCount) {
    questions = [];
    const animalTypes = Object.keys(animals);

    for (let i = 0; i < numProblems; i++) {
        const count = Math.floor(Math.random() * maxCount) + 1;
        const animalType = animalTypes[Math.floor(Math.random() * animalTypes.length)];
        const animalEmojis = animals[animalType];

        questions.push({
            display: `Count the animals:`,
            answer: count,
            type: 'counting',
            animalType: animalType,
            animalEmojis: animalEmojis,
            count: count
        });
    }
}

function startQuiz() {
    current = 0;
    correct = 0;
    incorrect = [];
    startTime = Date.now();
    showScreen('quiz');
    showQuestion();
}

function showQuestion() {
    if (current >= questions.length) {
        showSummary();
        return;
    }

    progressDiv.textContent = `Question ${current + 1} of ${questions.length}`;
    const question = questions[current];

    if (question.type === 'times-tables') {
        questionDiv.textContent = question.display;
        countingDisplay.style.display = 'none';
    } else if (question.type === 'counting') {
        questionDiv.textContent = question.display;
        countingDisplay.style.display = '';
        displayAnimals(question);
    }

    answerInput.value = '';
    answerInput.focus();
}

function displayAnimals(question) {
    const { animalEmojis, count } = question;
    let html = '<div class="animal-grid">';

    for (let i = 0; i < count; i++) {
        const emoji = animalEmojis[Math.floor(Math.random() * animalEmojis.length)];
        html += `<span class="animal">${emoji}</span>`;
    }

    html += '</div>';
    countingDisplay.innerHTML = html;
}

function showSummary() {
    showScreen('summary');
    let html = `<h2>Session Complete!</h2>`;
    html += `<p>You got <b>${correct}</b> out of <b>${questions.length}</b> correct.</p>`;
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    html += `<p>Time taken: <b>${elapsed} seconds</b></p>`;

    if (incorrect.length) {
        html += `<h2>Incorrect Questions:</h2><ul>`;
        incorrect.forEach(q => {
            html += `<li>#${q.idx}: ${q.question} Your answer: <b>${q.user}</b> (correct: <b>${q.correct}</b>)</li>`;
        });
        html += `</ul>`;
    }

    html += `<button onclick="restart()">Play Again</button>`;
    summaryDiv.innerHTML = html;
}

function goBackFromQuiz() {
    if (currentGame === 'times-tables') {
        showScreen('times-tables');
    } else if (currentGame === 'counting') {
        showScreen('counting');
    } else {
        showScreen('home');
    }
}

function restart() {
    showScreen('home');
}
