const views = {
  learn: document.getElementById("learnView"),
  select: document.getElementById("selectView"),
  rewrite: document.getElementById("rewriteView"),
  quiz: document.getElementById("quizView")
};

const modeButtons = document.querySelectorAll(".mode-btn");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const bestScoreText = document.getElementById("bestScoreText");
const resetProgressBtn = document.getElementById("resetProgressBtn");

const selectQuestion = document.getElementById("selectQuestion");
const selectOptions = document.getElementById("selectOptions");
const selectFeedback = document.getElementById("selectFeedback");
const selectNextBtn = document.getElementById("selectNextBtn");

const rewriteQuestion = document.getElementById("rewriteQuestion");
const rewriteAnswerOne = document.getElementById("rewriteAnswerOne");
const rewriteAnswerTwo = document.getElementById("rewriteAnswerTwo");
const checkRewriteBtn = document.getElementById("checkRewriteBtn");
const rewriteNextBtn = document.getElementById("rewriteNextBtn");
const rewriteFeedback = document.getElementById("rewriteFeedback");

const quizArea = document.getElementById("quizArea");
const submitQuizBtn = document.getElementById("submitQuizBtn");
const restartQuizBtn = document.getElementById("restartQuizBtn");
const quizFeedback = document.getElementById("quizFeedback");

const storageKey = "doubleNegativesProgressV1";

let progress = loadProgress();
let selectIndex = 0;
let rewriteIndex = 0;

const selectExercises = [
  {
    sentence: "Our team never forgets ___ before a presentation.",
    options: ["nothing", "anything"],
    correct: "anything",
    explanation: "Use 'anything' because the sentence already has 'never'."
  },
  {
    sentence: "I can’t find my notes ___.",
    options: ["nowhere", "anywhere"],
    correct: "anywhere",
    explanation: "Use 'anywhere' because 'can’t' already makes the sentence negative."
  },
  {
    sentence: "She wouldn’t accept ___ excuses.",
    options: ["no", "any"],
    correct: "any",
    explanation: "Use 'any' after 'wouldn’t' to avoid a double negative."
  },
  {
    sentence: "The students didn’t ask ___ questions.",
    options: ["no", "any"],
    correct: "any",
    explanation: "Use 'any' because 'didn’t' is already negative."
  },
  {
    sentence: "He never tells ___ about the surprise.",
    options: ["nobody", "anybody"],
    correct: "anybody",
    explanation: "Use 'anybody' because 'never' already gives the negative meaning."
  },
  {
    sentence: "We haven’t seen ___ unusual today.",
    options: ["nothing", "anything"],
    correct: "anything",
    explanation: "Use 'anything' after 'haven’t'."
  },
  {
    sentence: "They aren’t going ___ after class.",
    options: ["nowhere", "anywhere"],
    correct: "anywhere",
    explanation: "Use 'anywhere' because 'aren’t' is the negative word."
  },
  {
    sentence: "My sister didn’t invite ___ from that group.",
    options: ["nobody", "anybody"],
    correct: "anybody",
    explanation: "Use 'anybody' after 'didn’t'."
  }
];

const rewriteExercises = [
  {
    original: "Max shouldn’t never ignore the instructions.",
    answerOne: "Max shouldn’t ever ignore the instructions.",
    answerTwo: "Max should never ignore the instructions.",
    explanation: "Correct it with 'shouldn’t ever' or with 'should never'."
  },
  {
    original: "We haven’t received nothing from the office.",
    answerOne: "We haven’t received anything from the office.",
    answerTwo: "We have received nothing from the office.",
    explanation: "Use 'haven’t...anything' or 'have...nothing'."
  },
  {
    original: "The keys weren’t nowhere on the table.",
    answerOne: "The keys weren’t anywhere on the table.",
    answerTwo: "The keys were nowhere on the table.",
    explanation: "Use 'weren’t anywhere' or 'were nowhere'."
  },
  {
    original: "I didn’t ask nobody for help.",
    answerOne: "I didn’t ask anybody for help.",
    answerTwo: "I asked nobody for help.",
    explanation: "Use 'didn’t...anybody' or 'asked nobody'."
  },
  {
    original: "The visitors don’t want no publicity.",
    answerOne: "The visitors don’t want any publicity.",
    answerTwo: "The visitors want no publicity.",
    explanation: "Use 'don’t...any' or 'want no'."
  },
  {
    original: "The committee didn’t choose nobody today.",
    answerOne: "The committee didn’t choose anybody today.",
    answerTwo: "The committee chose nobody today.",
    explanation: "Use 'didn’t...anybody' or 'chose nobody'."
  }
];

