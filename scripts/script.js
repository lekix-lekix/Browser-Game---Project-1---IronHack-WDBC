const accuracyScore = {
  good: 10,
  bad: 0,
};

let score = 0;
let generatedDivArray = [];
let frames = 0;
let intervalId = null;

const keys = {
  ArrowLeft: 1,
  ArrowUp: 2,
  Arrowdown: 3,
  ArrowRight: 4,
};

// Selecting a random column to generate a note
const randomColumn = function () {
  const random = Math.floor(Math.random() * (5 - 1) + 1);
  switch (random) {
    case 1:
      return "first";
      break;
    case 2:
      return "second";
      break;
    case 3:
      return "third";
      break;
    case 4:
      return "fourth";
      break;
  }
};

// Generating a div corresponding to a note to press
const generateDivNote = function (columnSelected = randomColumn()) {
  // const columnSelected = randomColumn();
  const randomDiv = document.createElement("div");

  randomDiv.classList.add("div-test");
  document.getElementById(columnSelected).appendChild(randomDiv);

  generatedDivArray.push(randomDiv);
};

// Removing that div
const removeNote = function (noteToRemove) {
  noteToRemove.remove();
  //document.querySelector(".div-test").remove();
};
const notes = [
  {
    name: "cool stuff",
    frame: 480,
  },
];

// Moving the note down using setInterval (for now)
const moveNote = function () {
  // let i = 0;
  intervalId = setInterval(function movingNote() {
    if (frames % 30 === 0) {
      generateDivNote();
    }
    for (const note of generatedDivArray) {
      const noteStyle = getComputedStyle(note);
      let topValue = parseInt(noteStyle.getPropertyValue("top"));

      note.style.top = `${topValue + 4}px`;
      if (topValue >= 600) {
        if (!note.dataset.hit) {
          // remove points
        }
        removeNote(note); // Will be collider detection in the future
      }
    }
    frames++;

    // i++;
    // console.log(note.style.top)
  }, 1000 / 60);
};

// Selecting random times to generate a note, for now
const random = function () {};

// Highlighting a square upon keystroke
const highlightSquare = function (keyPressed) {
  console.log(keyPressed);
  switch (keyPressed) {
    case "ArrowLeft":
      document.querySelector(".one").classList.add("highlight");
      break;
    case "ArrowUp":
      document.querySelector(".two").classList.add("highlight");
      break;
    case "ArrowDown":
      document.querySelector(".three").classList.add("highlight");
      break;
    case "ArrowRight":
      document.querySelector(".four").classList.add("highlight");
      break;
  }
};

// Removing the highlight when keyup
const unHighlight = function (keyPressed) {
  console.log(keyPressed);
  switch (keyPressed) {
    case "ArrowLeft":
      document.querySelector(".one").classList.remove("highlight");
      break;
    case "ArrowUp":
      document.querySelector(".two").classList.remove("highlight");
      break;
    case "ArrowDown":
      document.querySelector(".three").classList.remove("highlight");
      break;
    case "ArrowRight":
      document.querySelector(".four").classList.remove("highlight");
      break;
  }
};

// Detecting accuracy + key and columns comparison + firing score incrementing / printing (too much)
const checkAccuracy = function (keyPressed) {
  //   const divOnSquare = generatedDivArray.some((div) => isOnSquare(div));
  //   if (generatedDivArray.length < 1) return;
  //   if (
  //     divOnSquare &&
  //     keyPressed === detectColumn(generatedDivArray.find((div) => isOnSquare()))
  //   ) {
  //     // console.log(generatedDivArray[keys[keyPressed]]);
  //     // console.log(keys[keyPressed]);
  //     printAccuracy(0);
  //     scoreIncrement();
  //     generatedDivArray = generatedDivArray.filter((div) => !isOnSquare(div));
  //   } else {
  //     printAccuracy(1);
  //   }
  // };
  let j = 0;
  while (j < generatedDivArray.length) {
    if (
      isOnSquare(generatedDivArray[j]) &&
      keyPressed === detectColumn(generatedDivArray[j])
    ) {
      printAccuracy(0);
      scoreIncrement();
      generatedDivArray[j].dataset.hit = true;
      generatedDivArray.filter((div) => !isOnSquare(div));
    } else {
      printAccuracy(1);
    }
    j++;
  }
};

// Is there a div passing on the buttons ?
const isOnSquare = function (div) {
  if (
    div.getBoundingClientRect().bottom >= 400 &&
    div.getBoundingClientRect().bottom <= 500
  )
    return true;
  else return false;
};

// Detect column
const detectColumn = function (div) {
  if (
    div.getBoundingClientRect().x >= 74 &&
    div.getBoundingClientRect().x <= 76
  ) {
    return 1;
  } else if (
    div.getBoundingClientRect().x >= 213 &&
    div.getBoundingClientRect().x <= 215
  ) {
    return 2;
  } else if (
    div.getBoundingClientRect().x >= 353 &&
    div.getBoundingClientRect().x <= 355
  ) {
    return 3;
  } else {
    return 4;
  }
};

// Checking if the column of the div matches the key pressed
const detectKeyPressed = function (keyPressed) {
  switch (keyPressed) {
    case "ArrowLeft":
      return 1;
    case "ArrowUp":
      return 2;
    case "ArrowDown":
      return 3;
    case "ArrowRight":
      return 4;
  }
};

// Printing accuracy
const printAccuracy = function (scoreValue) {
  const accuracyPanel = document.querySelector("p");
  if (scoreValue === 0) {
    accuracyPanel.textContent = "OK !";
    console.log("OK !");
  } else {
    accuracyPanel.textContent = "BAD !";
    console.log("BAD !");
  }
};

// Counting score
const scoreIncrement = function () {
  score += 10;
  scorePrint();
};

// Printing score
const scorePrint = function () {
  document.querySelector(".score").textContent = `${score}`;
};

// Event listeners

document.querySelector("button").addEventListener("click", function () {
  moveNote();
});

window.addEventListener("keydown", (event) => {
  highlightSquare(event.key);
  checkAccuracy(detectKeyPressed(event.key));
});

window.addEventListener("keyup", (event) => {
  unHighlight(event.key);
});
