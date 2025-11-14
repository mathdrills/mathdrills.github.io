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
const sequencingScreen = document.getElementById('sequencing-screen');
const arithmeticScreen = document.getElementById('arithmetic-screen');
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
const sequencingBtn = document.getElementById('sequencing-btn');
const arithmeticBtn = document.getElementById('arithmetic-btn');
const backFromTimes = document.getElementById('back-from-times');
const backFromCounting = document.getElementById('back-from-counting');
const backFromSequencing = document.getElementById('back-from-sequencing');
const backFromArithmetic = document.getElementById('back-from-arithmetic');
const backFromQuiz = document.getElementById('back-from-quiz');

// Forms
const setupForm = document.getElementById('setup-form');
const countingSetupForm = document.getElementById('counting-setup-form');
const sequencingSetupForm = document.getElementById('sequencing-setup-form');
const arithmeticSetupForm = document.getElementById('arithmetic-setup-form');

// Animal emojis for counting game
const animals = {
    bears: ['🐻', '🧸', '🐨'],
    owls: ['🦉', '🦆'],
    wolves: ['🐺', '🦊', '🐕']
};

// Event listeners for navigation
timesTablesBtn.addEventListener('click', () => showScreen('times-tables'));
countingBtn.addEventListener('click', () => showScreen('counting'));
sequencingBtn.addEventListener('click', () => showScreen('sequencing'));
arithmeticBtn.addEventListener('click', () => showScreen('arithmetic'));
backFromTimes.addEventListener('click', () => showScreen('home'));
backFromCounting.addEventListener('click', () => showScreen('home'));
backFromSequencing.addEventListener('click', () => showScreen('home'));
backFromArithmetic.addEventListener('click', () => showScreen('home'));
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

// Sequencing setup
sequencingSetupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const numProblems = parseInt(document.getElementById('seq-problems').value, 10);
    let start = parseInt(document.getElementById('seq-start').value, 10);
    let end = parseInt(document.getElementById('seq-end').value, 10);
    const before = document.getElementById('seq-before').checked;
    const after = document.getElementById('seq-after').checked;

    if (isNaN(numProblems) || numProblems < 1 || isNaN(start) || isNaN(end)) {
        alert('Please enter valid numbers for sequencing.');
        return;
    }
    if (!before && !after) {
        alert('Please select at least one question type (Before or After).');
        return;
    }
    if (start > end) {
        // swap
        const t = start; start = end; end = t;
    }
    currentGame = 'sequencing';
    generateSequencingQuestions(numProblems, start, end, { before, after });
    startQuiz();
});

// Arithmetic setup
arithmeticSetupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const numProblems = parseInt(document.getElementById('arith-problems').value, 10);
    let start = parseInt(document.getElementById('arith-start').value, 10);
    let end = parseInt(document.getElementById('arith-end').value, 10);
    const add = document.getElementById('arith-add').checked;
    const sub = document.getElementById('arith-sub').checked;

    if (isNaN(numProblems) || numProblems < 1 || isNaN(start) || isNaN(end)) {
        alert('Please enter valid numbers for arithmetic.');
        return;
    }
    if (!add && !sub) {
        alert('Please select at least one operation type (Addition or Subtraction).');
        return;
    }
    if (start > end) {
        // swap
        const t = start; start = end; end = t;
    }
    currentGame = 'arithmetic';
    generateArithmeticQuestions(numProblems, start, end, { add, sub });
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
    sequencingScreen.style.display = 'none';
    arithmeticScreen.style.display = 'none';
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
        case 'sequencing':
            sequencingScreen.style.display = '';
            break;
        case 'arithmetic':
            arithmeticScreen.style.display = '';
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

function generateSequencingQuestions(numProblems, start, end, types) {
    questions = [];
    const availableTypes = [];
    if (types.before) availableTypes.push('before');
    if (types.after) availableTypes.push('after');

    for (let i = 0; i < numProblems; i++) {
        const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        let n = Math.floor(Math.random() * (end - start + 1)) + start;
        let display, answer;

        if (type === 'before') {
            if (n === start) n++; // Ensure we can ask for the number before
            display = `What number comes before ${n}?`;
            answer = n - 1;
        } else { // after
            if (n === end) n--; // Ensure we can ask for the number after
            display = `What number comes after ${n}?`;
            answer = n + 1;
        }

        questions.push({
            display: display,
            answer: answer,
            type: 'sequencing',
            value: n
        });
    }
}

function generateArithmeticQuestions(numProblems, start, end, types) {
    questions = [];
    const availableTypes = [];
    if (types.add) availableTypes.push('add');
    if (types.sub) availableTypes.push('sub');

    for (let i = 0; i < numProblems; i++) {
        const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        let n1 = Math.floor(Math.random() * (end - start + 1)) + start;
        let n2 = Math.floor(Math.random() * (end - start + 1)) + start;
        let display, answer;

        if (type === 'add') {
            display = `${n1} + ${n2} = ?`;
            answer = n1 + n2;
        } else { // sub
            if (n1 < n2) {
                // swap to avoid negative answers
                const t = n1; n1 = n2; n2 = t;
            }
            display = `${n1} - ${n2} = ?`;
            answer = n1 - n2;
        }

        questions.push({
            display: display,
            answer: answer,
            type: 'arithmetic'
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
    } else if (question.type === 'sequencing') {
        questionDiv.textContent = question.display;
        countingDisplay.style.display = 'none';
    } else if (question.type === 'arithmetic') {
        questionDiv.textContent = question.display;
        countingDisplay.style.display = 'none';
    } else if (question.type === 'arithmetic') {
        questionDiv.textContent = question.display;
        countingDisplay.style.display = 'none';
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
    } else if (currentGame === 'sequencing') {
        showScreen('sequencing');
    } else if (currentGame === 'arithmetic') {
        showScreen('arithmetic');
    } else {
        showScreen('home');
    }
}

function restart() {
    showScreen('home');
}