const quizQuestions = [
  {
    type: "choice",
    prompt: "Choose the correct sentence.",
    options: [
      "I don’t need no pencil.",
      "I don’t need any pencil.",
      "I don’t need nothing."
    ],
    correct: "I don’t need any pencil.",
    explanation: "After 'don’t', use a positive form such as 'any'."
  },
  {
    type: "choice",
    prompt: "Choose the corrected version.",
    options: [
      "She never said anything about the meeting.",
      "She never said nothing about the meeting.",
      "She didn’t never say anything about the meeting."
    ],
    correct: "She never said anything about the meeting.",
    explanation: "Use one negative word: 'never'."
  },
  {
    type: "choice",
    prompt: "Which sentence avoids a double negative?",
    options: [
      "We haven’t found anything.",
      "We haven’t found nothing.",
      "We didn’t find nothing."
    ],
    correct: "We haven’t found anything.",
    explanation: "The negative verb pairs with 'anything'."
  },
  {
    type: "choice",
    prompt: "Choose the correct correction for: They aren’t going nowhere.",
    options: [
      "They aren’t going anywhere.",
      "They aren’t going nowhere.",
      "They don’t aren’t going anywhere."
    ],
    correct: "They aren’t going anywhere.",
    explanation: "Use 'anywhere' after 'aren’t'."
  },
  {
    type: "choice",
    prompt: "Choose the sentence with only one negative meaning.",
    options: [
      "I can’t tell nobody.",
      "I can’t tell anybody.",
      "I can’t never tell anybody."
    ],
    correct: "I can’t tell anybody.",
    explanation: "Use 'can’t' with 'anybody'."
  },
  {
    type: "choice",
    prompt: "Choose the correct alternative.",
    options: [
      "The report contains no errors.",
      "The report doesn’t contain no errors.",
      "The report doesn’t contain none errors."
    ],
    correct: "The report contains no errors.",
    explanation: "This version uses one negative word: 'no'."
  }
];

function init() {
  modeButtons.forEach(button => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  selectNextBtn.addEventListener("click", nextSelect);
  checkRewriteBtn.addEventListener("click", checkRewrite);
  rewriteNextBtn.addEventListener("click", nextRewrite);
  submitQuizBtn.addEventListener("click", submitQuiz);
  restartQuizBtn.addEventListener("click", renderQuiz);
  resetProgressBtn.addEventListener("click", resetProgress);

  renderSelectExercise();
  renderRewriteExercise();
  renderQuiz();
  renderProgress();
}

function setMode(mode) {
  Object.entries(views).forEach(([key, view]) => {
    view.classList.toggle("active-view", key === mode);
  });

  modeButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
}

function renderSelectExercise() {
  const exercise = selectExercises[selectIndex];

  selectQuestion.innerHTML = `<p class="sentence">${exercise.sentence}</p>`;
  selectOptions.innerHTML = "";
  selectFeedback.className = "feedback";
  selectFeedback.textContent = "Selecciona una opción.";

  exercise.options.forEach(option => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => checkSelectAnswer(button, option, exercise));
    selectOptions.appendChild(button);
  });
}

function checkSelectAnswer(button, option, exercise) {
  const allButtons = selectOptions.querySelectorAll("button");

  allButtons.forEach(btn => {
    btn.disabled = true;

    if (btn.textContent === exercise.correct) {
      btn.classList.add("correct");
    }
  });

  if (option === exercise.correct) {
    button.classList.add("correct");
    selectFeedback.className = "feedback success";
    selectFeedback.textContent = `Correcto. ${exercise.explanation}`;
    registerAttempt(true);
  } else {
    button.classList.add("wrong");
    selectFeedback.className = "feedback error";
    selectFeedback.textContent = `Incorrecto. La respuesta correcta es "${exercise.correct}". ${exercise.explanation}`;
    registerAttempt(false);
  }
}

function nextSelect() {
  selectIndex = (selectIndex + 1) % selectExercises.length;
  renderSelectExercise();
}

function renderRewriteExercise() {
  const exercise = rewriteExercises[rewriteIndex];

  rewriteQuestion.innerHTML = `<p class="sentence">${exercise.original}</p>`;
  rewriteAnswerOne.value = "";
  rewriteAnswerTwo.value = "";
  rewriteFeedback.className = "feedback";
  rewriteFeedback.textContent = "Escribe dos formas correctas de la oración.";
}

