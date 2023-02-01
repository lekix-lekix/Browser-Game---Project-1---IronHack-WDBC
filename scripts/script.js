const accuracyScore = {
  good: 10,
  bad: 0,
};

let score = 0;
let generatedDivArray = [];
let frames = 0;
let intervalId = null;

// Web Audio API

const audioContext = new AudioContext();

const audioKick = new Audio("./audio/Warehouse-Kickdrums-(7).wav");
const audioSnare = new Audio("./audio/909 Snare-(19).wav");
const audioHiHat = new Audio("./audio/909-Hihat- (3).wav");

const source = audioContext.createMediaElementSource(
  audioKick,
  audioSnare,
  audioHiHat
);

source.connect(audioContext.destination);

const keys = {
  ArrowLeft: 1,
  ArrowUp: 2,
  Arrowdown: 3,
  ArrowRight: 4,
};

// Selecting a random column to generate a note
// const randomColumn = function () {
//   const random = Math.floor(Math.random() * (5 - 1) + 1);
//   switch (random) {
//     case 1:
//       return "first";
//       break;
//     case 2:
//       return "second";
//       break;
//     case 3:
//       return "third";
//       break;
//     case 4:
//       return "fourth";
//       break;
//   }
// };

// Generating a div corresponding to a note to press
const generateDivNote = function (columnSelected) {
  const noteDiv = document.createElement("div");
  noteDiv.classList.add("div-test");
  noteDiv.dataset.column = columnSelected;
  console.log(noteDiv);
  document.getElementById(columnSelected).appendChild(noteDiv);
  generatedDivArray.push(noteDiv);
};

// Removing that div
const removeNote = function (noteToRemove) {
  noteToRemove.remove();
};

const notes = [
  {
    name: "cool stuff",
    frame: 480,
  },
];

const noteAudios = {
  noteName: "audioElement",
};

const noteObj = {
  20: "noteName",
};

// Moving the note down using setInterval (for now)
const moveNote = function () {
  if (intervalId) return;
  // const note = notesObj[frames];
  // if (note) {
  //   //display note
  // }
  // noteAudios[note].play();
  // let i = 0;
  let kickCount = 0;
  const kick = 30;
  const snare = 60;

  intervalId = setInterval(function movingNote() {
    if (frames % kick === 0) {
      generateDivNote("first");
      kickCount += kick;
    }
    // Snare
    if (frames % snare === 0 && frames !== 0) {
      generateDivNote("second");
    }
    // Hi-hat
    if (frames === kickCount - 15) {
      generateDivNote("third");
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
  switch (div.dataset.column) {
    case "first":
      return 1;
    case "second":
      return 2;
    case "third":
      return 3;
    case "fourth":
      return 4;
  }
};

// Printing accuracy
const printAccuracy = function (scoreValue) {
  const accuracyPanel = document.querySelector("p");
  if (scoreValue === 0) {
    accuracyPanel.textContent = "OK !";
    // console.log("OK !");
  } else {
    accuracyPanel.textContent = "BAD !";
    // console.log("BAD !");
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

// Converting key pressed to a number (1 - 4)
const detectKeyPressed = function (keyPressed) {
  switch (keyPressed) {
    case "ArrowLeft":
      audioKick.play();
      return 1;
    case "ArrowUp":
      audioSnare.play();
      return 2;
    case "ArrowDown":
      audioHiHat.play();
      return 3;
    case "ArrowRight":
      playSample(4);
      return 4;
  }
};

// Stopping and resetting audio
const stopReset = function (keyPressed) {
  switch (keyPressed) {
    case "ArrowLeft":
      audioKick.pause();
      audioKick.currentTime = 0;
    case "ArrowUp":
      audioSnare.pause();
      audioSnare.currentTime = 0;
    case "ArrowDown":
      audioHiHat.pause();
      audioHiHat.currentTime = 0;
  }
};

// Playing samples

// const playSample = function (keyPressed) {
//   const kickAudio = new Audio("../audio/AR-Tech-Kicks-1-(57).wav");
//   const snareAudio = new Audio("../audio/909 Snare-(19).wav");
//   const hiHatAudio = new Audio("../audio/909-Hihat- (3).wav");

//   switch (keyPressed) {
//     case 1:
//       kickAudio.play();
//     case 2:
//       snareAudio.play();
//     case 3:
//       hiHatAudio.play();
//   }
// };

// Event listeners

document.querySelector("button").addEventListener("click", function () {
  moveNote();
});

window.addEventListener("keydown", (event) => {
  highlightSquare(event.key);
  checkAccuracy(detectKeyPressed(event.key));
});

window.addEventListener("keyup", (event) => {
  stopReset(event.key);
  unHighlight(event.key);
});
