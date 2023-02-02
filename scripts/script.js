const accuracyScore = {
  good: 10,
  bad: 0,
};

// Audio samples imported

const drums = new Howl({
  src: ["./audio/samples.webm", "./audio/samples.mp3"],
  sprite: {
    bass: [0, 3839.4104308390024],
    "hi-hat": [5000, 147.3015873015875],
    kick: [7000, 382.7664399092967],
    snare: [9000, 351.56462585034024],
  },
});

const melofx = new Howl({
  src: ["./audio1/melofx.webm", "./audio1/melofx.mp3"],
  sprite: {
    Bass1: [0, 761.3605442176871],
    Bass2: [2000, 676.5079365079365],
    ChordsAm2: [4000, 7933.90022675737],
    ChordsAm: [13000, 7933.90022675737],
    ChordsBbm: [22000, 7933.90022675737],
    Noise1: [31000, 15000],
    Noise2: [47000, 8008.344671201811],
  },
});

let score = 0;
let generatedDivArray = [];
let frames = 0;
let intervalId = null;

// Sheet music
const sheetKick = {
  0: false,
  1920: false, // 4 measures break
  2400: true,
};

const sheetSnare = {
  0: false, // to reverse
  960: false, // 8th measure
};

const sheetHiHat = {
  0: false,
  3360: true,
};

const sheetBass = {
  0: false,
  1920: true,
};

const sheetChords = {
  0: false,
  1920: true,
};

