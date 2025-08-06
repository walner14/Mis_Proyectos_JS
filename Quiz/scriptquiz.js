const quizData = [
  {
    question: "¿Qué tipo de lenguaje es JavaScript?",
    options: ["Compilado", "Interpretado", "Ambos", "Ninguno"],
    answer: "Interpretado"
  },
  {
    question: "¿Cómo se declara una variable en JavaScript?",
    options: ["var", "let", "const", "Todas son correctas"],
    answer: "Todas son correctas"
  },
  {
    question: "¿Cuál es el resultado de '2' + 2 en JavaScript?",
    options: ["4", "22", "NaN", "undefined"],
    answer: "22"
  },
  {
    question: "¿Qué método se utiliza para parsear JSON en JavaScript?",
    options: ["JSON.parse()", "JSON.stringify()", "JSON.toString()", "JSON.convert()"],
    answer: "JSON.parse()"
  },
  {
    question: "¿Qué simboliza el operador === en JavaScript?",
    options: ["Igualdad débil", "Igualdad estricta", "Asignación", "Concatenación"],
    answer: "Igualdad estricta"
  },
  {
    question: "¿Qué devuelve typeof []?",
    options: ["array", "object", "list", "undefined"],
    answer: "object"
  },
  {
    question: "¿Cómo se define una función anónima?",
    options: ["function() {}", "anon() {}", "function:anon() {}", "def() {}"],
    answer: "function() {}"
  },
  {
    question: "¿Qué método añade un elemento al final de un array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: "push()"
  },
  {
    question: "¿Cuál de estos NO es un tipo de dato primitivo en JavaScript?",
    options: ["String", "Number", "Boolean", "Array"],
    answer: "Array"
  },
  {
    question: "¿Qué palabra clave se usa para crear una clase?",
    options: ["class", "object", "function", "constructor"],
    answer: "class"
  }
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next");
const retryBtn = document.getElementById("retry");
const resultEl = document.getElementById("result");
const soundCorrect = document.getElementById("sound-correct");
const soundWrong = document.getElementById("sound-wrong");
const soundNext = document.getElementById("sound-next");
const progressEl = document.getElementById("progress-bar");

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
  const q = quizData[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";

  const shuffledOptions = shuffleArray([...q.options]); // Mezclar opciones

  shuffledOptions.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(btn, q.answer);
    optionsEl.appendChild(btn);
  });

  updateProgress();
}

function selectAnswer(button, correct) {
  const allButtons = optionsEl.querySelectorAll("button");
  allButtons.forEach(btn => btn.disabled = true);
  if (button.textContent === correct) {
    button.style.backgroundColor = "#2ecc71";
    feedbackEl.textContent = "✅ ¡Correcto!";
    soundCorrect.play();
    score++;
  } else {
    button.style.backgroundColor = "#e74c3c";
    feedbackEl.textContent = `❌ Incorrecto. Respuesta: ${correct}`;
    soundWrong.play();
  }
}

nextBtn.addEventListener("click", () => {
  soundNext.play();
  if (currentQuestion < quizData.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    showResult();
  }
});

retryBtn.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;

  // 🌀 Si quieres mezclar el orden de las preguntas también, descomenta esta línea:
  // quizData.sort(() => Math.random() - 0.5);

  loadQuestion();
  resultEl.classList.add("hide");
  retryBtn.classList.add("hide");
  nextBtn.classList.remove("hide");
});

function showResult() {
  questionEl.textContent = '';
  optionsEl.innerHTML = '';
  feedbackEl.textContent = '';
  nextBtn.classList.add('hide');
  retryBtn.classList.remove('hide');
  progressEl.style.width = '100%';

  const percentage = (score / quizData.length) * 100;
  let message = '';
  const animationContainer = document.getElementById('animation-container');
  animationContainer.innerHTML = '';

  document.getElementById('sound-fireworks').pause();
  document.getElementById('sound-applause').pause();
  document.getElementById('sound-sad').pause();
  document.getElementById('sound-fireworks').currentTime = 0;
  document.getElementById('sound-applause').currentTime = 0;
  document.getElementById('sound-sad').currentTime = 0;

  if (percentage === 100) {
    message = '🎉 ¡Perfecto!';
    launchFireworks();
    document.getElementById('sound-fireworks').play();
  } else if (percentage >= 70) {
    message = '¡Buen trabajo!';
    launchConfetti();
    document.getElementById('sound-applause').play();
  } else {
    message = '¡Intenta nuevamente!';
    showSadEmoji();
    document.getElementById('sound-sad').play();
  }

  resultEl.innerHTML = `
    <p>Tu puntuación: ${score}/${quizData.length}</p>
    <p>${message}</p>
  `;
  resultEl.classList.remove('hide');
}

function updateProgress() {
  const progress = ((currentQuestion) / quizData.length) * 100;
  progressEl.style.width = `${progress}%`;
}

document.addEventListener("DOMContentLoaded", loadQuestion);

function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function launchFireworks() {
  const container = document.getElementById('animation-container');
  for (let i = 0; i < 15; i++) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.top = `${Math.random() * 100}%`;
    firework.style.left = `${Math.random() * 100}%`;
    container.appendChild(firework);

    setTimeout(() => {
      firework.remove();
    }, 1000);
  }
}

function showSadEmoji() {
  const container = document.getElementById('animation-container');
  const emoji = document.createElement('div');
  emoji.textContent = '😢';
  emoji.style.position = 'absolute';
  emoji.style.fontSize = '60px';
  emoji.style.top = '50%';
  emoji.style.left = '50%';
  emoji.style.transform = 'translate(-50%, -50%)';
  emoji.style.animation = 'fadeOut 2s forwards';
  container.appendChild(emoji);

  setTimeout(() => {
    emoji.remove();
  }, 2000);
}
