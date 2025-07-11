// Multiplication Drills Web App
let questions = [];
let current = 0;
let correct = 0;
let incorrect = [];
let startTime = 0;

const setupForm = document.getElementById('setup-form');
const quizDiv = document.getElementById('quiz');
const questionDiv = document.getElementById('question');
const answerForm = document.getElementById('answer-form');
const answerInput = document.getElementById('answer');
const progressDiv = document.getElementById('progress');
const summaryDiv = document.getElementById('summary');

setupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // Parse tables
    const tables = document.getElementById('tables').value.trim().split(/\s+/).map(Number).filter(n => n > 0);
    const numProblems = parseInt(document.getElementById('num-problems').value, 10);
    if (!tables.length || isNaN(numProblems) || numProblems < 1) {
        alert('Please enter valid tables and number of problems.');
        return;
    }
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
    current = 0;
    correct = 0;
    incorrect = [];
    startTime = Date.now();
    setupForm.style.display = 'none';
    summaryDiv.style.display = 'none';
    quizDiv.style.display = '';
    showQuestion();
});

function showQuestion() {
    if (current >= questions.length) {
        showSummary();
        return;
    }
    progressDiv.textContent = `Question ${current + 1} of ${questions.length}`;
    const { a, b } = questions[current];
    // Randomly swap a and b
    let [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
    questionDiv.textContent = `${x} × ${y} = ?`;
    answerInput.value = '';
    answerInput.focus();
}

answerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const userAns = answerInput.value.trim();
    const { a, b } = questions[current];
    let [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
    const correctAns = x * y;
    if (parseInt(userAns, 10) === correctAns) {
        correct++;
    } else {
        incorrect.push({
            idx: current + 1,
            a: x,
            b: y,
            user: userAns,
            correct: correctAns
        });
    }
    current++;
    showQuestion();
});

function showSummary() {
    quizDiv.style.display = 'none';
    let html = `<h2>Session Complete!</h2>`;
    html += `<p>You got <b>${correct}</b> out of <b>${questions.length}</b> correct.</p>`;
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    html += `<p>Time taken: <b>${elapsed} seconds</b></p>`;
    if (incorrect.length) {
        html += `<h2>Incorrect Questions:</h2><ul>`;
        incorrect.forEach(q => {
            html += `<li>#${q.idx}: ${q.a} × ${q.b} = <b>${q.user}</b> (correct: <b>${q.correct}</b>)</li>`;
        });
        html += `</ul>`;
    }
    html += `<button onclick="restart()">Play Again</button>`;
    summaryDiv.innerHTML = html;
    summaryDiv.style.display = '';
}

function restart() {
    setupForm.style.display = '';
    summaryDiv.style.display = 'none';
    quizDiv.style.display = 'none';
}
