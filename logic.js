// Select elements
let count = document.querySelector(".count");
let circle = document.querySelector(".circle-progress svg circle");
let content = document.querySelector(".content");

// Set Options
let currentIndex = 0;
let countRightAnswer = 0;
let countWrongAnswer = 0;
let selectedQuestions = [];

// Function to fetch questions from JSON files
function getQuestions() {
  let myReq = new XMLHttpRequest();

  myReq.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let responseObject = JSON.parse(this.responseText);
      countQuestions(responseObject.questions.length);
      if (currentIndex < responseObject.questions.length) {
        addQuestionsData(responseObject.questions[currentIndex]);
        checkAnswer(responseObject.questions[currentIndex]);
      } else {
        printWrongAnswers();
        printTestResult();
      }
    }
  };

  // Determine the JSON file URL based on the document title
  let requestUrl = "";
  switch (document.title) {
    case "Html Questions":
      requestUrl = "../questions/html.json";
      break;
    case "Css Questions":
      requestUrl = "../questions/css.json";
      break;
    case "JavaScript Questions":
      requestUrl = "../questions/javascript.json";
      break;
    case "General Questions":
      requestUrl = "../questions/general-questions.json";
      break;
    default:
      requestUrl = "";
  }
  myReq.open("GET", requestUrl, true);
  myReq.send();
}

// Function to display remaining question count
function countQuestions(num) {
  let totalQuestions = num;
  let currentQuestions = currentIndex;
  count.textContent = `${currentQuestions}/${totalQuestions}`;
  circle.style.strokeDashoffset = 440 * (1 - currentQuestions / totalQuestions);
}

// Function to add question data to the page element
function addQuestionsData(q) {
  content.innerHTML = `
    <div class="question">
      <h1>${q.question}</h1>
      <div class="answer">
        <p>A: ${q.options["A"]}</p>
        <p>B: ${q.options["B"]}</p>
        <p>C: ${q.options["C"]}</p>
        <p>D: ${q.options["D"]}</p>
      </div>
    </div>
  `;
}

// Function to check the selected answer against the correct answer
function checkAnswer(q) {
  let pAnswer = document.querySelectorAll(".question .answer p");

  pAnswer.forEach((chooesAnswer) => {
    chooesAnswer.onclick = function () {
      let rightAnswer = q.answer;
      currentIndex++;
      if (rightAnswer == chooesAnswer.textContent[0]) {
        countRightAnswer += 1;
        chooesAnswer.style.outline = "3px solid greenyellow";
        selectedQuestions.push([
          q.question,
          chooesAnswer.textContent,
          q.options[rightAnswer],
          true,
        ]);
      } else {
        countWrongAnswer += 1;
        chooesAnswer.style.outline = "3px solid red";
        selectedQuestions.push([
          q.question,
          chooesAnswer.textContent,
          q.options[rightAnswer],
          false,
        ]);
      }

      setTimeout(() => {
        getQuestions();
      }, 300);
    };
  });
}

// Function to print the wrong answers
function printWrongAnswers() {
  let wrongAnswersContainer = document.createElement("div");
  wrongAnswersContainer.className = "wrong";
  selectedQuestions.forEach((q, index) => {
    if (!q[3]) {
      let questionDiv = document.createElement("div");
      questionDiv.className = "question-wrong";

      let questionIndex = document.createElement("h2");
      questionIndex.textContent = `${index + 1}. ${q[0]}`;

      let yourAnswer = document.createElement("p");
      yourAnswer.textContent = `Your Answer: ${q[1]}`;

      let correctAnswer = document.createElement("p");
      correctAnswer.innerHTML = `Correct Answer: ${q[2]}`;

      questionDiv.appendChild(questionIndex);
      questionDiv.appendChild(yourAnswer);
      questionDiv.appendChild(correctAnswer);

      wrongAnswersContainer.appendChild(questionDiv);
    }
  });

  content.innerHTML = ""; // Clear previous content
  content.className = "content-wrong";
  content.appendChild(wrongAnswersContainer);
}

// Function to print the test result
function printTestResult() {
  let percentage = Math.round(
    (countRightAnswer / selectedQuestions.length) * 100
  );

  let resultHTML = `
  <div class="result">
    <h2>The Result Test In ${document.title}</h2>
      <div class="conclusion">
      <p>Total Questions: ${selectedQuestions.length}</p>
      <p>Percentage: ${percentage}%</p>
        <p>Correct Answers: ${countRightAnswer}</p>
        <p>Wrong Answers: ${countWrongAnswer}</p>
      </div>
  </div>
  `;

  content.innerHTML += resultHTML;
}

// Call the main function to get questions
getQuestions();