const sheetNoise = {
  0: false,
  1920: true,
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

// Parsing a music sheet (object) and returning true when a change happen
const kickStart = function (frames) {
  for (frameBool in sheetKick) {
    if (Number(frameBool) === frames) {
      return true;
    }
  }
};

// Activating Snare
const snareStart = function (frames) {
  for (frameBool in sheetSnare) {
    if (Number(frameBool) === frames) {
      return true;
    }
  }
};

// Activating hi hat
const hiHatStart = function (frames) {
  for (frameBool in sheetHiHat) {
    if (Number(frameBool) === frames) {
      return true;
    }
  }
};

// Activating bass
const bassStart = function (frames) {
  for (frameBool in sheetBass) {
    if (Number(frameBool) === frames) {
      return true;
    }
  }
};

// Activating chords
const chordsStart = function (frames) {
  for (frameBool in sheetChords) {
    if (Number(frameBool) === frames) {
      return true;
    }
  }
};

// Activating noise
const noiseStart = function (frames) {
  for (frameBool in sheetNoise) {
    if (Number(frameBool) === frames) {
      return true;
    }
  }
};

// Main engine : moving the note down using setInterval, set on 60hz and 120BPM
const moveNote = function () {
  if (intervalId) return;

  let beat = 0;
  let beatEight = 1;
  let downbeat = 1;
  let kickBool = false;
  let snareBool = true;
  let hiHatBool = true;
  let bassBool = true;
  let chordsBool = true;
  let noiseBool = false;

  const kick = 30;

  intervalId = setInterval(function movingNote() {
    // Activating or deactivating the kick pattern if a change happen
    if (kickStart(frames)) {
      kickBool = !kickBool;
    }

    if (snareStart(frames)) {
      snareBool = !snareBool;
    }

    if (hiHatStart(frames)) {
      hiHatBool = !hiHatBool;
    }

    if (bassStart(frames)) {
      bassBool = !bassBool;
    }

    if (chordsStart(frames)) {
      chordsBool = !chordsBool;
    }

    // Kick
    if (kickBool) {
      if (frames % kick === 0) {
        generateDivNote("first");
        //drums.play("kick"); // to remove
      }
    }

    // Snares
    if (snareBool) {
      if (frames % kick === 0 && downbeat % 2 === 0) {
        generateDivNote("second");
        //drums.play("snare"); // to remove
      }
    }

    // Hi-hat
    if (hiHatBool) {
      if (frames % beat === 15 || frames === 15) {
        generateDivNote("third");
        //drums.play("hi-hat"); // to remove
      }
    }

    // Bass
    if (bassBool) {
      if ((beatEight === 6 || beatEight === 3) && frames % beat === 15) {
        generateDivNote("fourth");
        //melofx.play("Bass2");
      }
    }

    // Chords
    if (chordsBool) {
      melofx.volume(0.3, "ChordsAm2");
      //melofx.play("ChordsAm2");
      chordsBool = !chordsBool;
    }

    // Chords
    if (noiseBool) {
      //melofx.play("Noise2");
      noiseBool = !noiseBool;
    }
    for (const note of generatedDivArray) {
      const noteStyle = getComputedStyle(note);
      let topValue = parseInt(noteStyle.getPropertyValue("top"));

      note.style.top = `${topValue + 4}px`;
      if (topValue >= 600) {
        removeNote(note);
      }
    }
    frames++;
    if (frames % 30 === 0) {
      beatEight++;
      if (beatEight === 8) {
        beatEight = 0;
      }
    }
    if (frames % kick === 0) {
      beat += kick;
      downbeat++;
    }

    if (frames === 2450) {
      document.querySelector(".dancing-dog").src = "./catrave.gif";
    }
  }, 1000 / 60);
};

// Highlighting a square upon keystroke
const highlightSquare = function (keyPressed) {
  switch (keyPressed) {
    case "f":
      document.querySelector(".one").classList.add("highlight");
      break;
    case "g":
      document.querySelector(".two").classList.add("highlight");
      break;
    case "h":
      document.querySelector(".three").classList.add("highlight");
      break;
    case "j":
      document.querySelector(".four").classList.add("highlight");
      break;
  }
};

// Removing the highlight when keyup
const unHighlight = function (keyPressed) {
  switch (keyPressed) {
    case "f":
      document.querySelector(".one").classList.remove("highlight");
      break;
    case "g":
      document.querySelector(".two").classList.remove("highlight");
      break;
    case "h":
      document.querySelector(".three").classList.remove("highlight");
      break;
    case "j":
      document.querySelector(".four").classList.remove("highlight");
      break;
  }
};

// Detecting accuracy + key and columns comparison + firing score incrementing / printing (too much)
const checkAccuracy = function (keyPressed) {
  const divOnSquare = generatedDivArray.some((div) => isOnSquare(div));
  if (generatedDivArray.length < 1) return;
  if (
    divOnSquare &&
    keyPressed ===
      detectColumn(generatedDivArray.find((div) => isOnSquare(div)))
  ) {
    printAccuracy(0);
    scoreIncrement();
    //generatedDivArray = generatedDivArray.filter((div) => !isOnSquare(div));
  } else {
    printAccuracy(1);
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
  if (div.dataset.column === "first") return 1;
  else if (div.dataset.column === "second") return 2;
  else if (div.dataset.column === "third") return 3;
  else return 4;
};

// Printing accuracy
const printAccuracy = function (scoreValue) {
  const accuracyPanel = document.querySelector(".accuracy-p");
  if (scoreValue === 1) {
    accuracyPanel.textContent = "OK!";
  } else {
    accuracyPanel.textContent = "BAD!";
  }
};

// Counting score
const scoreIncrement = function () {
  score += 10;
  scorePrint();
};

// Printing score
const scorePrint = function () {
  document.querySelector(".score").textContent = `${score}` + "!";
};

// Converting key pressed to a number (1 - 4)
const detectKeyPressed = function (keyPressed) {
  switch (keyPressed) {
    case "f":
      drums.play("kick");
      return 1;
    case "g":
      drums.play("snare");
      return 2;
    case "h":
      drums.play("hi-hat");
      return 3;
    case "j":
      melofx.play("Bass2");
      return 4;
  }
};

// Event listeners

document.querySelector("button").addEventListener("click", function () {
  moveNote();
  document.querySelector(".dancing-dog").style.display = "block";
});

window.addEventListener("keydown", (event) => {
  highlightSquare(event.key);
  checkAccuracy(detectKeyPressed(event.key));
});

window.addEventListener("keyup", (event) => {
  unHighlight(event.key);
});
