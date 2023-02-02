const accuracyScore = {
  good: 10,
  bad: 0,
};

// Audio samples imported

const drums = new Howl({
  src: ["./audio/samples.webm", "./audio/samples.mp3"],
  sprite: {
    // bass: [0, 3839.4104308390024],
    "hi-hat": [5000, 147.3015873015875],
    kick: [7000, 382.7664399092967],
    snare: [9000, 351.56462585034024],
  },
});

let score = 0;
let generatedDivArray = [];
let frames = 0;
let intervalId = null;

// Sheet music
const sheetKick = {
  0: true,
  120: false,
  200: true,
  400: false,
};

const sheetSnare = {
  0: false,
};

const sheetHiHat = {
  0: false,
};

const keys = {
  ArrowLeft: 1,
  ArrowUp: 2,
  Arrowdown: 3,
  ArrowRight: 4,
};

// Generating a div corresponding to a note to press
const generateDivNote = function (columnSelected) {
  const noteDiv = document.createElement("div");
  noteDiv.classList.add("div-note");
  noteDiv.dataset.column = columnSelected;
  document.getElementById(columnSelected).appendChild(noteDiv);
  generatedDivArray.push(noteDiv);
};

// Removing that div
const removeNote = function (noteToRemove) {
  noteToRemove.remove();
};

// Activating Kick
const kickStart = function (frames) {
  for (frameBool in sheetKick) {
    console.log(`${frameBool} :${sheetKick[frameBool]}`);
    if (Number(frameBool) === frames) {
      return true;
    }
  }
};

// Activating Snare
const snareStart = function (frames) {
  for (frameBool in sheetSnare) {
    if (Number(frameBool) === frames) {
      return sheetSnare[frameBool];
    }
  }
};

// Activating hi hat
const hiHatStart = function (frames) {
  for (frameBool in sheetHiHat) {
    if (Number(frameBool) === frames) {
      return sheetHiHat[frameBool];
    }
  }
};

// Main engine : moving the note down using setInterval, set on 60hz and 120BPM
const moveNote = function () {
  if (intervalId) return;

  let kickCount = 0;
  let downbeat = 0;
  let kickBool = false;
  const kick = 30;

  intervalId = setInterval(function movingNote() {
    // Kick
    console.log(kickStart(frames));
    if (kickStart(frames)) {
      kickBool = !kickBool;
    }

    if (frames % kick === 0 && kickBool) {
      generateDivNote("first");
      kickCount += kick;
      downbeat++;
      // drums.play("kick"); // to remove
    }

    // Snares
    if (snareStart(frames)) {
      if (frames % kick === 0 && downbeat % 2 === 0) {
        generateDivNote("second");
        // drums.play("snare"); // to remove
      }
    }

    // Hi-hat
    if (hiHatStart(frames)) {
      if (frames === kickCount - 15) {
        generateDivNote("third");
        // drums.play("hi-hat"); // to remove
      }
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
  // };q
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
      drums.play("kick");
      return 1;
    case "ArrowUp":
      drums.play("snare");
      return 2;
    case "ArrowDown":
      drums.play("hi-hat");
      return 3;
    case "ArrowRight":
      drums.play("bass");
      return 4;
  }
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
