//select elements
let spanContainer = document.querySelector(".bullets_container");
let question = document.querySelector("h2");
let submitBtn = document.querySelector(".submit_btn");
let answersContainer = document.querySelector(".answers_container");
let QuizContainer = document.querySelector(".quiz_container");
let answersArray;
let result;
let currentQst = 0;
let rightAnswer = 0;
let inputArray;
let url;
let difficulty = document.querySelectorAll(".deffuclity input");
let selector = document.querySelectorAll("#selcters option");
let questDuration = document.querySelector(".qustDuration input");
let durationDiv = document.querySelector(".qustDuration  div");
let startQuizBtn = document.querySelector(".start_quiz");
let parameterSection = document.querySelector(".parameters");
let selecter = document.querySelectorAll("#selcters option");
let myRequest;
let duration;
let theDuration;
// display none to quiz section
QuizContainer.style.display = "none";

duration = parseInt(durationDiv.innerHTML);
theDuration = duration;

questDuration.oninput = function () {
  durationDiv.innerHTML = this.value + "s";
  duration = parseInt(durationDiv.innerHTML);
  theDuration = duration;
};
let cheakedCategory;

startQuizBtn.onclick = function () {
  let selectedDifficulty = null;
  let selectedCategory = null;
  // Set the difficulty
  for (let i = 0; i < difficulty.length; i++) {
    if (difficulty[i].checked) {
      selectedDifficulty = difficulty[i].dataset.def;
      break; // Exit the loop once found
    }
  }
  // Set the category
  for (let i = 0; i < selector.length; i++) {
    if (selector[i].selected) {
      selectedCategory = selector[i].value;
      cheakedCategory=selector[i].innerHTML;
      break; // Exit the loop once found
    }
  }

  // Build the URL
  if (selectedDifficulty && selectedCategory) {
    url = `https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=multiple`;
    // get data
    myRequest = new XMLHttpRequest();
    myRequest.open("GET", url);
    myRequest.send();
    myRequest.onreadystatechange = getData;

    // delete the parameter section
    parameterSection.remove();
    QuizContainer.style.display = "block";
  } else {
    let error_msg = document.querySelector(".parameters p");
    error_msg.style.display = "block";
  }
};

function getData() {
  if (this.readyState == 4 && this.status == 200) {
    result = JSON.parse(myRequest.responseText);
    // add bullets to document
    for (let i = 0; i < result.results.length; i++) {
      // create spans + append
      let span = document.createElement("span");
      spanContainer.appendChild(span);
    }

    //add on to the first bullet
    let spansArray = document.querySelectorAll(".bullets_container span");

    // add questions count
    let qcount = document.querySelector(".questions_count");
    qcount.innerHTML += `${
      result.results.length < 10
        ? "0" + result.results.length
        : result.results.length
    }`;
    //add category
    let category= document.querySelector('.category_container .category') ;
      category.innerHTML += `${cheakedCategory}`;
    // checked function
    let chosenOne;
    let trueAnswer;

    function checktrue() {
      let inputs = Array.from(document.querySelectorAll("input"));
      trueAnswer = result.results[currentQst].correct_answer;
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
          chosenOne = inputs[i].dataset.answer;
        }
      }
      if (chosenOne === trueAnswer) {
        spansArray[currentQst].className = "on";
        rightAnswer++;
      } else {
        spansArray[currentQst].className = "off";
      }
    }

    // sort the array items randomly
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // add question + answers to the dom
    function addItems() {
      // add the question to the dom
      question.innerHTML = result.results[currentQst].question;

      // add the answers to the dom
      answersArray = result.results[currentQst].incorrect_answers;
      trueAnswer = result.results[currentQst].correct_answer;
      answersArray.push(trueAnswer);
      shuffleArray(answersArray);
      answersArray.forEach((answer, index) => {
        let answerTemplate = `
            <section class="answer">       
                    <input type="radio" name="question" id="answer${
                      index + 1
                    } "  data-answer="${answer}">
                    <label for="answer${index + 1} ">${answer} </label>
            </section>  `;
        answersContainer.innerHTML += answerTemplate;
      });
    }
    addItems();

    //   the score function
    function getScore() {
      let theWord;
      let wordContainer = document.querySelector(".score span");
      let scoreContainer = document.querySelector(".score_container");
      scoreContainer.style.display = "block";

      if (rightAnswer === result.results.length) {
        theWord = "Perfect";
        wordContainer.className = "perfect";
      } else if (
        rightAnswer > `${result.results.length / 2}` &&
        rightAnswer < result.results.length
      ) {
        theWord = "Good";
        wordContainer.className = "good";
      } else {
        theWord = "Bad";
        wordContainer.className = "bad";
      }
      let scoreText = document.createTextNode(
        ` ! your score is ${rightAnswer} from ${result.results.length}`
      );

      //append the word to the span
      wordContainer.append(theWord);

      //append the span to the score
      let score = document.querySelector(".score");
      score.appendChild(scoreText);
    }

    //   try again function
    let againBtn = document.querySelector(".again_btn");
    againBtn.onclick = function () {
      window.location = "index.html";  // Directly link to index.html in the current directory
    };

    //the timer function

    let timerDom = document.querySelector(".timer");
    let timer;
    let timeWidth = document.querySelector(".timerWidthContainer");

    function timerFunction(duration) {
      let theAddedTime = 0;
      let minutes = parseInt(duration / 60);
      let secondes = parseInt(duration % 60);
      // Reset the timer width before starting
      timeWidth.style.width = "0%";
      timerDom.innerHTML = `${minutes < 10 ? `0${minutes}` : minutes}:${
        secondes < 10 ? `0${secondes}` : secondes
      }`;
      timer = setInterval(() => {
        duration--;
        theAddedTime++;
        timeWidth.style.width = `${(theAddedTime / theDuration) * 100}%`;
        minutes = parseInt(duration / 60);
        secondes = parseInt(duration % 60);
        // append timer to the dom
        timerDom.innerHTML = `${minutes < 10 ? `0${minutes}` : minutes}:${
          secondes < 10 ? `0${secondes}` : secondes
        }`;

        if (duration === 0) {
          clearInterval(timer);
          theAddedTime = 0;
          submitBtn.click();
        }
      }, 1000);
    }
    timerFunction(duration);

    // the submit function
    function clickBtn() {
      if (currentQst < result.results.length - 1) {
        checktrue();
        clearInterval(timer);
        timerFunction(duration);
        currentQst++;
        question.textContent = "";
        answersContainer.innerHTML = "";
        addItems();
      } else {
        checktrue();
        QuizContainer.remove();
        getScore();
      }
    }
  }
  submitBtn.onclick = clickBtn;
}

//the request end
