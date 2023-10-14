import "./style.css";
import { Questions } from "./questions.js";

const app = document.querySelector("#app");

const startbutton = document.querySelector("#start");

startbutton.addEventListener("click", startQuiz);

function startQuiz(event) {
  let currentQuestion = 0;
  let score = 0;

  displayQuestion(currentQuestion);

  function clear() {
    while (app.firstElementChild) {
      app.firstElementChild.remove();
    }
    const progress = displayProgressBar(Questions.length, currentQuestion);
    app.appendChild(progress);
  }

  function displayQuestion(index) {
    clear();
    const question = Questions[index];
    if (!question) {
      finishMessage();
      return;
    }

    const title = getTitleElement(question.question);
    app.appendChild(title);
    const answerDiv = createAnswer(question.answers);
    app.appendChild(answerDiv);
    const submitButton = getSubmitButton();
    submitButton.addEventListener("click", submit);
    app.appendChild(submitButton);
  }

  function finishMessage() {
    const h1 = document.createElement("h1");
    h1.innerText = " Bravo ! Tu as terminé le quiz";
    const p = document.createElement("p");
    p.innerText = `tu as eu ${score} sur ${Questions.length} point !`;
    app.appendChild(h1);
    app.appendChild(p);
  }

  function submit() {
    const selectedAnswer = app.querySelector('input[nane="answer"]:checked');
    disableAllInput();
    const value = selectedAnswer.value;
    const question = Questions[currentQuestion];
    const isCorrect = question.correct === value;
    //alert(`Submit ${isCorrect?"correct":"incorrect"}`);

    if (isCorrect) {
      score++;
    }

    showFeedback(isCorrect, question.correct, value);
    displayNextQuestionButon();
    const feedback = getFeedbackMessage(isCorrect, question.correct);
    app.appendChild(feedback);
  }

  function displayNextQuestionButon() {
    let TIMEOUT = 4000;
    let remainingTimeout = TIMEOUT;

    app.querySelector("button").remove();

    const nextButton = document.createElement("button");
    nextButton.innerText = `Next(${remainingTimeout / 1000}s)`;

    app.appendChild(nextButton);

    const interval = setInterval(() => {
      remainingTimeout = 1000;
      nextButton.innerText = `Next(${remainingTimeout / 1000}s)`;
    }, 1000);
    const timout = setTimeout(() => {
      handlenextQuestion();
    }, TIMEOUT);

    const handlenextQuestion = () => {
      clearInterval(interval);
      clearTimeout(timout);
      currentQuestion++;
      displayQuestion(currentQuestion);
    };

    nextButton.addEventListener("click", () => {
      handlenextQuestion();
    });
  }

  function createAnswer(answers) {
    const answerDiv = document.createElement("div");
    answerDiv.classList.add("answers");

    for (const answer of answers) {
      const label = getAnswerElement(answer);
      answerDiv.appendChild(label);
    }
    return answerDiv;
  }
}

function getTitleElement(text) {
  const title = document.createElement("h3");
  title.innerHTML = text;
  return title;
}
function formatIdText(text) {
  return text.replaceAll("", "-").replaceAll('"', "'").toLowerCase();
}
function getAnswerElement(text) {
  const label = document.createElement("label");
  label.innerText = text;
  const input = document.createElement("input");
  const id = formatIdText(text);
  input.id = id;
  label.htmlFor = id;
  input.setAttribute("type", "radio");
  input.setAttribute("nane", "answer");
  input.setAttribute("value", text);

  label.appendChild(input);

  return label;
}

function getSubmitButton() {
  const submitButton = document.createElement("button");
  submitButton.innerHTML = "Submit";
  return submitButton;
}

function showFeedback(isCorrect, correct, answer) {
  const correctAnswerId = formatIdText(correct);
  const correctElement = document.querySelector(
    `label[for="${correctAnswerId}"]`
  );
  const selectedAnswerId = formatIdText(answer);
  const selectedElement = document.querySelector(
    `label[for="${selectedAnswerId}"]`
  );

  /* if (isCorrect) {
    selectedElement.classList.add("correct");
  } else {
    selectedElement.classList.add("incorrect");
    correctElement.classList.add("correct");
  }*/

  correctElement.classList.add("correct");
  selectedElement.classList.add(isCorrect ? "correct" : "incorrect");
}

function getFeedbackMessage(isCorrect, correct) {
  const paragraph = document.createElement("p");
  paragraph.innerText = isCorrect
    ? "Bravo! Tu as eu la bonne reponse"
    : `Désolé... mais la bonne réponse était ${correct}`;

  return paragraph;
}

function displayProgressBar(max, value) {
  const progress = document.createElement("progress");
  progress.setAttribute("max", max);
  progress.setAttribute("value", value);
  return progress;
}

function disableAllInput() {
  const radioInputs = document.querySelectorAll('input[type="radio"]');
  for (const radio of radioInputs) {
    radio.disabled = true;
  }
}