function checkRewrite() {
  const exercise = rewriteExercises[rewriteIndex];
  const userOne = normalize(rewriteAnswerOne.value);
  const userTwo = normalize(rewriteAnswerTwo.value);
  const expectedOne = normalize(exercise.answerOne);
  const expectedTwo = normalize(exercise.answerTwo);

  const hasFirst = userOne === expectedOne || userTwo === expectedOne;
  const hasSecond = userOne === expectedTwo || userTwo === expectedTwo;
  const correct = hasFirst && hasSecond;

  if (correct) {
    rewriteFeedback.className = "feedback success";
    rewriteFeedback.innerHTML = `Correcto.<br>${exercise.explanation}`;
    registerAttempt(true);
    return;
  }

  rewriteFeedback.className = "feedback warning";
  rewriteFeedback.innerHTML = `
    Revisa tu respuesta.<br>
    Corrección 1: <strong>${exercise.answerOne}</strong><br>
    Corrección 2: <strong>${exercise.answerTwo}</strong><br>
    ${exercise.explanation}
  `;
  registerAttempt(false);
}

function nextRewrite() {
  rewriteIndex = (rewriteIndex + 1) % rewriteExercises.length;
  renderRewriteExercise();
}

function renderQuiz() {
  quizArea.innerHTML = "";
  quizFeedback.className = "feedback";
  quizFeedback.textContent = "Contesta todas las preguntas y presiona Calificar quiz.";

  quizQuestions.forEach((question, index) => {
    const card = document.createElement("article");
    card.className = "quiz-question";

    const options = question.options.map(option => {
      return `
        <label>
          <input type="radio" name="quiz-${index}" value="${escapeHtml(option)}">
          <span>${option}</span>
        </label>
      `;
    }).join("");

    card.innerHTML = `
      <h3>Pregunta ${index + 1}</h3>
      <p>${question.prompt}</p>
      <div class="quiz-options">${options}</div>
    `;

    quizArea.appendChild(card);
  });
}

function submitQuiz() {
  let score = 0;
  const details = [];

  quizQuestions.forEach((question, index) => {
    const selected = document.querySelector(`input[name="quiz-${index}"]:checked`);
    const answer = selected ? selected.value : "";
    const correct = answer === question.correct;

    if (correct) {
      score++;
    }

    details.push({
      number: index + 1,
      correct,
      answer,
      expected: question.correct,
      explanation: question.explanation
    });
  });

  const percentage = Math.round((score / quizQuestions.length) * 100);
  const detailHtml = details.map(item => {
    const status = item.correct ? "✅" : "❌";
    return `${status} Pregunta ${item.number}: ${item.correct ? "correcta" : `respuesta correcta: ${item.expected}`}. ${item.explanation}`;
  }).join("<br>");

  quizFeedback.className = percentage >= 70 ? "feedback success" : "feedback warning";
  quizFeedback.innerHTML = `
    Puntaje: <strong>${score}/${quizQuestions.length}</strong> (${percentage}%).<br><br>
    ${detailHtml}
  `;

  progress.bestScore = Math.max(progress.bestScore, percentage);
  saveProgress();
  renderProgress();
}

function registerAttempt(correct) {
  progress.attempts += 1;

  if (correct) {
    progress.correct += 1;
  }

  saveProgress();
  renderProgress();
}

function renderProgress() {
  const percent = progress.attempts === 0
    ? 0
    : Math.round((progress.correct / progress.attempts) * 100);

  progressText.textContent = progress.attempts === 0
    ? "Sin intentos todavía."
    : `Aciertos de práctica: ${progress.correct}/${progress.attempts} (${percent}%).`;

  progressBar.style.width = `${percent}%`;
  bestScoreText.textContent = `Mejor puntaje de quiz: ${progress.bestScore}%`;
}

function resetProgress() {
  progress = { attempts: 0, correct: 0, bestScore: 0 };
  saveProgress();
  renderProgress();
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(storageKey);

    if (!saved) {
      return { attempts: 0, correct: 0, bestScore: 0 };
    }

    return JSON.parse(saved);
  } catch (error) {
    return { attempts: 0, correct: 0, bestScore: 0 };
  }
}

function saveProgress() {
  localStorage.setItem(storageKey, JSON.stringify(progress));
}

function normalize(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:]/g, "")
    .replace(/\s+/g, " ");
}

function escapeHtml(text) {
  return text.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

init();
